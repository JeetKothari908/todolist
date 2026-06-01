import SwiftUI
import UserNotifications

struct NotificationSettingsView: View {
    @EnvironmentObject private var store: SyncStore
    @StateObject private var notificationStore = TodoNotificationStore()
    @State private var editingGroup: TodoNotificationGroup?

    var body: some View {
        List {
            Section {
                AppLogoHeader()
            }

            Section("Permission") {
                HStack {
                    Text("Status")
                    Spacer()
                    Text(permissionText)
                        .foregroundStyle(.secondary)
                }

                Button {
                    Task { await notificationStore.requestPermission() }
                } label: {
                    Label("Request Permission", systemImage: "bell.badge")
                }

                HStack {
                    Text("Pending")
                    Spacer()
                    Text("\(notificationStore.pendingCount)")
                        .foregroundStyle(.secondary)
                }
            }

            Section {
                Button {
                    Task { await notificationStore.scheduleAll(todos: store.todos.items) }
                } label: {
                    Label("Schedule Enabled Groups", systemImage: "calendar.badge.clock")
                }

                Button(role: .destructive) {
                    Task { await notificationStore.cancelAll() }
                } label: {
                    Label("Cancel Todo Notifications", systemImage: "bell.slash")
                }
            }

            Section("Groups") {
                ForEach(notificationStore.groups) { group in
                    Button {
                        editingGroup = group
                    } label: {
                        NotificationGroupRow(
                            group: group,
                            matches: notificationStore.matchingTodos(for: group, todos: store.todos.items)
                        )
                    }
                    .swipeActions {
                        Button(role: .destructive) {
                            notificationStore.deleteGroup(group)
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }

                        Button {
                            notificationStore.duplicateGroup(group)
                        } label: {
                            Label("Duplicate", systemImage: "doc.on.doc")
                        }
                        .tint(.blue)
                    }
                }

                Button {
                    notificationStore.addGroup()
                } label: {
                    Label("Add Group", systemImage: "plus")
                }
            }

            Section("Status") {
                Text(notificationStore.status)
                    .foregroundStyle(.secondary)
                if let errorMessage = notificationStore.errorMessage {
                    Text(errorMessage)
                        .foregroundStyle(.red)
                }
            }
        }
        .navigationTitle("Notifications")
        .toolbar {
            SyncToolbar()
        }
        .task {
            await notificationStore.refreshStatus()
        }
        .sheet(item: $editingGroup) { group in
            NotificationGroupEditorView(
                group: group,
                allTodos: store.todos.items,
                onSave: { next in
                    notificationStore.updateGroup(next)
                },
                onSchedule: { next in
                    notificationStore.updateGroup(next)
                    Task { await notificationStore.schedule(group: next, todos: store.todos.items) }
                },
                onTest: { next in
                    notificationStore.updateGroup(next)
                    Task { await notificationStore.sendTest(group: next, todos: store.todos.items) }
                }
            )
        }
    }

    private var permissionText: String {
        switch notificationStore.authorizationStatus {
        case .authorized:
            return "Allowed"
        case .denied:
            return "Denied"
        case .notDetermined:
            return "Not Asked"
        case .provisional:
            return "Provisional"
        case .ephemeral:
            return "Ephemeral"
        @unknown default:
            return "Unknown"
        }
    }
}

struct AppLogoHeader: View {
    var body: some View {
        HStack(spacing: 12) {
            Image("TodolistLogo")
                .resizable()
                .scaledToFit()
                .frame(width: 44, height: 44)
                .clipShape(RoundedRectangle(cornerRadius: 8))
            VStack(alignment: .leading, spacing: 2) {
                Text("To Do List")
                    .font(.headline)
                Text("Synced todos, notes, plans, and reminders")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
}

private struct NotificationGroupRow: View {
    let group: TodoNotificationGroup
    let matches: [TodoItem]

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(group.name)
                    .font(.headline)
                Spacer()
                Text(group.enabled ? "On" : "Off")
                    .font(.caption)
                    .foregroundStyle(group.enabled ? .green : .secondary)
            }

            Text("\(group.filter.rawValue) • \(matches.count) match\(matches.count == 1 ? "" : "es")")
                .font(.caption)
                .foregroundStyle(.secondary)

            Text(scheduleSummary)
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .foregroundStyle(.primary)
    }

    private var scheduleSummary: String {
        let times = group.deliveryMinutes
            .sorted()
            .map(Self.timeString)
            .joined(separator: ", ")
        let style = group.oneNotificationPerTask ? "per task" : "summary"
        return "\(times.isEmpty ? "No times" : times) • \(style) • max \(group.maxNotifications)"
    }

    private static func timeString(_ minutes: Int) -> String {
        let hour = minutes / 60
        let minute = minutes % 60
        return String(format: "%02d:%02d", hour, minute)
    }
}

private struct NotificationGroupEditorView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var group: TodoNotificationGroup
    let allTodos: [TodoItem]
    let onSave: (TodoNotificationGroup) -> Void
    let onSchedule: (TodoNotificationGroup) -> Void
    let onTest: (TodoNotificationGroup) -> Void

