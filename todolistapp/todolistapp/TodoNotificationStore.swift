import Combine
import Foundation
import UserNotifications

@MainActor
final class TodoNotificationStore: ObservableObject {
    @Published var groups: [TodoNotificationGroup] = [] {
        didSet { save() }
    }
    @Published var authorizationStatus: UNAuthorizationStatus = .notDetermined
    @Published var pendingCount = 0
    @Published var status = "Notifications not scheduled"
    @Published var errorMessage: String?

    private let defaultsKey = "todo.notification.groups"
    private let identifierPrefix = "todo-notification"
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    init() {
        load()
        if groups.isEmpty {
            groups = [.sample]
        }
        Task {
            await refreshStatus()
        }
    }

    func refreshStatus() async {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        authorizationStatus = settings.authorizationStatus
        let requests = await UNUserNotificationCenter.current().pendingNotificationRequests()
        pendingCount = requests.filter { $0.identifier.hasPrefix(identifierPrefix) }.count
    }

    func requestPermission() async {
        do {
            _ = try await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound])
            await refreshStatus()
            status = "Permission updated"
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func addGroup() {
        groups.append(
            TodoNotificationGroup(
                name: "New Group",
                filter: .dueToday,
                deliveryMinutes: [9 * 60]
            )
        )
    }

    func duplicateGroup(_ group: TodoNotificationGroup) {
        var copy = group
        copy.id = UUID().uuidString
        copy.name = "\(group.name) Copy"
        groups.append(copy)
    }

    func deleteGroup(_ group: TodoNotificationGroup) {
        groups.removeAll { $0.id == group.id }
        Task {
            await removeScheduledNotifications(groupId: group.id)
        }
    }

    func updateGroup(_ group: TodoNotificationGroup) {
        guard let index = groups.firstIndex(where: { $0.id == group.id }) else { return }
        groups[index] = group
    }

    func scheduleAll(todos: [TodoItem]) async {
        await cancelAll()
        for group in groups where group.enabled {
            await schedule(group: group, todos: todos)
        }
        await refreshStatus()
        status = "Scheduled \(pendingCount) notifications"
    }

