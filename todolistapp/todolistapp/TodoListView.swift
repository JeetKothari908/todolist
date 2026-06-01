import SwiftUI

struct TodoListView: View {
    @EnvironmentObject private var store: SyncStore
    @State private var newTodo = ""
    @State private var dueDate = Date()
    @State private var useDueDate = false
    @State private var repeatMode = RepeatMode.none
    @State private var selectedRepeatDays: Set<Int> = []

    private var todayKey: String { SyncStore.todayKey() }
    private var todayWeekday: Int { Calendar.current.component(.weekday, from: Date()) - 1 }

    private var dueToday: [TodoItem] {
        store.activeTodos
            .filter { item in
                if itemRepeatsToday(item) { return true }
                guard let dueDate = item.dueDate else { return false }
                return dueDate <= todayKey
            }
            .sorted { ($0.dueDate ?? "") < ($1.dueDate ?? "") }
    }

    private var inbox: [TodoItem] {
        store.activeTodos
            .filter { item in
                guard let dueDate = item.dueDate else { return true }
                return dueDate > todayKey
            }
            .sorted { ($0.dueDate ?? "9999-99-99") < ($1.dueDate ?? "9999-99-99") }
    }

    var body: some View {
        List {
            Section {
                TextField("New task", text: $newTodo)
                    .submitLabel(.done)
                    .onSubmit(addTodo)

                Toggle("Due date", isOn: $useDueDate)
                if useDueDate {
                    DatePicker("Due", selection: $dueDate, displayedComponents: .date)
                }

                RepeatControls(mode: $repeatMode, selectedDays: $selectedRepeatDays)

                Button("Add Task", action: addTodo)
                    .disabled(newTodo.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }

            TodoSection(title: "Due Today", items: dueToday)
            TodoSection(title: "Inbox", items: inbox)
            TodoSection(title: "Finished", items: store.finishedTodos)
        }
        .navigationTitle("Todos")
        .toolbar {
            SyncToolbar()
        }
        .safeAreaInset(edge: .bottom) {
            SyncStatusView()
        }
    }

    private func addTodo() {
        store.addTodo(
            newTodo,
            dueDate: useDueDate ? Self.dateKey(dueDate) : nil,
            repeatRule: repeatMode.rule(days: selectedRepeatDays, fallbackDay: Calendar.current.component(.weekday, from: dueDate) - 1)
        )
        newTodo = ""
        useDueDate = false
        repeatMode = .none
        selectedRepeatDays = []
    }

    private func itemRepeatsToday(_ item: TodoItem) -> Bool {
        guard let repeatRule = item.repeat else { return false }
        if let dueDate = item.dueDate, dueDate > todayKey { return false }
        switch repeatRule.type {
        case "daily":
            return true
        case "weekly", "custom":
            let days = repeatRule.days ?? []
            return days.contains(todayWeekday)
        default:
            return false
        }
    }

    static func dateKey(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }
}

private enum RepeatMode: String, CaseIterable, Identifiable {
    case none = "None"
    case daily = "Daily"
    case weekly = "Weekly"
    case custom = "Custom"

    var id: String { rawValue }

    init(rule: RepeatRule?) {
        switch rule?.type {
        case "daily":
            self = .daily
        case "weekly":
            self = .weekly
        case "custom":
            self = .custom
        default:
            self = .none
        }
    }

    func rule(days: Set<Int>, fallbackDay: Int) -> RepeatRule? {
        switch self {
        case .none:
            return nil
        case .daily:
            return RepeatRule(type: "daily")
        case .weekly:
            let sorted = days.sorted()
            return RepeatRule(type: "weekly", days: sorted.isEmpty ? [fallbackDay] : sorted)
        case .custom:
            let sorted = days.sorted()
            return sorted.isEmpty ? nil : RepeatRule(type: "custom", days: sorted)
        }
    }
}

private struct RepeatControls: View {
    @Binding var mode: RepeatMode
    @Binding var selectedDays: Set<Int>

