import HealthKit;

let INIT_ERROR = "HEALTHKIT_INIT_ERROR"
let INIT_ERROR_MESSAGE = "HealthKit not initialized"
let TYPE_IDENTIFIER_ERROR = "HEALTHKIT_TYPE_IDENTIFIER_NOT_RECOGNIZED_ERROR"
let GENERIC_ERROR = "HEALTHKIT_ERROR";

let HKCharacteristicTypeIdentifier_PREFIX = "HKCharacteristicTypeIdentifier"
let HKQuantityTypeIdentifier_PREFIX = "HKQuantityTypeIdentifier"

@objc(ReactNativeHealthkit)
class ReactNativeHealthkit: RCTEventEmitter {
    var _store : HKHealthStore?
    
    override init() {
        if(HKHealthStore.isHealthDataAvailable()){
            self._store = HKHealthStore.init();
        }
    }
    
    func objectTypeFromString(typeIdentifier: String) -> HKObjectType? {
        if(typeIdentifier.starts(with: HKCharacteristicTypeIdentifier_PREFIX)){
            let identifier = HKCharacteristicTypeIdentifier.init(rawValue: typeIdentifier);
            return HKObjectType.characteristicType(forIdentifier: identifier) as HKObjectType?
        }
        
        if(typeIdentifier.starts(with: HKQuantityTypeIdentifier_PREFIX)){
            let identifier = HKQuantityTypeIdentifier.init(rawValue: typeIdentifier);
            return HKObjectType.quantityType(forIdentifier: identifier) as HKObjectType?
        }
        
        return nil;
    }
    
    func sampleTypeFromString(typeIdentifier: String) -> HKSampleType? {
        if(typeIdentifier.starts(with: HKQuantityTypeIdentifier_PREFIX)){
            let identifier = HKQuantityTypeIdentifier.init(rawValue: typeIdentifier);
            return HKSampleType.quantityType(forIdentifier: identifier) as HKSampleType?
        }
        
        return nil;
    }
    
    func objectTypesFromDictionary(typeIdentifiers: NSDictionary) -> Set<HKObjectType> {
        var share = Set<HKObjectType>();
        for item in typeIdentifiers {
            if(item.value as! Bool){
                let objectType = objectTypeFromString(typeIdentifier: item.key as! String);
                if(objectType != nil){
                    share.insert(objectType!);
                }
            }
        }
        return share;
    }
    
    func sampleTypesFromDictionary(typeIdentifiers: NSDictionary) -> Set<HKSampleType> {
        var share = Set<HKSampleType>();
        for item in typeIdentifiers {
            if(item.value as! Bool){
                let sampleType = sampleTypeFromString(typeIdentifier: item.key as! String);
                if(sampleType != nil){
                 share.insert(sampleType!);
                }
            }
        }
        return share;
    }
    
    @objc(isHealthDataAvailable:withRejecter:)
    func isHealthDataAvailable(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(HKHealthStore.isHealthDataAvailable())
    }
    
    @available(iOS 12.0, *)
    @objc(supportsHealthRecords:withRejecter:)
    func supportsHealthRecords(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        resolve(store.supportsHealthRecords());
    }
    
