//
//  appApp.swift
//  app
//
//  Created by Jeet Kothari on 5/31/26.
//

import SwiftUI

@main
struct appApp: App {
    @StateObject private var store = SyncStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
        }
    }
}
