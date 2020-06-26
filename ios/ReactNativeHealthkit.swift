import HealthKit;


@objc(ReactNativeHealthkit)
class ReactNativeHealthkit: NSObject {
    var _store : HKHealthStore?
    
    override init() {
        if(HKHealthStore.isHealthDataAvailable()){
            self._store = HKHealthStore.init();
        }
        
    }
    
    func objectTypeFromString(str: String) -> HKObjectType? {
        if(str.starts(with: "HKCharacteristicTypeIdentifier")){
            let identifier = HKCharacteristicTypeIdentifier.init(rawValue: str);
            return HKObjectType.characteristicType(forIdentifier: identifier) as HKObjectType?
        }
        
        if(str.starts(with: "HKQuantityTypeIdentifier")){
            let identifier = HKQuantityTypeIdentifier.init(rawValue: str);
            return HKObjectType.quantityType(forIdentifier: identifier) as HKObjectType?
        }
        
        return nil;
    }
    
    func sampleTypeFromString(str: String) -> HKSampleType? {
        if(str.starts(with: "HKQuantityTypeIdentifier")){
            let identifier = HKQuantityTypeIdentifier.init(rawValue: str);
            return HKSampleType.quantityType(forIdentifier: identifier) as HKSampleType?
        }
        
        return nil;
    }
    
    func objectTypesFromDictionary(toShare: NSDictionary) -> Set<HKObjectType> {
        var share = Set<HKObjectType>();
        for item in toShare {
            if(item.value as! Bool){
                let objectType = objectTypeFromString(str: item.key as! String);
                if(objectType != nil){
                    share.insert(objectType!);
                }
            }
        }
        return share;
    }
    
    func sampleTypesFromDictionary(toShare: NSDictionary) -> Set<HKSampleType> {
        var share = Set<HKSampleType>();
        for item in toShare {
            if(item.value as! Bool){
                let sampleType = sampleTypeFromString(str: item.key as! String);
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
    @objc(getRequestStatusForAuthorization:read:resolve:withRejecter:)
    func getRequestStatusForAuthorization(toShare: NSDictionary, read: NSDictionary, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            reject("Error", "HealthKit not initialized properly", nil);
            return;
        }
        let share = sampleTypesFromDictionary(toShare: toShare);
        let toRead = objectTypesFromDictionary(toShare: read);
        store.getRequestStatusForAuthorization(toShare: share, read: toRead) { (status: HKAuthorizationRequestStatus, error: Error?) in
            if(error != nil){
                reject("Error", error?.localizedDescription, error);
            }
            else {
                resolve(status.rawValue);
            }
        }
    }
    
    @objc(getPreferredUnits:resolve:reject:)
    func getPreferredUnits(forIdentifiers: NSArray, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            reject("Error", "HealthKit not initialized properly", nil);
            return;
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
    
    func serializeSample(sample: HKSample, unitString: String, sampleTypeIdentifier: String) -> NSDictionary {
        let endDate = sample.endDate.timeIntervalSince1970;
        let startDate = sample.startDate.timeIntervalSince1970;
        let defaultDictionary: NSDictionary = [
            "endDate": endDate,
            "startDate": startDate,
        ]
        
        if(sampleTypeIdentifier.starts(with: "HKQuantityTypeIdentifier")){
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
            reject("Error", "HealthKit not initialized properly", nil);
            return;
        }
        
        do {
            let bioSex = try store.biologicalSex();
            resolve(bioSex.biologicalSex.rawValue);
        } catch {
            reject("Error", error.localizedDescription, error);
        }
    }
    
    @objc(getDateOfBirth:withRejecter:)
    func getDateOfBirth(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            reject("Error", "HealthKit not initialized properly", nil);
            return;
        }
        
        do {
            let dateOfBirth = try store.dateOfBirth();
            resolve(dateOfBirth.timeIntervalSince1970);
        } catch {
            reject("Error", error.localizedDescription, error);
        }
    }
    
    @objc(getBloodType:withRejecter:)
    func getBloodType(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            reject("Error", "HealthKit not initialized properly", nil);
            return;
        }
        
        do {
            let bloodType = try store.bloodType();
            resolve(bloodType.bloodType.rawValue);
        } catch {
            reject("Error", error.localizedDescription, error);
        }
    }
    
    @objc(getFitzpatrickSkinType:withRejecter:)
    func getFitzpatrickSkinType(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            reject("Error", "HealthKit not initialized properly", nil);
            return;
        }
        
        do {
            let fitzpatrickSkinType = try store.fitzpatrickSkinType();
            resolve(fitzpatrickSkinType.skinType.rawValue);
        } catch {
            reject("Error", error.localizedDescription, error);
        }
    }
    