    @available(iOS 12.0, *)
    @objc(getRequestStatusForAuthorization:read:resolve:withRejecter:)
    func getRequestStatusForAuthorization(toShare: NSDictionary, read: NSDictionary, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        let share = sampleTypesFromDictionary(typeIdentifiers: toShare);
        let toRead = objectTypesFromDictionary(typeIdentifiers: read);
        store.getRequestStatusForAuthorization(toShare: share, read: toRead) { (status: HKAuthorizationRequestStatus, error: Error?) in
            guard let err = error else {
                return resolve(status.rawValue);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }
    }
    
    @objc(getPreferredUnits:resolve:reject:)
    func getPreferredUnits(forIdentifiers: NSArray, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        var quantityTypes = Set<HKQuantityType>();
        for identifierString in forIdentifiers {
            let identifier = HKQuantityTypeIdentifier.init(rawValue: identifierString as! String);
            let type = HKSampleType.quantityType(forIdentifier: identifier);
            if(type != nil){
                quantityTypes.insert(type!);
            }
            
        }
        store.preferredUnits(for: quantityTypes) { (typePerUnits: [HKQuantityType : HKUnit], error: Error?) in
            let dic: NSMutableDictionary = NSMutableDictionary();
            
            for typePerUnit in typePerUnits {
                dic.setObject(typePerUnit.value.unitString, forKey: typePerUnit.key.identifier as NSCopying);
            }
            
            resolve(dic);
        }
    }
    
    func serializeSample(sample: HKSample, unitString: String, typeIdentifier: String) -> NSDictionary {
        let endDate = sample.endDate.timeIntervalSince1970;
        let startDate = sample.startDate.timeIntervalSince1970;
        let defaultDictionary: NSDictionary = [
            "endDate": endDate,
            "startDate": startDate,
        ]
        
        if(typeIdentifier.starts(with: "HKQuantityTypeIdentifier")){
            let unit = HKUnit.init(from: unitString);
            let s = sample as! HKQuantitySample;
            let quantity = s.quantity.doubleValue(for: unit);
            
            return [
                "endDate": endDate,
                "startDate": startDate,
                "quantity": quantity,
                "unit": unit.unitString
            ]
        }
        
        return defaultDictionary;
    }
    
    @objc(getBiologicalSex:withRejecter:)
    func getBiologicalSex(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        do {
            let bioSex = try store.biologicalSex();
            resolve(bioSex.biologicalSex.rawValue);
        } catch {
            reject(GENERIC_ERROR, error.localizedDescription, error);
        }
    }
    
    @objc(getDateOfBirth:withRejecter:)
    func getDateOfBirth(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        do {
            let dateOfBirth = try store.dateOfBirth();
            resolve(dateOfBirth.timeIntervalSince1970);
        } catch {
            reject(GENERIC_ERROR, error.localizedDescription, error);
        }
    }
    
    @objc(getBloodType:withRejecter:)
    func getBloodType(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        do {
            let bloodType = try store.bloodType();
            resolve(bloodType.bloodType.rawValue);
        } catch {
            reject(GENERIC_ERROR, error.localizedDescription, error);
        }
    }
    
    @objc(getFitzpatrickSkinType:withRejecter:)
    func getFitzpatrickSkinType(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        do {
            let fitzpatrickSkinType = try store.fitzpatrickSkinType();
            resolve(fitzpatrickSkinType.skinType.rawValue);
        } catch {
            reject(GENERIC_ERROR, error.localizedDescription, error);
        }
    }
    
    @objc(authorizationStatusFor:withResolver:withRejecter:)
    func authorizationStatusFor(typeIdentifier: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        guard let objectType = objectTypeFromString(typeIdentifier: typeIdentifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }
        
        let authStatus = store.authorizationStatus(for: objectType);
        resolve(authStatus.rawValue);
    }
    
    @objc(writeSample:unitString:value:start:end:metadata:resolve:reject:)
    func writeSample(typeIdentifier: String, unitString: String, value: Double, start: Date, end: Date, metadata: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        let identifier = HKQuantityTypeIdentifier.init(rawValue: typeIdentifier);
        
        guard let type = HKObjectType.quantityType(forIdentifier: identifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }

        let unit = HKUnit.init(from: unitString);
        let quantity = HKQuantity.init(unit: unit, doubleValue: value);
        let sample = HKQuantitySample.init(
            type: type,
            quantity: quantity,
            start: start,
            end: end,
            metadata: metadata as? Dictionary<String, Any>
        )
        
        store.save(sample) { (success: Bool, error: Error?) in
            guard let err = error else {
                return resolve(success);
            }
            reject(GENERIC_ERROR, err.localizedDescription, error);
        }
    }
    
    override func supportedEvents() -> [String]! {
      return ["onQueryUpdated"]
    }
    
    @objc(observe:unitString:resolve:reject:)
    func observe(typeIdentifier: String, unitString: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock){
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        guard let sampleType = sampleTypeFromString(typeIdentifier: typeIdentifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: Date.init(), end: nil)
        
        var anchor: HKQueryAnchor? = nil;
        
        func responder(query: HKAnchoredObjectQuery, allSamples: [HKSample]?, deletedObjects: [HKDeletedObject]?, newAnchor: HKQueryAnchor?, error: Error?) -> Void {
            anchor = newAnchor;
            guard let err = error else {
                let serializedSamples: NSMutableArray = [];
                
                for s in allSamples! {
                    let serialized = self.serializeSample(sample: s, unitString: unitString, typeIdentifier: typeIdentifier);
                    serializedSamples.add(serialized)
                }
                
                DispatchQueue.main.async {
                    self.sendEvent(withName: "onQueryUpdated", body: [
                        "typeIdentifier": typeIdentifier,
                        "samples": serializedSamples
                    ]);
                }
                
                return;
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }
        let query = HKAnchoredObjectQuery(type: sampleType, predicate: predicate, anchor: anchor, limit: HKObjectQueryNoLimit) { (query: HKAnchoredObjectQuery, samples: [HKSample]?, deletedObjects: [HKDeletedObject]?, newAnchor: HKQueryAnchor?, error: Error?) in
            guard let err = error else {
                resolve(true);
                return responder(query: query, allSamples: samples, deletedObjects: deletedObjects, newAnchor: newAnchor, error: error);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }
        
        query.updateHandler = responder;
        
        store.execute(query);
    }

    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(getSamplesBetween:unitString:from:to:resolve:reject:)
    func getSamplesBetween(typeIdentifier: String, unitString: String, from: Date, to: Date, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        guard let sampleType = sampleTypeFromString(typeIdentifier: typeIdentifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: from, end: to, options: HKQueryOptions.strictEndDate)
        
        let q = HKSampleQuery(sampleType: sampleType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)]) { (query: HKSampleQuery, sample: [HKSample]?, error: Error?) in
            guard let err = error else {
                guard let samples = sample else {
                    return resolve([]);
                }
                let arr: NSMutableArray = [];
                
                for s in samples {
                    let serialized = self.serializeSample(sample: s, unitString: unitString, typeIdentifier: typeIdentifier);
                    arr.add(serialized)
                }
                
                return resolve(arr);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }
        
        store.execute(q);
    }
    
    @objc(getLastSamples:limit:unitString:resolve:reject:)
    func getLastSamples(typeIdentifier: String, limit: NSInteger, unitString: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        guard let sampleType = sampleTypeFromString(typeIdentifier: typeIdentifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }
        
        let q = HKSampleQuery(sampleType: sampleType, predicate: nil, limit: limit, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)]) { (query: HKSampleQuery, sample: [HKSample]?, error: Error?) in
            guard let err = error else {
                guard let samples = sample else {
                    return resolve([]);
                }
                let arr: NSMutableArray = [];
                
                for s in samples {
                    let serialized = self.serializeSample(sample: s, unitString: unitString, typeIdentifier: typeIdentifier);
                    arr.add(serialized)
                }
                
                return resolve(arr);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }
        
        store.execute(q);
    }
    
    @objc(requestAuthorization:read:resolve:withRejecter:)
    func requestAuthorization(toShare: NSDictionary, read: NSDictionary, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        let share = sampleTypesFromDictionary(typeIdentifiers: toShare);
        let toRead = objectTypesFromDictionary(typeIdentifiers: read);
        
        store.requestAuthorization(toShare: share, read: toRead) { (success: Bool, error: Error?) in
            guard let err = error else {
                return resolve(success);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }
    }
}
