import HealthKit
import NitroModules

var store = HKHealthStore.init()

/*public extension HKAuthorizationStatus {
    static func fromRawValue(rawValue: Int) -> HKAuthorizationStatus {
        switch rawValue {
        case 0:
            return HKAuthorizationStatus(fromString: "notDetermined")!;
        case 1:
            return HKAuthorizationStatus(fromString: "sharingDenied")!;
        case 2:
            return HKAuthorizationStatus(fromString: "sharingAuthorized")!;
        default:
            fatalError("Unsupported raw value \(rawValue)");
        }
    }
}*/

class Auth : HybridAuthSpec {    
    func authorizationStatusFor(
        type: String
    ) -> Promise<Double> {
        guard let objectType = objectTypeFromString(typeIdentifier: type) else {
          
          fatalError(TYPE_IDENTIFIER_ERROR);
          // return reject(TYPE_IDENTIFIER_ERROR, "Failed to initialize " + typeIdentifier, nil)
        }
          
        let authStatus = store.authorizationStatus(for: objectType)
          
        return Promise.resolved(withResult: Double(authStatus.rawValue))
      }
    
    func getRequestStatusForAuthorization(write: Dictionary<String, Bool>, read: Dictionary<String, Bool>) throws -> Promise<Double> {
        let share = sampleTypesFromDictionary(typeIdentifiers: write)
        let toRead = objectTypesFromDictionary(typeIdentifiers: read)
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                store.getRequestStatusForAuthorization(toShare: share, read: toRead) { status, error in
                    if let error = error {
                        continuation.resume(throwing: error)
                    } else {
                        continuation.resume(returning: Double(status.rawValue))
                    }
                }
            }
        }
    }
    
    func requestAuthorization(write: Dictionary<String, Bool>, read: Dictionary<String, Bool>) throws -> Promise<Bool> {
        let share = sampleTypesFromDictionary(typeIdentifiers: write)
        let toRead = objectTypesFromDictionary(typeIdentifiers: read)
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                store.requestAuthorization(toShare: share, read: toRead) { status, error in
                    if let error = error {
                        continuation.resume(throwing: error)
                    } else {
                        continuation.resume(returning: status)
                    }
                }
            }
        }
    }
}

