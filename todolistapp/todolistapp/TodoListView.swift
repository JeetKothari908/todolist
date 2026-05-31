import SwiftUI

struct TodoListView: View {
    @EnvironmentObject private var store: SyncStore
    @State private var newTodo = ""
    @State private var dueDate = Date()
    @State private var useDueDate = false

    private var todayKey: String { SyncStore.todayKey() }

    private var dueToday: [TodoItem] {
        store.activeTodos
            .filter { item in
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
        store.addTodo(newTodo, dueDate: useDueDate ? Self.dateKey(dueDate) : nil)
        newTodo = ""
        useDueDate = false
    }

    static func dateKey(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
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
            }

            Spacer()

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
    }
}
