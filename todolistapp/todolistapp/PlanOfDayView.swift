import SwiftUI
import UIKit

struct PlanOfDayView: View {
    @EnvironmentObject private var store: SyncStore
    @State private var selectedDate = Date()
    @State private var contents = ""
    @FocusState private var isEditingPlan: Bool

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
                    .onChange(of: contents) { _, newValue in
                        store.updatePlan(date: selectedKey, contents: newValue)
                    }
            }
        }
        .background(PlanOutsideTapDismissView(isEditingPlan: $isEditingPlan))
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

private struct PlanOutsideTapDismissView: UIViewRepresentable {
    var isEditingPlan: FocusState<Bool>.Binding

    func makeUIView(context: Context) -> UIView {
        let view = UIView()
        view.backgroundColor = .clear
        context.coordinator.hostView = view
        DispatchQueue.main.async {
            context.coordinator.attachRecognizerIfNeeded()
        }
        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        context.coordinator.parent = self
        DispatchQueue.main.async {
            context.coordinator.attachRecognizerIfNeeded()
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    final class Coordinator: NSObject, UIGestureRecognizerDelegate {
        var parent: PlanOutsideTapDismissView
        weak var hostView: UIView?
        private weak var recognizer: UITapGestureRecognizer?

        init(parent: PlanOutsideTapDismissView) {
            self.parent = parent
        }

        func attachRecognizerIfNeeded() {
            guard recognizer == nil, let window = hostView?.window else { return }
            let recognizer = UITapGestureRecognizer(target: self, action: #selector(handleTap))
            recognizer.cancelsTouchesInView = false
            recognizer.delegate = self
            window.addGestureRecognizer(recognizer)
            self.recognizer = recognizer
        }

        @objc private func handleTap() {
            parent.isEditingPlan.wrappedValue = false
        }

        func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
            !touch.view.isDescendant(of: UITextView.self)
        }
    }
}

private extension Optional where Wrapped == UIView {
    func isDescendant(of viewType: UIView.Type) -> Bool {
        var view = self
        while let current = view {
            if current.isKind(of: viewType) {
                return true
            }
            view = current.superview
        }
        return false
    }
}
