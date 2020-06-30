import HealthKit;

let INIT_ERROR = "HEALTHKIT_INIT_ERROR"
let INIT_ERROR_MESSAGE = "HealthKit not initialized"
let TYPE_IDENTIFIER_ERROR = "HEALTHKIT_TYPE_IDENTIFIER_NOT_RECOGNIZED_ERROR"
let GENERIC_ERROR = "HEALTHKIT_ERROR";

let HKCharacteristicTypeIdentifier_PREFIX = "HKCharacteristicTypeIdentifier"
let HKQuantityTypeIdentifier_PREFIX = "HKQuantityTypeIdentifier"
let HKCategoryTypeIdentifier_PREFIX = "HKCategoryTypeIdentifier"

@objc(ReactNativeHealthkit)
@available(iOS 10.0, *)
class ReactNativeHealthkit: RCTEventEmitter {
    var _store : HKHealthStore?
    var _runningQueries : Dictionary<String, HKQuery>;
    var _dateFormatter : ISO8601DateFormatter;
    
    override init() {
        self._runningQueries = Dictionary<String, HKQuery>();
        self._dateFormatter = ISO8601DateFormatter();
        
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
        
        if(typeIdentifier.starts(with: HKCategoryTypeIdentifier_PREFIX)){
            let identifier = HKCategoryTypeIdentifier.init(rawValue: typeIdentifier);
            return HKObjectType.categoryType(forIdentifier: identifier) as HKObjectType?
        }
        
        if(typeIdentifier == "HKWorkoutTypeIdentifier"){
            return HKObjectType.workoutType()
        }
        
        return nil;
    }
    