    private let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    var body: some View {
        Picker("Repeat", selection: $mode) {
            ForEach(RepeatMode.allCases) { mode in
                Text(mode.rawValue).tag(mode)
            }
        }

        if mode == .custom {
            VStack(alignment: .leading, spacing: 10) {
                Text("Repeat Days")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                HStack {
                    ForEach(dayNames.indices, id: \.self) { index in
                        Button {
                            if selectedDays.contains(index) {
                                selectedDays.remove(index)
                            } else {
                                selectedDays.insert(index)
                            }
                        } label: {
                            Text(dayNames[index])
                                .font(.caption)
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.bordered)
                        .tint(selectedDays.contains(index) ? Color.accentColor : Color.gray)
                    }
                }
            }
        }
    }
}

private struct TodoSection: View {
    @EnvironmentObject private var store: SyncStore
    let title: String
    let items: [TodoItem]

    var body: some View {
        Section(title) {
            if items.isEmpty {
                Text("Nothing here")
                    .foregroundStyle(.secondary)
            } else {
                ForEach(items) { item in
                    TodoRow(item: item)
                }
            }
        }
    }
}

private struct TodoRow: View {
    @EnvironmentObject private var store: SyncStore
    let item: TodoItem
    @State private var editorOpen = false

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: 12) {
            Button {
                store.toggleTodo(item)
            } label: {
                Image(systemName: item.completed ? "checkmark.circle.fill" : "circle")
                    .font(.title3)
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 4) {
                Text(item.contents)
                    .strikethrough(item.completed)
                if let dueDate = item.dueDate {
                    Text(dueDate)
                        .font(.caption)
                        .foregroundStyle(dueDate < SyncStore.todayKey() ? .red : .secondary)
                }
                if let repeatLabel = item.repeat?.displayLabel {
                    Text(repeatLabel)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            Spacer()

            Button {
                editorOpen = true
            } label: {
                Image(systemName: "slider.horizontal.3")
            }
            .buttonStyle(.borderless)

            if item.dismissed != true {
                Button {
                    store.dismissTodo(item)
                } label: {
                    Image(systemName: "archivebox")
                }
                .buttonStyle(.borderless)
            }
        }
        .swipeActions(edge: .trailing) {
            Button(role: .destructive) {
                store.deleteTodo(item)
            } label: {
                Label("Delete", systemImage: "trash")
            }
        }
        .sheet(isPresented: $editorOpen) {
            TodoEditorView(item: item)
                .environmentObject(store)
        }
    }
}

private struct TodoEditorView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var store: SyncStore
    let item: TodoItem

    @State private var contents: String
    @State private var dueDate: Date
    @State private var useDueDate: Bool
    @State private var repeatMode: RepeatMode
    @State private var selectedRepeatDays: Set<Int>

    init(item: TodoItem) {
        self.item = item
        _contents = State(initialValue: item.contents)
        _dueDate = State(initialValue: Self.date(from: item.dueDate) ?? Date())
        _useDueDate = State(initialValue: item.dueDate != nil)
        _repeatMode = State(initialValue: RepeatMode(rule: item.repeat))
        _selectedRepeatDays = State(initialValue: Set(item.repeat?.days ?? []))
    }

    var body: some View {
        NavigationStack {
            Form {
                TextField("Task", text: $contents)
                Toggle("Due date", isOn: $useDueDate)
                if useDueDate {
                    DatePicker("Due", selection: $dueDate, displayedComponents: .date)
                }
                RepeatControls(mode: $repeatMode, selectedDays: $selectedRepeatDays)
            }
            .navigationTitle("Edit Task")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        store.updateTodo(
                            item,
                            contents: contents,
                            dueDate: useDueDate ? TodoListView.dateKey(dueDate) : nil,
                            repeatRule: repeatMode.rule(
                                days: selectedRepeatDays,
                                fallbackDay: Calendar.current.component(.weekday, from: dueDate) - 1
                            )
                        )
                        dismiss()
                    }
                    .disabled(contents.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
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

private extension RepeatRule {
    var displayLabel: String? {
        switch type {
        case "daily":
            return "Repeats daily"
        case "weekly":
            return "Repeats weekly"
        case "custom":
            let names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            let labels = (days ?? []).compactMap { names.indices.contains($0) ? names[$0] : nil }
            return labels.isEmpty ? "Repeats custom" : "Repeats \(labels.joined(separator: ", "))"
        default:
            return nil
        }
    }
}
