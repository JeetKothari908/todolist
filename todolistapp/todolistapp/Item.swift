//
//  Item.swift
//  todolistapp
//
//  Created by Jeet Kothari on 5/31/26.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