    @objc(authorizationStatusFor:withResolver:withRejecter:)
    func authorizationStatusFor(objectType: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            reject("Error", "HealthKit not initialized properly", nil);
            return;
        }
        
        guard let objectType = objectTypeFromString(str: objectType) else {
            reject("Error", "Got invalid object type", nil);
            return;
        }
        
        let authStatus = store.authorizationStatus(for: objectType);
        resolve(authStatus.rawValue);
    }
    
    @objc(writeSample:unitString:value:start:end:metadata:resolve:reject:)
    func writeSample(sampleTypeIdentifier: String, unitString: String, value: Double, start: Double, end: Double, metadata: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
        guard let store = _store else {
            reject("Error", "HealthKit not initialized properly", nil);
            return;
        }
        
        let identifier = HKQuantityTypeIdentifier.init(rawValue: sampleTypeIdentifier);
        
        guard let type = HKObjectType.quantityType(forIdentifier: identifier) else {
            return;
        }

        let unit = HKUnit.init(from: unitString);
        let quantity = HKQuantity.init(unit: unit, doubleValue: value);
        let sample = HKQuantitySample.init(
            type: type,
            quantity: quantity,
            start: Date.init(timeIntervalSince1970: start),
            end: Date.init(timeIntervalSince1970: end),
            metadata: metadata as? Dictionary<String, Any>
        )
        
        store.save(sample) { (success: Bool, error: Error?) in
            guard let err = error else {
                resolve(success);
                return;
            }
            reject("Error", err.localizedDescription, error);
        }
    }
    
    @objc(getSamplesBetween:unitString:from:to:resolve:reject:)
    func getSamplesBetween(sampleTypeIdentifier: String, unitString: String, from: Date, to: Date, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            reject("Error", "HealthKit not initialized properly", nil);
            return;
        }
        
        guard let sampleType = sampleTypeFromString(str: sampleTypeIdentifier) else {
            reject("Error", "Couldnt find identifier", nil);
            return;
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: from, end: to, options: HKQueryOptions.strictEndDate)
        
        let q = HKSampleQuery(sampleType: sampleType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)]) { (query: HKSampleQuery, sample: [HKSample]?, error: Error?) in
            guard let err = error else {
                guard let samples = sample else {
                    resolve(nil);
                    return;
                }
                let arr: NSMutableArray = [];
                
                for s in samples {
                    let serialized = self.serializeSample(sample: s, unitString: unitString, sampleTypeIdentifier: sampleTypeIdentifier);
                    arr.add(serialized)
                }
                
                resolve(arr);
                return;
            }
            reject("Error", err.localizedDescription, err);
        }
        
        store.execute(q);
    }
    
    @objc(getLastSamples:limit:unitString:resolve:reject:)
    func getLastSamples(sampleTypeIdentifier: String, limit: NSInteger, unitString: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            reject("Error", "HealthKit not initialized properly", nil);
            return;
        }
        
        guard let sampleType = sampleTypeFromString(str: sampleTypeIdentifier) else {
            reject("Error", "Couldnt find identifier", nil);
            return;
        }
        
        let q = HKSampleQuery(sampleType: sampleType, predicate: nil, limit: limit, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)]) { (query: HKSampleQuery, sample: [HKSample]?, error: Error?) in
            guard let err = error else {
                guard let samples = sample else {
                    resolve(nil);
                    return;
                }
                let arr: NSMutableArray = [];
                
                for s in samples {
                    let serialized = self.serializeSample(sample: s, unitString: unitString, sampleTypeIdentifier: sampleTypeIdentifier);
                    arr.add(serialized)
                }
                
                resolve(arr);
                return;
            }
            reject("Error", err.localizedDescription, err);
        }
        
        store.execute(q);
    }
    
    @objc(requestAuthorization:read:resolve:withRejecter:)
    func requestAuthorization(toShare: NSDictionary, read: NSDictionary, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            reject("Error", "HealthKit not initialized properly", nil);
            return;
        }
        
        let share = sampleTypesFromDictionary(toShare: toShare);
        let toRead = objectTypesFromDictionary(toShare: read);
        
        store.requestAuthorization(toShare: share, read: toRead) { (success: Bool, error: Error?) in
            if(error != nil){
                reject("Error", error?.localizedDescription, error);
            }
            else {
                resolve(success);
            }
            
        }
    }
    
    
    
    
}
