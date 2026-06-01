import Foundation

enum TodoNotificationFilter: String, Codable, CaseIterable, Identifiable {
    case all = "All Active"
    case specific = "Specific Todos"
    case dueToday = "Due Today"
    case overdue = "Overdue"
    case inbox = "Inbox"
    case repeating = "Repeating"
    case noDueDate = "No Due Date"
    case dueWithinDays = "Due Soon"

    var id: String { rawValue }
}

struct TodoNotificationGroup: Codable, Identifiable, Equatable {
    var id: String
    var name: String
    var enabled: Bool
    var filter: TodoNotificationFilter
    var specificTodoIds: [String]
    var dueWithinDays: Int
    var includeCompleted: Bool
    var includeDismissed: Bool
    var oneNotificationPerTask: Bool
    var maxTasks: Int
    var maxNotifications: Int
    var minuteSpacing: Int
    var repeatsDaily: Bool
    var deliveryMinutes: [Int]
    var titlePrefix: String
    var bodyStyle: NotificationBodyStyle

    init(
        id: String = UUID().uuidString,
        name: String = "Todo Reminder",
        enabled: Bool = true,
        filter: TodoNotificationFilter = .dueToday,
        specificTodoIds: [String] = [],
        dueWithinDays: Int = 3,
        includeCompleted: Bool = false,
        includeDismissed: Bool = false,
        oneNotificationPerTask: Bool = false,
        maxTasks: Int = 5,
        maxNotifications: Int = 3,
        minuteSpacing: Int = 3,
        repeatsDaily: Bool = true,
        deliveryMinutes: [Int] = [9 * 60],
        titlePrefix: String = "Todo",
        bodyStyle: NotificationBodyStyle = .compact
    ) {
        self.id = id
        self.name = name
        self.enabled = enabled
        self.filter = filter
        self.specificTodoIds = specificTodoIds
        self.dueWithinDays = dueWithinDays
        self.includeCompleted = includeCompleted
        self.includeDismissed = includeDismissed
        self.oneNotificationPerTask = oneNotificationPerTask
        self.maxTasks = maxTasks
        self.maxNotifications = maxNotifications
        self.minuteSpacing = minuteSpacing
        self.repeatsDaily = repeatsDaily
        self.deliveryMinutes = deliveryMinutes
        self.titlePrefix = titlePrefix
        self.bodyStyle = bodyStyle
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(String.self, forKey: .id) ?? UUID().uuidString
        name = try container.decodeIfPresent(String.self, forKey: .name) ?? "Todo Reminder"
        enabled = try container.decodeIfPresent(Bool.self, forKey: .enabled) ?? true
        filter = try container.decodeIfPresent(TodoNotificationFilter.self, forKey: .filter) ?? .dueToday
        specificTodoIds = try container.decodeIfPresent([String].self, forKey: .specificTodoIds) ?? []
        dueWithinDays = try container.decodeIfPresent(Int.self, forKey: .dueWithinDays) ?? 3
        includeCompleted = try container.decodeIfPresent(Bool.self, forKey: .includeCompleted) ?? false
        includeDismissed = try container.decodeIfPresent(Bool.self, forKey: .includeDismissed) ?? false
        oneNotificationPerTask = try container.decodeIfPresent(Bool.self, forKey: .oneNotificationPerTask) ?? false
        maxTasks = try container.decodeIfPresent(Int.self, forKey: .maxTasks) ?? 5
        maxNotifications = try container.decodeIfPresent(Int.self, forKey: .maxNotifications) ?? 3
        minuteSpacing = try container.decodeIfPresent(Int.self, forKey: .minuteSpacing) ?? 3
        repeatsDaily = try container.decodeIfPresent(Bool.self, forKey: .repeatsDaily) ?? true
        deliveryMinutes = try container.decodeIfPresent([Int].self, forKey: .deliveryMinutes) ?? [9 * 60]
        titlePrefix = try container.decodeIfPresent(String.self, forKey: .titlePrefix) ?? "Todo"
        bodyStyle = try container.decodeIfPresent(NotificationBodyStyle.self, forKey: .bodyStyle) ?? .compact
    }
}

enum NotificationBodyStyle: String, Codable, CaseIterable, Identifiable {
    case compact = "Compact"
    case detailed = "Detailed"
    case countOnly = "Count Only"

    var id: String { rawValue }
}

extension TodoNotificationGroup {
    static var sample: TodoNotificationGroup {
        TodoNotificationGroup(
            name: "Due Today",
            filter: .dueToday,
            maxTasks: 5,
            deliveryMinutes: [9 * 60, 17 * 60]
        )
    }
}
