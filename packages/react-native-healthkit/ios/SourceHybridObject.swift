import HealthKit
import NitroModules

class SourceHybridObject : HybridSourceHybridObjectSpec {
    func querySources(identifier: SampleTypeIdentifier) throws -> Promise<[Source]> {
        guard let type = objectTypeFromString(typeIdentifier: identifier.stringValue) else {
            throw RuntimeError.error(withMessage: "Failed to initialize type with identifier \(identifier)")
        }
        
        guard let sampleType = type as? HKSampleType else {
            throw RuntimeError.error(withMessage: "Type \(identifier) is not a sample type")
        }
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                let query = HKSourceQuery(
                    sampleType: sampleType,
                    samplePredicate: nil
                ) { (_: HKSourceQuery, sources: Set<HKSource>?, error: Error?) in
                    if let error = error {
                        continuation.resume(throwing: error)
                        return
                    }
                    
                    guard let sources = sources else {
                        continuation.resume(returning: [])
                        return
                    }
                    
                    let serializedSources = sources.map { source -> Source in
                        return Source(
                            name: source.name,
                            bundleIdentifier: source.bundleIdentifier
                        )
                    }
                    
                    continuation.resume(returning: serializedSources)
                }
                
                store.execute(query)
            }
        }
    }
}
