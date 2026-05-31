import Foundation

struct TodoData: Codable, Equatable {
    var items: [TodoItem] = []
    var show: Int = 3
    var keyBind: String? = "T"
    var lastClearedDate: String?
    var customLists: [CustomList] = []

    init() {}

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        items = try container.decodeIfPresent([TodoItem].self, forKey: .items) ?? []
        show = try container.decodeIfPresent(Int.self, forKey: .show) ?? 3
        keyBind = try container.decodeIfPresent(String.self, forKey: .keyBind) ?? "T"
        lastClearedDate = try container.decodeIfPresent(String.self, forKey: .lastClearedDate)
        customLists = try container.decodeIfPresent([CustomList].self, forKey: .customLists) ?? []
    }
}

struct CustomList: Codable, Identifiable, Equatable {
    var id: String
    var name: String
}

struct TodoItem: Codable, Identifiable, Equatable {
    var id: String
    var contents: String
    var completed: Bool
    var dismissed: Bool?
    var dueDate: String?
    var `repeat`: RepeatRule?
    var parentId: String?
    var listId: String?
}

struct RepeatRule: Codable, Equatable {
    var type: String
    var days: [Int]?
}

struct NotesData: Codable, Equatable {
    var items: [NoteNode] = []
    var selectedNoteId: String?
    var currentFolderId: String?

    init() {}

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        items = try container.decodeIfPresent([NoteNode].self, forKey: .items) ?? []
        selectedNoteId = try container.decodeIfPresent(String.self, forKey: .selectedNoteId)
        currentFolderId = try container.decodeIfPresent(String.self, forKey: .currentFolderId)
    }
}

struct NoteNode: Codable, Identifiable, Equatable {
    var id: String
    var type: String
    var name: String
    var parentId: String?
    var contents: String?
    var deleted: Bool?
    var deletedAt: String?
}

struct PlanData: Codable, Equatable {
    var plans: [String: String] = [:]
    var activeDate: String?
    var selectedDate: String?

    init() {}

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        plans = try container.decodeIfPresent([String: String].self, forKey: .plans) ?? [:]
        activeDate = try container.decodeIfPresent(String.self, forKey: .activeDate)
        selectedDate = try container.decodeIfPresent(String.self, forKey: .selectedDate)
    }
}

struct WidgetState: Codable, Equatable {
    var id: String
    var key: String
    var order: Int
    var display: WidgetDisplay
}

struct WidgetDisplay: Codable, Equatable {
    var position: String
}

struct RemoteSnapshot: Codable {
    var changes: [RemoteChange]
}

struct RemoteChange: Codable {
    var key: String
    var value: JSONValue?
    var deleted: Bool?
}

enum JSONValue: Codable, Equatable {
    case string(String)
    case number(Double)
    case bool(Bool)
    case object([String: JSONValue])
    case array([JSONValue])
    case null

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if container.decodeNil() {
            self = .null
        } else if let value = try? container.decode(Bool.self) {
            self = .bool(value)
        } else if let value = try? container.decode(Double.self) {
            self = .number(value)
        } else if let value = try? container.decode(String.self) {
            self = .string(value)
        } else if let value = try? container.decode([String: JSONValue].self) {
            self = .object(value)
        } else {
            self = .array(try container.decode([JSONValue].self))
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .string(let value):
            try container.encode(value)
        case .number(let value):
            try container.encode(value)
        case .bool(let value):
            try container.encode(value)
        case .object(let value):
            try container.encode(value)
        case .array(let value):
            try container.encode(value)
        case .null:
            try container.encodeNil()
        }
    }

    var objectValue: [String: JSONValue]? {
        if case .object(let value) = self { return value }
        return nil
    }

    var stringValue: String? {
        if case .string(let value) = self { return value }
        return nil
    }
}

extension JSONValue {
    init<T: Encodable>(encoding value: T, encoder: JSONEncoder = JSONEncoder()) throws {
        let data = try encoder.encode(value)
        self = try JSONDecoder().decode(JSONValue.self, from: data)
    }

    func decode<T: Decodable>(_ type: T.Type, decoder: JSONDecoder = JSONDecoder()) throws -> T {
        let data = try JSONEncoder().encode(self)
        return try decoder.decode(type, from: data)
    }
}
