import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var store: SyncStore

    var body: some View {
        TabView {
            NavigationStack {
                TodoListView()
            }
            .tabItem {
                Label("Todos", systemImage: "checklist")
            }

            NavigationStack {
                NotesView()
            }
            .tabItem {
                Label("Notes", systemImage: "note.text")
            }

            NavigationStack {
                PlanOfDayView()
            }
            .tabItem {
                Label("Plan", systemImage: "calendar")
            }

            NavigationStack {
                NotificationSettingsView()
            }
            .tabItem {
                Label("Alerts", systemImage: "bell.badge")
            }
        }
        .task {
            await store.refresh()
        }
    }
}

struct SyncToolbar: ToolbarContent {
    var body: some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            SyncButtons()
        }
    }
}

private struct SyncButtons: View {
    @EnvironmentObject private var store: SyncStore
    @State private var settingsOpen = false

    var body: some View {
        HStack(spacing: 14) {
            Button {
                Task { await store.refresh() }
            } label: {
                Image(systemName: "arrow.clockwise")
            }
            .disabled(store.isSyncing)

            Button {
                settingsOpen = true
            } label: {
                Image(systemName: "gearshape")
            }
        }
        .sheet(isPresented: $settingsOpen) {
            SyncSettingsView()
                .environmentObject(store)
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(SyncStore())
}
