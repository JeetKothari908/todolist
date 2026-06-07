import SwiftUI

struct PlanOfDayView: View {
    @EnvironmentObject private var store: SyncStore
    @State private var selectedDate = Date()
    @State private var contents = ""
    @State private var editorFrame = CGRect.zero
    @FocusState private var isEditingPlan: Bool

    private let formCoordinateSpace = "planOfDayForm"

    private var selectedKey: String {
        TodoListView.dateKey(selectedDate)
    }

    var body: some View {
        Form {
            DatePicker("Date", selection: $selectedDate, displayedComponents: .date)

            Section("Plan") {
                TextEditor(text: $contents)
                    .focused($isEditingPlan)
                    .frame(minHeight: 300)
                    .background(
                        GeometryReader { proxy in
                            Color.clear.preference(
                                key: PlanEditorFramePreferenceKey.self,
                                value: proxy.frame(in: .named(formCoordinateSpace))
                            )
                        }
                    )
                    .onChange(of: contents) { _, newValue in
                        store.updatePlan(date: selectedKey, contents: newValue)
                    }
            }
        }
        .coordinateSpace(name: formCoordinateSpace)
        .simultaneousGesture(
            SpatialTapGesture(coordinateSpace: .named(formCoordinateSpace))
                .onEnded { value in
                    if !editorFrame.contains(value.location) {
                        isEditingPlan = false
                    }
                }
        )
        .onPreferenceChange(PlanEditorFramePreferenceKey.self) { frame in
            editorFrame = frame
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

private struct PlanEditorFramePreferenceKey: PreferenceKey {
    static var defaultValue: CGRect = .zero

    static func reduce(value: inout CGRect, nextValue: () -> CGRect) {
        value = nextValue()
    }
}