    func sampleTypeFromString(typeIdentifier: String) -> HKSampleType? {
        if(typeIdentifier.starts(with: HKQuantityTypeIdentifier_PREFIX)){
            let identifier = HKQuantityTypeIdentifier.init(rawValue: typeIdentifier);
            return HKSampleType.quantityType(forIdentifier: identifier) as HKSampleType?
        }
        
        if(typeIdentifier.starts(with: HKCategoryTypeIdentifier_PREFIX)){
            let identifier = HKCategoryTypeIdentifier.init(rawValue: typeIdentifier);
            return HKSampleType.categoryType(forIdentifier: identifier) as HKSampleType?
        }
        
        if(typeIdentifier == "HKWorkoutTypeIdentifier"){
            return HKSampleType.workoutType();
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
    
    func serializeQuantity(unit: HKUnit, quantity: HKQuantity?) -> NSDictionary? {
        guard let q = quantity else {
            return nil;
        }
        
        return [
            "quantity": q.doubleValue(for: unit),
            "unit": unit.unitString
        ]
    }
    
    func serializeQuantitySample(sample: HKQuantitySample, unitString: String) -> NSDictionary {
        let endDate = _dateFormatter.string(from: sample.endDate)
        let startDate = _dateFormatter.string(from: sample.startDate);
        
        let unit = HKUnit.init(from: unitString);
        let quantity = sample.quantity.doubleValue(for: unit);
        
        return [
            "endDate": endDate,
            "startDate": startDate,
            "quantity": quantity,
            "unit": unit.unitString,
            "metadata": self.serializeMetadata(metadata: sample.metadata)
        ]
    }
    
    func serializeCategorySample(sample: HKCategorySample) -> NSDictionary {
        let endDate = _dateFormatter.string(from: sample.endDate)
        let startDate = _dateFormatter.string(from: sample.startDate);
        
        return [
            "endDate": endDate,
            "startDate": startDate,
            "value": sample.value,
            "metadata": self.serializeMetadata(metadata: sample.metadata)
        ]
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
            resolve(_dateFormatter.string(from: dateOfBirth));
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
    
    
    @available(iOS 10.0, *)
    @objc(getWheelchairUse:withRejecter:)
    func getWheelchairUse(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        do {
            let wheelchairUse = try store.wheelchairUse();
            resolve(wheelchairUse.wheelchairUse.rawValue);
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
    
    @objc(saveQuantitySample:unitString:value:start:end:metadata:resolve:reject:)
    func saveQuantitySample(typeIdentifier: String, unitString: String, value: Double, start: Date, end: Date, metadata: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
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
    
    @objc(saveCategorySample:value:start:end:metadata:resolve:reject:)
    func saveCategorySample(typeIdentifier: String, value: Int, start: Date, end: Date, metadata: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        let identifier = HKCategoryTypeIdentifier.init(rawValue: typeIdentifier);
        
        guard let type = HKObjectType.categoryType(forIdentifier: identifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }

        let sample = HKCategorySample.init(type: type, value: value, start: start, end: end, metadata: metadata as? Dictionary<String, Any>)
        
        store.save(sample) { (success: Bool, error: Error?) in
            guard let err = error else {
                return resolve(success);
            }
            reject(GENERIC_ERROR, err.localizedDescription, error);
        }
    }
    
    override func supportedEvents() -> [String]! {
      return ["onChange"]
    }
    
    
    @objc(subscribeToObserverQuery:resolve:reject:)
    func subscribeToObserverQuery(typeIdentifier: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock){
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        guard let sampleType = sampleTypeFromString(typeIdentifier: typeIdentifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: Date.init(), end: nil)
        
        func responder(query: HKObserverQuery, handler: @escaping HKObserverQueryCompletionHandler, error: Error?) -> Void {
            if(error == nil){
                DispatchQueue.main.async {
                    self.sendEvent(withName: "onChange", body: [
                        typeIdentifier,
                    ]);
                }
            }
        }
        
        let queryId = UUID().uuidString
        
        let query = HKObserverQuery(sampleType: sampleType, predicate: predicate) { (query: HKObserverQuery, handler: @escaping HKObserverQueryCompletionHandler, error: Error?) in
            guard let err = error else {
                return responder(query: query, handler: handler, error: error);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }
        
        store.execute(query);
        
        self._runningQueries.updateValue(query, forKey: queryId);
    }
    
    @objc(unsubscribeQuery:resolve:reject:)
    func unsubscribeQuery(queryId: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        guard let query = self._runningQueries[queryId] else {
            reject("Error", "Query with id " + queryId + " not found", nil);
            return;
        }
        
        store.stop(query);
        
        self._runningQueries.removeValue(forKey: queryId);
        
        resolve(true);
    }

    @objc static override func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(queryStatisticsForQuantity:unitString:from:to:options:resolve:reject:)
    func queryStatisticsForQuantity(typeIdentifier: String, unitString: String, from: Date, to: Date, options: NSArray, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        let identifier = HKQuantityTypeIdentifier.init(rawValue: typeIdentifier);
        guard let quantityType = HKObjectType.quantityType(forIdentifier: identifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: from, end: to, options: HKQueryOptions.strictEndDate)
        
        var opts = HKStatisticsOptions.init();
        
        for o in options {
            let str = o as! String;
            if(str == "cumulativeSum"){
                opts.insert(HKStatisticsOptions.cumulativeSum)
            }
            else if(str == "discreteAverage"){
                opts.insert(HKStatisticsOptions.discreteAverage)
            }else if(str == "discreteMax"){
                opts.insert(HKStatisticsOptions.discreteMax)
            }
            else if(str == "discreteMin"){
                opts.insert(HKStatisticsOptions.discreteMin)
            }
            if #available(iOS 12, *) {
                    if(str == "discreteMostRecent"){
                        opts.insert(HKStatisticsOptions.discreteMostRecent)
                    }
            }
            if #available(iOS 13, *) {
                if(str == "duration"){
                    opts.insert(HKStatisticsOptions.duration)
                }
                if(str == "mostRecent"){
                    opts.insert(HKStatisticsOptions.mostRecent)
                }
            }
            
            if(str == "separateBySource"){
                opts.insert(HKStatisticsOptions.separateBySource)
            }
        }
        
        let query = HKStatisticsQuery.init(quantityType: quantityType, quantitySamplePredicate: predicate, options: opts) { (query, stats: HKStatistics?, error: Error?) in
            if let gottenStats = stats {
                var dic = Dictionary<String, NSDictionary?>()
                let unit = HKUnit.init(from: unitString);
                if let averageQuantity = gottenStats.averageQuantity() {
                    
                    dic.updateValue(self.serializeQuantity(unit: unit, quantity: averageQuantity), forKey: "averageQuantity")
                }
                if let maximumQuantity = gottenStats.maximumQuantity() {
                    dic.updateValue(self.serializeQuantity(unit: unit, quantity: maximumQuantity), forKey: "maximumQuantity")
                }
                if let minimumQuantity = gottenStats.minimumQuantity() {
                    dic.updateValue(self.serializeQuantity(unit: unit, quantity: minimumQuantity), forKey: "minimumQuantity")
                }
                if let sumQuantity = gottenStats.sumQuantity() {
                    dic.updateValue(self.serializeQuantity(unit: unit, quantity: sumQuantity), forKey: "sumQuantity")
                }
                if #available(iOS 12, *) {
                    if let mostRecent = gottenStats.mostRecentQuantity() {
                        dic.updateValue(self.serializeQuantity(unit: unit, quantity: mostRecent), forKey: "mostRecentQuantity")
                    }
                    
                    if let mostRecentDateInterval = gottenStats.mostRecentQuantityDateInterval() {
                        dic.updateValue([
                            "start": self._dateFormatter.string(from: mostRecentDateInterval.start),
                            "end": self._dateFormatter.string(from: mostRecentDateInterval.end),
                        ], forKey: "mostRecentQuantityDateInterval")
                    }
                }
                if #available(iOS 13, *) {
                    let durationUnit = HKUnit.second();
                    if let duration = gottenStats.duration() {
                        dic.updateValue(self.serializeQuantity(unit: durationUnit, quantity: duration), forKey: "duration")
                    }
                }
                
                resolve(dic);
            }
        }
        
        store.execute(query);
    }
    
    func serializeMetadata(metadata: [String: Any]?) -> NSDictionary {
        let serialized: NSMutableDictionary = [:];
        if let m = metadata {
            for item in m {
                if let bool = item.value as? Bool {
                    serialized.setValue(bool, forKey: item.key)
                }
                if let str = item.value as? String {
                    serialized.setValue(str, forKey: item.key)
                }
                if let double = item.value as? Double {
                    serialized.setValue(double, forKey: item.key)
                }
                if let double = item.value as? Double {
                    serialized.setValue(double, forKey: item.key)
                }
                if let quantity = item.value as? HKQuantity {
                    
                    if(quantity.is(compatibleWith: HKUnit.percent())){
                        serialized.setValue(self.serializeQuantity(unit: HKUnit.percent(), quantity: quantity), forKey: item.key);
                    }
                    
                    
                    if(quantity.is(compatibleWith: HKUnit.second())){
                        serialized.setValue(self.serializeQuantity(unit: HKUnit.second(), quantity: quantity), forKey: item.key);
                    }
                    
                    if(quantity.is(compatibleWith: HKUnit.kilocalorie())){
                        serialized.setValue(self.serializeQuantity(unit: HKUnit.kilocalorie(), quantity: quantity), forKey: item.key);
                    }
                    
                    if(quantity.is(compatibleWith: HKUnit.count())){
                        serialized.setValue(self.serializeQuantity(unit: HKUnit.count(), quantity: quantity), forKey: item.key);
                    }
                    
                    if #available(iOS 11, *) {
                        if(quantity.is(compatibleWith: HKUnit.internationalUnit())){
                            serialized.setValue(self.serializeQuantity(unit: HKUnit.internationalUnit(), quantity: quantity), forKey: item.key);
                        }
                    }
                    
                    if #available(iOS 13, *) {
                        if(quantity.is(compatibleWith: HKUnit.hertz())){
                            serialized.setValue(self.serializeQuantity(unit: HKUnit.hertz(), quantity: quantity), forKey: item.key);
                        }
                        if(quantity.is(compatibleWith: HKUnit.decibelHearingLevel())){
                            serialized.setValue(self.serializeQuantity(unit: HKUnit.decibelHearingLevel(), quantity: quantity), forKey: item.key);
                        }
                    }
                }
            }
        }
        return serialized;
    }

    @objc(queryWorkoutSamples:distanceUnitString:from:to:limit:ascending:resolve:reject:)
    func queryWorkoutSamples(energyUnitString: String, distanceUnitString: String, from: Date, to: Date, limit: Int, ascending: NSNumber, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        let from = from.timeIntervalSince1970 > 0 ? from : nil;
        let to = to.timeIntervalSince1970 > 0 ? to : nil;
        
        let predicate = from != nil || to != nil ? HKQuery.predicateForSamples(withStart: from, end: to, options: [HKQueryOptions.strictEndDate, HKQueryOptions.strictStartDate]) : nil;
        
        let limit = limit == 0 ? HKObjectQueryNoLimit : limit;
        
        let energyUnit = HKUnit.init(from: energyUnitString)
        let distanceUnit = HKUnit.init(from: distanceUnitString)
        
        let q = HKSampleQuery(sampleType: .workoutType(), predicate: predicate, limit: limit, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: Bool(truncating: ascending))]) { (query: HKSampleQuery, sample: [HKSample]?, error: Error?) in
            guard let err = error else {
                guard let samples = sample else {
                    return resolve([]);
                }
                let arr: NSMutableArray = [];
                
                for s in samples {
                    if let workout = s as? HKWorkout {
                        let endDate = self._dateFormatter.string(from: workout.endDate)
                        let startDate = self._dateFormatter.string(from: workout.startDate);
                        let dict: NSMutableDictionary = [
                            "duration": workout.duration,
                            "totalDistance": self.serializeQuantity(unit: distanceUnit, quantity: workout.totalDistance) as Any,
                            "totalEnergyBurned": self.serializeQuantity(unit: energyUnit, quantity: workout.totalEnergyBurned) as Any,
                            "totalSwimmingStrokeCount": self.serializeQuantity(unit: HKUnit.count(), quantity: workout.totalSwimmingStrokeCount) as Any,
                            "workoutActivityType": workout.workoutActivityType.rawValue,
                            "startDate": startDate,
                            "endDate": endDate,
                            "metadata": self.serializeMetadata(metadata: workout.metadata)
                        ]
                        
                        if #available(iOS 11, *) {
                            dict.setValue(self.serializeQuantity(unit: HKUnit.count(), quantity: workout.totalFlightsClimbed), forKey: "totalFlightsClimbed")
                        }
                        
                        arr.add(dict)
                    }
                }
                
                return resolve(arr);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }
        