    init(
        group: TodoNotificationGroup,
        allTodos: [TodoItem],
        onSave: @escaping (TodoNotificationGroup) -> Void,
        onSchedule: @escaping (TodoNotificationGroup) -> Void,
        onTest: @escaping (TodoNotificationGroup) -> Void
    ) {
        _group = State(initialValue: group)
        self.allTodos = allTodos
        self.onSave = onSave
        self.onSchedule = onSchedule
        self.onTest = onTest
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Group") {
                    TextField("Name", text: $group.name)
                    Toggle("Enabled", isOn: $group.enabled)
                    TextField("Notification Title Prefix", text: $group.titlePrefix)
                }

                Section("Matching") {
                    Picker("Type", selection: $group.filter) {
                        ForEach(TodoNotificationFilter.allCases) { filter in
                            Text(filter.rawValue).tag(filter)
                        }
                    }

                    if group.filter == .dueWithinDays {
                        Stepper("Within \(group.dueWithinDays) day\(group.dueWithinDays == 1 ? "" : "s")", value: $group.dueWithinDays, in: 1...30)
                    }

                    Toggle("Include Completed", isOn: $group.includeCompleted)
                    Toggle("Include Dismissed", isOn: $group.includeDismissed)
                    Stepper("Max Tasks In Body: \(group.maxTasks)", value: $group.maxTasks, in: 1...25)
                }

                Section("Delivery") {
                    Toggle("One Notification Per Task", isOn: $group.oneNotificationPerTask)
                    Stepper("Max Notifications: \(group.maxNotifications)", value: $group.maxNotifications, in: 1...64)
                    if group.oneNotificationPerTask {
                        Stepper("Spacing: \(group.minuteSpacing) min", value: $group.minuteSpacing, in: 1...60)
                    }
                    Toggle("Repeat Daily", isOn: $group.repeatsDaily)
                    Picker("Body Style", selection: $group.bodyStyle) {
                        ForEach(NotificationBodyStyle.allCases) { style in
                            Text(style.rawValue).tag(style)
                        }
                    }
                }

                Section("Times") {
                    ForEach(group.deliveryMinutes.indices, id: \.self) { index in
                        HStack {
                            DatePicker(
                                "Time \(index + 1)",
                                selection: Binding(
                                    get: { Self.date(fromMinutes: group.deliveryMinutes[index]) },
                                    set: { group.deliveryMinutes[index] = Self.minutes(from: $0) }
                                ),
                                displayedComponents: .hourAndMinute
                            )
                            Button(role: .destructive) {
                                group.deliveryMinutes.remove(at: index)
                            } label: {
                                Image(systemName: "minus.circle")
                            }
                            .buttonStyle(.borderless)
                        }
                    }

                    Button {
                        group.deliveryMinutes.append(9 * 60)
                        group.deliveryMinutes.sort()
                    } label: {
                        Label("Add Time", systemImage: "plus")
                    }
                }

                Section("Preview") {
                    let previewTodos = TodoNotificationStore.matchingTodos(for: group, todos: allTodos)
                    let capped = Array(previewTodos.prefix(group.maxTasks))
                    if capped.isEmpty {
                        Text("No todos match this group right now.")
                            .foregroundStyle(.secondary)
                    } else {
                        ForEach(capped) { todo in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(todo.contents)
                                if let dueDate = todo.dueDate {
                                    Text(dueDate)
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                            }
                        }
                    }
                }

                Section {
                    Button {
                        onTest(group)
                    } label: {
                        Label("Send Test In 5 Seconds", systemImage: "paperplane")
                    }

                    Button {
                        onSchedule(group)
                        dismiss()
                    } label: {
                        Label("Schedule This Group", systemImage: "calendar.badge.plus")
                    }
                }
            }
            .navigationTitle("Notification Group")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        onSave(group)
                        dismiss()
                    }
                    .disabled(group.name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }

    private static func date(fromMinutes minutes: Int) -> Date {
        var components = Calendar.current.dateComponents([.year, .month, .day], from: Date())
        components.hour = minutes / 60
        components.minute = minutes % 60
        return Calendar.current.date(from: components) ?? Date()
    }

    private static func minutes(from date: Date) -> Int {
        let components = Calendar.current.dateComponents([.hour, .minute], from: date)
        return (components.hour ?? 0) * 60 + (components.minute ?? 0)
    }
}

#Preview {
    NavigationStack {
        NotificationSettingsView()
            .environmentObject(SyncStore())
    }
}