    func schedule(group: TodoNotificationGroup, todos: [TodoItem]) async {
        await removeScheduledNotifications(groupId: group.id)
        guard authorizationStatus == .authorized || authorizationStatus == .provisional || authorizationStatus == .ephemeral else {
            status = "Notification permission needed"
            return
        }

        let matches = matchingTodos(for: group, todos: todos)
        guard !matches.isEmpty else {
            status = "No matching todos for \(group.name)"
            return
        }

        do {
            let requests = makeRequests(group: group, todos: matches)
            for request in requests {
                try await UNUserNotificationCenter.current().add(request)
            }
            await refreshStatus()
            status = "Scheduled \(requests.count) for \(group.name)"
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func cancelAll() async {
        let center = UNUserNotificationCenter.current()
        let requests = await center.pendingNotificationRequests()
        let ids = requests
            .map(\.identifier)
            .filter { $0.hasPrefix(identifierPrefix) }
        center.removePendingNotificationRequests(withIdentifiers: ids)
        await refreshStatus()
        status = "Canceled todo notifications"
    }

    func sendTest(group: TodoNotificationGroup, todos: [TodoItem]) async {
        guard authorizationStatus == .authorized || authorizationStatus == .provisional || authorizationStatus == .ephemeral else {
            status = "Notification permission needed"
            return
        }

        let matches = matchingTodos(for: group, todos: todos)
        let content = makeContent(group: group, todos: Array(matches.prefix(group.maxTasks)))
        let request = UNNotificationRequest(
            identifier: "\(identifierPrefix)-test-\(UUID().uuidString)",
            content: content,
            trigger: UNTimeIntervalNotificationTrigger(timeInterval: 5, repeats: false)
        )

        do {
            try await UNUserNotificationCenter.current().add(request)
            status = "Test notification scheduled"
            await refreshStatus()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func matchingTodos(for group: TodoNotificationGroup, todos: [TodoItem]) -> [TodoItem] {
        Self.matchingTodos(for: group, todos: todos)
    }

    static func matchingTodos(for group: TodoNotificationGroup, todos: [TodoItem]) -> [TodoItem] {
        todos
            .filter { todo in
                if todo.dismissed == true && !group.includeDismissed { return false }
                if todo.completed && !group.includeCompleted { return false }
                return Self.matchesFilter(todo, group: group)
            }
            .sorted { lhs, rhs in
                let leftDate = lhs.dueDate ?? "9999-99-99"
                let rightDate = rhs.dueDate ?? "9999-99-99"
                if leftDate != rightDate {
                    return leftDate < rightDate
                }
                return lhs.contents < rhs.contents
            }
    }

    private static func matchesFilter(_ todo: TodoItem, group: TodoNotificationGroup) -> Bool {
        switch group.filter {
        case .all:
            return true
        case .specific:
            return group.specificTodoIds.contains(todo.id)
        case .dueToday:
            return isDueToday(todo) || repeatsToday(todo)
        case .overdue:
            guard let dueDate = todo.dueDate else { return false }
            return dueDate < Self.todayKey()
        case .inbox:
            guard let dueDate = todo.dueDate else { return true }
            return dueDate > Self.todayKey()
        case .repeating:
            return todo.repeat != nil
        case .noDueDate:
            return todo.dueDate == nil
        case .dueWithinDays:
            guard let dueDate = Self.date(from: todo.dueDate) else { return false }
            let end = Calendar.current.date(byAdding: .day, value: group.dueWithinDays, to: Date()) ?? Date()
            return dueDate >= Calendar.current.startOfDay(for: Date()) && dueDate <= end
        }
    }

    private static func isDueToday(_ todo: TodoItem) -> Bool {
        guard let dueDate = todo.dueDate else { return false }
        return dueDate <= Self.todayKey()
    }

    private static func repeatsToday(_ todo: TodoItem) -> Bool {
        guard let rule = todo.repeat else { return false }
        if let dueDate = todo.dueDate, dueDate > Self.todayKey() { return false }
        let weekday = Calendar.current.component(.weekday, from: Date()) - 1
        switch rule.type {
        case "daily":
            return true
        case "weekly", "custom":
            return (rule.days ?? []).contains(weekday)
        default:
            return false
        }
    }

    private func makeRequests(group: TodoNotificationGroup, todos: [TodoItem]) -> [UNNotificationRequest] {
        let selectedTodos = Array(todos.prefix(group.maxTasks))
        let times = group.deliveryMinutes.isEmpty ? [9 * 60] : group.deliveryMinutes
        var requests: [UNNotificationRequest] = []

        for timeIndex in times.indices {
            let baseMinutes = times[timeIndex]
            if group.oneNotificationPerTask {
                for todoIndex in selectedTodos.indices.prefix(group.maxNotifications) {
                    let todo = selectedTodos[todoIndex]
                    let content = makeContent(group: group, todos: [todo])
                    let minutes = baseMinutes + todoIndex * max(1, group.minuteSpacing)
                    let trigger = makeTrigger(minutesFromMidnight: minutes, repeats: group.repeatsDaily)
                    let id = "\(identifierPrefix)-\(group.id)-\(timeIndex)-\(todoIndex)"
                    requests.append(UNNotificationRequest(identifier: id, content: content, trigger: trigger))
                }
            } else {
                let content = makeContent(group: group, todos: selectedTodos)
                let trigger = makeTrigger(minutesFromMidnight: baseMinutes, repeats: group.repeatsDaily)
                let id = "\(identifierPrefix)-\(group.id)-\(timeIndex)"
                requests.append(UNNotificationRequest(identifier: id, content: content, trigger: trigger))
            }
        }

        return Array(requests.prefix(min(64, max(1, group.maxNotifications))))
    }

    private func makeContent(group: TodoNotificationGroup, todos: [TodoItem]) -> UNMutableNotificationContent {
        let content = UNMutableNotificationContent()
        content.sound = .default
        content.title = "\(group.titlePrefix): \(group.name)"

        switch group.bodyStyle {
        case .compact:
            content.body = todos.map(\.contents).joined(separator: ", ")
        case .detailed:
            content.body = todos.map { todo in
                if let dueDate = todo.dueDate {
                    return "\(todo.contents) (\(dueDate))"
                }
                return todo.contents
            }.joined(separator: "\n")
        case .countOnly:
            content.body = "\(todos.count) matching todo\(todos.count == 1 ? "" : "s")"
        }

        if content.body.isEmpty {
            content.body = "No matching todos right now."
        }
        return content
    }

    private func makeTrigger(minutesFromMidnight: Int, repeats: Bool) -> UNCalendarNotificationTrigger {
        let normalized = ((minutesFromMidnight % (24 * 60)) + (24 * 60)) % (24 * 60)
        let hour = normalized / 60
        let minute = normalized % 60
        var components = DateComponents()
        components.hour = hour
        components.minute = minute

        if !repeats {
            let next = nextDate(hour: hour, minute: minute)
            components.year = Calendar.current.component(.year, from: next)
            components.month = Calendar.current.component(.month, from: next)
            components.day = Calendar.current.component(.day, from: next)
        }

        return UNCalendarNotificationTrigger(dateMatching: components, repeats: repeats)
    }

    private func nextDate(hour: Int, minute: Int) -> Date {
        var components = Calendar.current.dateComponents([.year, .month, .day], from: Date())
        components.hour = hour
        components.minute = minute
        let candidate = Calendar.current.date(from: components) ?? Date()
        if candidate > Date() {
            return candidate
        }
        return Calendar.current.date(byAdding: .day, value: 1, to: candidate) ?? candidate
    }

    private func removeScheduledNotifications(groupId: String) async {
        let center = UNUserNotificationCenter.current()
        let requests = await center.pendingNotificationRequests()
        let ids = requests
            .map(\.identifier)
            .filter { $0.hasPrefix("\(identifierPrefix)-\(groupId)") }
        center.removePendingNotificationRequests(withIdentifiers: ids)
        await refreshStatus()
    }

    private func save() {
        guard let data = try? encoder.encode(groups) else { return }
        UserDefaults.standard.set(data, forKey: defaultsKey)
    }

    private func load() {
        guard let data = UserDefaults.standard.data(forKey: defaultsKey),
              let saved = try? decoder.decode([TodoNotificationGroup].self, from: data) else {
            return
        }
        groups = saved
    }

    private static func todayKey() -> String {
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: Date())
    }

    private static func date(from key: String?) -> Date? {
        guard let key else { return nil }
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.date(from: key)
    }
}
