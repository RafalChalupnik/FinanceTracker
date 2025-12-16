//
//  Item.swift
//  FinanceTracker
//
//  Created by Rafał Chałupnik on 16/12/2025.
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
