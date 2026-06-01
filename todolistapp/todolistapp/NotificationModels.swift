import Foundation

enum TodoNotificationFilter: String, Codable, CaseIterable, Identifiable {
    case all = "All Active"
    case dueToday = "Due Today"
    case overdue = "Overdue"
    case inbox = "Inbox"
    case repeating = "Repeating"
    case noDueDate = "No Due Date"
    case dueWithinDays = "Due Soon"

    var id: String { rawValue }
}

struct TodoNotificationGroup: Codable, Identifiable, Equatable {
    var id: String = UUID().uuidString
    var name: String = "Todo Reminder"
    var enabled: Bool = true
    var filter: TodoNotificationFilter = .dueToday
    var dueWithinDays: Int = 3
    var includeCompleted: Bool = false
    var includeDismissed: Bool = false
    var oneNotificationPerTask: Bool = false
    var maxTasks: Int = 5
    var maxNotifications: Int = 3
    var minuteSpacing: Int = 3
    var repeatsDaily: Bool = true
    var deliveryMinutes: [Int] = [9 * 60]
    var titlePrefix: String = "Todo"
    var bodyStyle: NotificationBodyStyle = .compact
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
