import SwiftUI

struct NotesView: View {
    @EnvironmentObject private var store: SyncStore
    @State private var editorNote: NoteNode?
    @State private var creatingNote = false

    var body: some View {
        List {
            if store.liveNotes.isEmpty {
                ContentUnavailableView("No Notes", systemImage: "note.text", description: Text("Create a note here and it will sync to the extension."))
            } else {
                ForEach(store.liveNotes.sorted { $0.name < $1.name }) { note in
                    Button {
                        editorNote = note
                    } label: {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(note.name)
                                .font(.headline)
                            Text(note.contents ?? "")
                                .lineLimit(2)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .swipeActions {
                        Button(role: .destructive) {
                            store.deleteNote(note)
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }
                    }
                }
            }
        }
        .navigationTitle("Notes")
        .toolbar {
            SyncToolbar()
            ToolbarItem(placement: .topBarLeading) {
                Button {
                    creatingNote = true
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(item: $editorNote) { note in
            NoteEditorView(mode: .edit(note))
                .environmentObject(store)
        }
        .sheet(isPresented: $creatingNote) {
            NoteEditorView(mode: .create)
                .environmentObject(store)
        }
        .safeAreaInset(edge: .bottom) {
            SyncStatusView()
        }
    }
}

struct NoteEditorView: View {
    enum Mode {
        case create
        case edit(NoteNode)
    }

    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var store: SyncStore
    let mode: Mode
    @State private var title = ""
    @State private var contents = ""

    var body: some View {
        NavigationStack {
            Form {
                TextField("Title", text: $title)
                TextEditor(text: $contents)
                    .frame(minHeight: 240)
            }
            .navigationTitle(navigationTitle)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        save()
                    }
                }
            }
        }
        .onAppear {
            if case .edit(let note) = mode {
                title = note.name
                contents = note.contents ?? ""
            }
        }
    }

    private var navigationTitle: String {
        if case .create = mode { return "New Note" }
        return "Edit Note"
    }

    private func save() {
        switch mode {
        case .create:
            store.addNote(title: title, contents: contents)
        case .edit(let note):
            store.updateNote(note, title: title, contents: contents)
        }
        dismiss()
    }
}
