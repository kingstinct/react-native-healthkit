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
        type: SampleTypeIdentifier
    ) throws -> AuthorizationStatus {
        guard let objectType = objectTypeFromString(typeIdentifier: type.stringValue) else {
            throw RuntimeError.error(withMessage: "Failed to initialize type with identifier \(type)")
        }
          
        let authStatus = store.authorizationStatus(for: objectType)
          
        if let authStatus = AuthorizationStatus(rawValue: Int32(authStatus.rawValue)){
            return authStatus
        }
        
        throw RuntimeError.error(withMessage: "Failed to recognize AuthorizationStatus with value \(authStatus.rawValue)")
      }
    
    func getRequestStatusForAuthorization(write: [SampleTypeIdentifier], read: [SampleTypeIdentifier]) throws -> Promise<AuthorizationRequestStatus> {
        let share = sampleTypesFromArray(typeIdentifiers: write)
        let toRead = objectTypesFromArray(typeIdentifiers: read)
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                store.getRequestStatusForAuthorization(toShare: share, read: toRead) { status, error in
                    if let error = error {
                        continuation.resume(throwing: error)
                    } else {
                        if let authStatus = AuthorizationRequestStatus(rawValue: Int32(status.rawValue)) {
                            continuation.resume(returning: authStatus)
                        } else {
                            continuation.resume(throwing: RuntimeError.error(withMessage: "Unrecognized authStatus returned: \(status.rawValue)"))
                        }
                        
                    }
                }
            }
        }
    }
    
    func requestAuthorization(write: [SampleTypeIdentifier], read: [SampleTypeIdentifier]) throws -> Promise<Bool> {
        let share = sampleTypesFromArray(typeIdentifiers: write)
        let toRead = objectTypesFromArray(typeIdentifiers: read)
        
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

