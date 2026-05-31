import SwiftUI

struct PlanOfDayView: View {
    @EnvironmentObject private var store: SyncStore
    @State private var selectedDate = Date()
    @State private var contents = ""

    private var selectedKey: String {
        TodoListView.dateKey(selectedDate)
    }

    var body: some View {
        Form {
            DatePicker("Date", selection: $selectedDate, displayedComponents: .date)

            Section("Plan") {
                TextEditor(text: $contents)
                    .frame(minHeight: 300)
                    .onChange(of: contents) { _, newValue in
                        store.updatePlan(date: selectedKey, contents: newValue)
                    }
            }

            Section("Saved Days") {
                let days = store.plan.plans.keys.sorted(by: >)
                if days.isEmpty {
                    Text("No plans yet")
                        .foregroundStyle(.secondary)
                } else {
                    ForEach(days, id: \.self) { day in
                        Button {
                            selectedDate = Self.date(from: day) ?? Date()
                        } label: {
                            HStack {
                                Text(day)
                                Spacer()
                                Text(store.plan.plans[day] ?? "")
                                    .lineLimit(1)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
            }
        }
        .navigationTitle("Plan of the Day")
        .toolbar {
            SyncToolbar()
        }
        .onAppear(perform: loadSelectedPlan)
        .onChange(of: selectedDate) { _, _ in
            loadSelectedPlan()
        }
        .onChange(of: store.plan) { _, _ in
            loadSelectedPlan()
        }
        .safeAreaInset(edge: .bottom) {
            SyncStatusView()
        }
    }

    private func loadSelectedPlan() {
        let next = store.plan.plans[selectedKey] ?? ""
        if contents != next {
            contents = next
        }
    }

    private static func date(from key: String) -> Date? {
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.date(from: key)
    }
}