        store.execute(q);
    }
    
    @objc(queryQuantitySamples:unitString:from:to:limit:ascending:resolve:reject:)
    func queryQuantitySamples(typeIdentifier: String, unitString: String, from: Date, to: Date, limit: Int, ascending: NSNumber, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        let identifier = HKQuantityTypeIdentifier.init(rawValue: typeIdentifier);
        guard let sampleType = HKSampleType.quantityType(forIdentifier: identifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }
        
        let from = from.timeIntervalSince1970 > 0 ? from : nil;
        let to = to.timeIntervalSince1970 > 0 ? to : nil;
        
        let predicate = from != nil || to != nil ? HKQuery.predicateForSamples(withStart: from, end: to, options: [HKQueryOptions.strictEndDate, HKQueryOptions.strictStartDate]) : nil;
        
        let limit = limit == 0 ? HKObjectQueryNoLimit : limit;
        
        let q = HKSampleQuery(sampleType: sampleType, predicate: predicate, limit: limit, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: Bool(truncating: ascending))]) { (query: HKSampleQuery, sample: [HKSample]?, error: Error?) in
            guard let err = error else {
                guard let samples = sample else {
                    return resolve([]);
                }
                let arr: NSMutableArray = [];
                
                for s in samples {
                    if let sample = s as? HKQuantitySample {
                        let serialized = self.serializeQuantitySample(sample: sample, unitString: unitString)
                        
                        arr.add(serialized)
                    }
                }
                
                return resolve(arr);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }
        
        store.execute(q);
    }
    
    @objc(queryCategorySamples:from:to:limit:ascending:resolve:reject:)
    func queryCategorySamples(typeIdentifier: String, from: Date, to: Date, limit: Int, ascending: NSNumber, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }
        
        let identifier = HKCategoryTypeIdentifier.init(rawValue: typeIdentifier);
        guard let sampleType = HKSampleType.categoryType(forIdentifier: identifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }
        
        let from = from.timeIntervalSince1970 > 0 ? from : nil;
        let to = to.timeIntervalSince1970 > 0 ? to : nil;
        
        let predicate = from != nil || to != nil ? HKQuery.predicateForSamples(withStart: from, end: to, options: [HKQueryOptions.strictEndDate, HKQueryOptions.strictStartDate]) : nil;
        
        let limit = limit == 0 ? HKObjectQueryNoLimit : limit;
        
        let q = HKSampleQuery(sampleType: sampleType, predicate: predicate, limit: limit, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: Bool(truncating: ascending))]) { (query: HKSampleQuery, sample: [HKSample]?, error: Error?) in
            guard let err = error else {
                guard let samples = sample else {
                    return resolve([]);
                }
                let arr: NSMutableArray = [];
                
                for s in samples {
                    if let sample = s as? HKCategorySample {
                        let serialized = self.serializeCategorySample(sample: sample);
                        
                        arr.add(serialized)
                    }
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
