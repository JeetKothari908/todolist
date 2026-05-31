//
//  todolistappApp.swift
//  todolistapp
//
//  Created by Jeet Kothari on 5/31/26.
//

import SwiftUI

@main
struct todolistappApp: App {
    @StateObject private var store = SyncStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
        }
    }
}
