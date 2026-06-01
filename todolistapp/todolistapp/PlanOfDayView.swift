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

}
