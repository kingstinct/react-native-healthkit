import HealthKit;
import CoreLocation;

let INIT_ERROR = "HEALTHKIT_INIT_ERROR"
let INIT_ERROR_MESSAGE = "HealthKit not initialized"
let TYPE_IDENTIFIER_ERROR = "HEALTHKIT_TYPE_IDENTIFIER_NOT_RECOGNIZED_ERROR"
let GENERIC_ERROR = "HEALTHKIT_ERROR"

let HKCharacteristicTypeIdentifier_PREFIX = "HKCharacteristicTypeIdentifier"
let HKQuantityTypeIdentifier_PREFIX = "HKQuantityTypeIdentifier"
let HKCategoryTypeIdentifier_PREFIX = "HKCategoryTypeIdentifier"
let HKCorrelationTypeIdentifier_PREFIX = "HKCorrelationTypeIdentifier"
let HKActivitySummaryTypeIdentifier = "HKActivitySummaryTypeIdentifier"
let HKAudiogramTypeIdentifier = "HKAudiogramTypeIdentifier"
let HKWorkoutTypeIdentifier = "HKWorkoutTypeIdentifier"
let HKWorkoutRouteTypeIdentifier = "HKWorkoutRouteTypeIdentifier"
let HKDataTypeIdentifierHeartbeatSeries = "HKDataTypeIdentifierHeartbeatSeries"

let SpeedUnit =  HKUnit(from: "m/s") // HKUnit.meter().unitDivided(by: HKUnit.second())
// Support for MET data: HKAverageMETs 8.24046 kcal/hr·kg
let METUnit = HKUnit(from: "kcal/hr·kg")

@objc(ReactNativeHealthkit)
@available(iOS 10.0, *)
class ReactNativeHealthkit: RCTEventEmitter {
    var _store : HKHealthStore?
    var _runningQueries : Dictionary<String, HKQuery>;
    var _dateFormatter : ISO8601DateFormatter;
    var _hasListeners = false

    override init() {
        self._runningQueries = Dictionary<String, HKQuery>();
        self._dateFormatter = ISO8601DateFormatter();

        if(HKHealthStore.isHealthDataAvailable()){
            self._store = HKHealthStore.init();
        }
        super.init();
    }

    deinit {
        if let store = _store {
                for query in self._runningQueries {
                    store.stop(query.value)
                }
        }
    }

    override func stopObserving() -> Void {
        self._hasListeners = false
        if let store = _store {
                for query in self._runningQueries {
                    store.stop(query.value)
                }
        }
    }

    override func startObserving() -> Void {
        self._hasListeners = true
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

        if(typeIdentifier.starts(with: HKCorrelationTypeIdentifier_PREFIX)){
            let identifier = HKCorrelationTypeIdentifier.init(rawValue: typeIdentifier);
            return HKObjectType.correlationType(forIdentifier: identifier) as HKObjectType?
        }

        if(typeIdentifier == HKActivitySummaryTypeIdentifier){
            return HKObjectType.activitySummaryType();
        }

        if #available(iOS 13, *) {
            if(typeIdentifier == HKAudiogramTypeIdentifier){
                return HKObjectType.audiogramSampleType();
            }

            if(typeIdentifier == HKDataTypeIdentifierHeartbeatSeries){
                return HKObjectType.seriesType(forIdentifier: typeIdentifier);
            }
        }

        if(typeIdentifier == HKWorkoutTypeIdentifier){
            return HKObjectType.workoutType()
        }

        if #available(iOS 11.0, *){
            if typeIdentifier == HKWorkoutRouteTypeIdentifier{
                return HKObjectType.seriesType(forIdentifier: typeIdentifier);
            }
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

        if(typeIdentifier.starts(with: HKCorrelationTypeIdentifier_PREFIX)){
            let identifier = HKCorrelationTypeIdentifier.init(rawValue: typeIdentifier);
            return HKSampleType.correlationType(forIdentifier: identifier) as HKSampleType?
        }

        if #available(iOS 13, *) {
            if(typeIdentifier == HKAudiogramTypeIdentifier){
                return HKSampleType.audiogramSampleType();
            }
        }

        if(typeIdentifier == HKWorkoutTypeIdentifier){
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

    func serializeQuantity(unit: HKUnit, quantity: HKQuantity?) -> Dictionary<String, Any>? {
        guard let q = quantity else {
            return nil;
        }

        return [
            "quantity": q.doubleValue(for: unit),
            "unit": unit.unitString
        ]
    }

    func serializeQuantitySample(sample: HKQuantitySample, unit: HKUnit) -> NSDictionary {
        let endDate = _dateFormatter.string(from: sample.endDate)
        let startDate = _dateFormatter.string(from: sample.startDate);

        let quantity = sample.quantity.doubleValue(for: unit);

        return [
            "uuid": sample.uuid.uuidString,
            "device": self.serializeDevice(_device: sample.device),
            "quantityType": sample.quantityType.identifier,
            "endDate": endDate,
            "startDate": startDate,
            "quantity": quantity,
            "unit": unit.unitString,
            "metadata": self.serializeMetadata(metadata: sample.metadata),
            "sourceRevision": self.serializeSourceRevision(_sourceRevision: sample.sourceRevision) as Any,
        ]
    }

    func serializeCategorySample(sample: HKCategorySample) -> NSDictionary {
        let endDate = _dateFormatter.string(from: sample.endDate)
        let startDate = _dateFormatter.string(from: sample.startDate);

        return [
            "uuid": sample.uuid.uuidString,
            "device": self.serializeDevice(_device: sample.device),
            "categoryType": sample.categoryType.identifier,
            "endDate": endDate,
            "startDate": startDate,
            "value": sample.value,
            "metadata": self.serializeMetadata(metadata: sample.metadata),
            "sourceRevision": self.serializeSourceRevision(_sourceRevision: sample.sourceRevision) as Any,
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
    func saveQuantitySample(typeIdentifier: String, unitString: String, value: Double, start: Date, end: Date, metadata: Dictionary<String, Any>, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
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
            metadata: metadata
        )

        store.save(sample) { (success: Bool, error: Error?) in
            guard let err = error else {
                return resolve(success);
            }
            reject(GENERIC_ERROR, err.localizedDescription, error);
        }
    }

    @objc(saveCorrelationSample:samples:start:end:metadata:resolve:reject:)
    func saveCorrelationSample(typeIdentifier: String, samples: Array<Dictionary<String, Any>>, start: Date, end: Date, metadata: Dictionary<String, Any>, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }

        let identifier = HKCorrelationTypeIdentifier.init(rawValue: typeIdentifier);

        guard let type = HKObjectType.correlationType(forIdentifier: identifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }

        var initializedSamples = Set<HKSample>();
        for sample in samples {
            if(sample.keys.contains("quantityType")){
                let typeId = HKQuantityTypeIdentifier.init(rawValue: sample["quantityType"] as! String)
                if let type = HKSampleType.quantityType(forIdentifier: typeId) {
                    let unitStr = sample["unit"] as! String
                    let quantityVal = sample["quantity"] as! Double
                    let metadata = sample["metadata"] as? [String: Any]

                    let unit = HKUnit.init(from: unitStr)
                    let quantity = HKQuantity.init(unit: unit, doubleValue: quantityVal)
                    let quantitySample = HKQuantitySample.init(type: type, quantity: quantity, start: start, end: end, metadata: metadata)
                    initializedSamples.insert(quantitySample)
                }
            } else if(sample.keys.contains("categoryType")){
               let typeId = HKCategoryTypeIdentifier.init(rawValue: sample["categoryType"] as! String)
               if let type = HKSampleType.categoryType(forIdentifier: typeId) {
                   let value = sample["value"] as! Int
                   let metadata = sample["metadata"] as? [String: Any]

                   let categorySample = HKCategorySample.init(type: type, value: value, start: start, end: end, metadata: metadata)
                   initializedSamples.insert(categorySample);
               }
            }

        }

        let correlation = HKCorrelation.init(type: type, start: start, end: end, objects: initializedSamples, metadata: metadata)

        store.save(correlation) { (success: Bool, error: Error?) in
            guard let err = error else {
                return resolve(success);
            }
            reject(GENERIC_ERROR, err.localizedDescription, error);
        }
    }

    @objc(saveWorkoutSample:quantities:start:end:metadata:resolve:reject:)
    func saveWorkoutSample(typeIdentifier: UInt, quantities: Array<Dictionary<String, Any>>, start: Date, end: Date, metadata: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }

        guard let type = HKWorkoutActivityType.init(rawValue: typeIdentifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier.description, nil);
        }

        var initializedSamples = [HKSample]();
        var totalEnergyBurned: HKQuantity?
        var totalDistance: HKQuantity?
        var totalSwimmingStrokeCount: HKQuantity?
        var totalFlightsClimbed: HKQuantity?

        for quantity in quantities {
            let typeId = HKQuantityTypeIdentifier.init(rawValue: quantity["quantityType"] as! String)
            if let type = HKSampleType.quantityType(forIdentifier: typeId) {
                let unitStr = quantity["unit"] as! String
                let quantityVal = quantity["quantity"] as! Double
                let metadata = quantity["metadata"] as? [String: Any]

                let unit = HKUnit.init(from: unitStr)
                let quantity = HKQuantity.init(unit: unit, doubleValue: quantityVal)
                if(quantity.is(compatibleWith: HKUnit.kilocalorie())){
                    totalEnergyBurned = quantity;
                }
                if(quantity.is(compatibleWith: HKUnit.meter())){
                    totalDistance = quantity;
                }
                if(typeId == HKQuantityTypeIdentifier.swimmingStrokeCount){
                    totalSwimmingStrokeCount = quantity;
                }
                if(typeId == HKQuantityTypeIdentifier.flightsClimbed){
                    totalFlightsClimbed = quantity;
                }
                let quantitySample = HKQuantitySample.init(type: type, quantity: quantity, start: start, end: end, metadata: metadata)
                initializedSamples.append(quantitySample)
            }
        }

        var workout: HKWorkout?;


        if(totalSwimmingStrokeCount != nil){
            workout = HKWorkout.init(activityType: type, start: start, end: end, workoutEvents: nil, totalEnergyBurned: totalEnergyBurned, totalDistance: totalDistance, totalSwimmingStrokeCount: totalSwimmingStrokeCount, device: nil, metadata: metadata)
        } else {
                if #available(iOS 11, *) {
                    if (totalFlightsClimbed != nil ){
                        workout = HKWorkout.init(activityType: type, start: start, end: end, workoutEvents: nil, totalEnergyBurned: totalEnergyBurned, totalDistance: totalDistance, totalFlightsClimbed: totalFlightsClimbed, device: nil, metadata: metadata)
                    }
                }
        }

        if(workout == nil){
            workout = HKWorkout.init(activityType: type, start: start, end: end, workoutEvents: nil, totalEnergyBurned: totalEnergyBurned, totalDistance: totalDistance, metadata: metadata)
        }

        store.save(workout!) { (success: Bool, error: Error?) in
            guard let err = error else {
                if(success){
                    store.add(initializedSamples, to: workout!) { (success, error: Error?) in
                        guard let err = error else {
                            return resolve(success);
                        }
                        reject(GENERIC_ERROR, err.localizedDescription, error);
                    }
                    return;
                }
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

    @objc(enableBackgroundDelivery:updateFrequency:resolve:reject:)
    func enableBackgroundDelivery(typeIdentifier: String, updateFrequency: Int, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock){
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }

        guard let sampleType = objectTypeFromString(typeIdentifier: typeIdentifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }

        guard let frequency = HKUpdateFrequency.init(rawValue: updateFrequency) else {
            return reject("UpdateFrequency not valid", "UpdateFrequency not valid", nil);
        }

        store.enableBackgroundDelivery(for: sampleType, frequency:frequency ) { (success, error) in
            guard let err = error else {
                return resolve(success);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }
    }

    @objc(disableAllBackgroundDelivery:reject:)
    func disableAllBackgroundDelivery(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock){
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }

        store.disableAllBackgroundDelivery(completion: { (success, error) in
            guard let err = error else {
                return resolve(success);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        })
    }

    @objc(disableBackgroundDelivery:resolve:reject:)
    func disableBackgroundDelivery(typeIdentifier: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock){
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }

        guard let sampleType = objectTypeFromString(typeIdentifier: typeIdentifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }


        store.disableBackgroundDelivery(for: sampleType) { (success, error) in
            guard let err = error else {
                return resolve(success);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }
    }

    @objc(subscribeToObserverQuery:resolve:reject:)
    func subscribeToObserverQuery(typeIdentifier: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock){
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }

        guard let sampleType = sampleTypeFromString(typeIdentifier: typeIdentifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }

        let predicate = HKQuery.predicateForSamples(withStart: Date.init(), end: nil, options: HKQueryOptions.strictStartDate)

        let queryId = UUID().uuidString

        func responder(query: HKObserverQuery, handler: @escaping HKObserverQueryCompletionHandler, error: Error?) -> Void {
            if(error == nil){
                DispatchQueue.main.async {
                    if(self.bridge != nil && self.bridge.isValid){
                        self.sendEvent(withName: "onChange", body: [
                            "typeIdentifier": typeIdentifier,
                        ]);
                    }

                }
                handler();
            }
        }

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


    static override func requiresMainQueueSetup() -> Bool {
        return true
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
                var dic = Dictionary<String, Dictionary<String, Any>?>()
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

    func serializeUnknownQuantity(quantity: HKQuantity) -> Dictionary<String, Any>? {
        if(quantity.is(compatibleWith: HKUnit.percent())){
            return self.serializeQuantity(unit: HKUnit.percent(), quantity: quantity);
        }

        if(quantity.is(compatibleWith: HKUnit.second())){
            return self.serializeQuantity(unit: HKUnit.second(), quantity: quantity);
        }

        if(quantity.is(compatibleWith: HKUnit.kilocalorie())){
            return self.serializeQuantity(unit: HKUnit.kilocalorie(), quantity: quantity);
        }

        if(quantity.is(compatibleWith: HKUnit.count())){
            return self.serializeQuantity(unit: HKUnit.count(), quantity: quantity)
        }

        if(quantity.is(compatibleWith: HKUnit.meter())){
            return self.serializeQuantity(unit: HKUnit.meter(), quantity: quantity)
        }

        if #available(iOS 11, *) {
            if(quantity.is(compatibleWith: HKUnit.internationalUnit())){
                return self.serializeQuantity(unit: HKUnit.internationalUnit(), quantity: quantity);
            }
        }

        if #available(iOS 13, *) {
            if(quantity.is(compatibleWith: HKUnit.hertz())){
                return self.serializeQuantity(unit: HKUnit.hertz(), quantity: quantity);
            }
            if(quantity.is(compatibleWith: HKUnit.decibelHearingLevel())){
                return self.serializeQuantity(unit: HKUnit.decibelHearingLevel(), quantity: quantity);
            }
        }

        if(quantity.is(compatibleWith: SpeedUnit)){
            return self.serializeQuantity(unit: SpeedUnit, quantity: quantity);
        }

        if(quantity.is(compatibleWith: METUnit)){
            return self.serializeQuantity(unit: METUnit, quantity: quantity);
        }

        return nil;
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
                if let quantity = item.value as? HKQuantity {
                    if let s = serializeUnknownQuantity(quantity: quantity) {
                        serialized.setValue(s, forKey: item.key)
                    }
                }
            }
        }
        return serialized;
    }

    func serializeDevice(_device: HKDevice?) -> Dictionary<String, String?>? {
        guard let device = _device else {
            return nil;
        }
        return [
            "name": device.name,
            "firmwareVersion": device.firmwareVersion,
            "hardwareVersion": device.hardwareVersion,
            "localIdentifier": device.localIdentifier,
            "manufacturer": device.manufacturer,
            "model": device.model,
            "softwareVersion": device.softwareVersion,
        ]
    }

    func serializeOperatingSystemVersion(_version: OperatingSystemVersion?) -> String? {
        guard let version = _version else {
            return nil;
        }

        let versionString = "\(version.majorVersion).\(version.minorVersion).\(version.patchVersion)";

        return versionString;
    }

    func serializeSourceRevision(_sourceRevision: HKSourceRevision?) -> Dictionary<String, Any?>? {
        guard let sourceRevision = _sourceRevision else {
            return nil;
        }

        var dict = [
            "source": [
                "name": sourceRevision.source.name,
                "bundleIdentifier": sourceRevision.source.bundleIdentifier
            ],
            "version": sourceRevision.version
        ] as [String : Any];

        if #available(iOS 11, *) {
            dict["operatingSystemVersion"] = self.serializeOperatingSystemVersion(_version: sourceRevision.operatingSystemVersion);
            dict["productType"] = sourceRevision.productType;
        }

        return dict;
    }

    @objc(queryWorkoutSamples:distanceUnitString:from:to:limit:ascending:resolve:reject:)
    func queryWorkoutSamples(energyUnitString: String, distanceUnitString: String, from: Date, to: Date, limit: Int, ascending: Bool, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }

        let from = from.timeIntervalSince1970 > 0 ? from : nil;
        let to = to.timeIntervalSince1970 > 0 ? to : nil;

        let predicate = from != nil || to != nil ? HKQuery.predicateForSamples(withStart: from, end: to, options: [HKQueryOptions.strictEndDate, HKQueryOptions.strictStartDate]) : nil;

        let limit = limit == 0 ? HKObjectQueryNoLimit : limit;

        let energyUnit = HKUnit.init(from: energyUnitString)
        let distanceUnit = HKUnit.init(from: distanceUnitString)

        let q = HKSampleQuery(sampleType: .workoutType(), predicate: predicate, limit: limit, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending)]) { (query: HKSampleQuery, sample: [HKSample]?, error: Error?) in
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
                            "uuid": workout.uuid.uuidString,
                            "device": self.serializeDevice(_device: workout.device) as Any,
                            "duration": workout.duration,
                            "totalDistance": self.serializeQuantity(unit: distanceUnit, quantity: workout.totalDistance) as Any,
                            "totalEnergyBurned": self.serializeQuantity(unit: energyUnit, quantity: workout.totalEnergyBurned) as Any,
                            "totalSwimmingStrokeCount": self.serializeQuantity(unit: HKUnit.count(), quantity: workout.totalSwimmingStrokeCount) as Any,
                            "workoutActivityType": workout.workoutActivityType.rawValue,
                            "startDate": startDate,
                            "endDate": endDate,
                            "metadata": self.serializeMetadata(metadata: workout.metadata),
                            "sourceRevision": self.serializeSourceRevision(_sourceRevision: workout.sourceRevision) as Any
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
    func queryQuantitySamples(typeIdentifier: String, unitString: String, from: Date, to: Date, limit: Int, ascending: Bool, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
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

        let q = HKSampleQuery(sampleType: sampleType, predicate: predicate, limit: limit, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending)]) { (query: HKSampleQuery, sample: [HKSample]?, error: Error?) in
            guard let err = error else {
                guard let samples = sample else {
                    return resolve([]);
                }
                let arr: NSMutableArray = [];

                for s in samples {
                    if let sample = s as? HKQuantitySample {
                        let serialized = self.serializeQuantitySample(sample: sample, unit: HKUnit.init(from: unitString))

                        arr.add(serialized)
                    }
                }

                return resolve(arr);
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }

        store.execute(q);
    }

    @objc(queryCorrelationSamples:from:to:resolve:reject:)
    func queryCorrelationSamples(typeIdentifier: String, from: Date, to: Date, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil);
        }

        let identifier = HKCorrelationTypeIdentifier.init(rawValue: typeIdentifier);
        guard let sampleType = HKSampleType.correlationType(forIdentifier: identifier) else {
            return reject(TYPE_IDENTIFIER_ERROR, typeIdentifier, nil);
        }

        let from = from.timeIntervalSince1970 > 0 ? from : nil;
        let to = to.timeIntervalSince1970 > 0 ? to : nil;

        let predicate = from != nil || to != nil ? HKQuery.predicateForSamples(withStart: from, end: to, options: [HKQueryOptions.strictEndDate, HKQueryOptions.strictStartDate]) : nil;

        let q = HKCorrelationQuery(type: sampleType, predicate: predicate, samplePredicates: nil) { (query: HKCorrelationQuery, _correlations: [HKCorrelation]?, error: Error?) in
            guard let err = error else {
                guard let correlations = _correlations else {
                    return resolve([]);
                }

                var qts = Set<HKQuantityType>();
                for c in correlations {
                    for object in c.objects {
                        if let quantitySample = object as? HKQuantitySample {
                            qts.insert(quantitySample.quantityType)
                        }
                    }
                }
                return store.preferredUnits(for: qts) { (map: [HKQuantityType : HKUnit], error: Error?) in
                    guard let e = error else {
                        let collerationsToReturn: NSMutableArray = [];
                        for c in correlations {
                            let objects = NSMutableArray();
                            for o in c.objects {
                                if let quantitySample = o as? HKQuantitySample {
                                    objects.add(self.serializeQuantitySample(sample: quantitySample, unit: map[quantitySample.quantityType]!))
                                }
                                if let categorySample = o as? HKCategorySample {
                                    objects.add(self.serializeCategorySample(sample: categorySample))
                                }
                            }

                            collerationsToReturn.add([
                                "uuid": c.uuid.uuidString,
                                "device": self.serializeDevice(_device: c.device) as Any,
                                "correlationType": c.correlationType.identifier,
                                "objects": objects,
                                "metadata": self.serializeMetadata(metadata: c.metadata),
                                "startDate": self._dateFormatter.string(from: c.startDate),
                                "endDate": self._dateFormatter.string(from: c.endDate),
                            ])
                        }

                        return resolve(collerationsToReturn);
                    }
                    reject(GENERIC_ERROR, e.localizedDescription, e);
                }
            }
            reject(GENERIC_ERROR, err.localizedDescription, err);
        }

        store.execute(q);
    }

    @objc(queryCategorySamples:from:to:limit:ascending:resolve:reject:)
    func queryCategorySamples(typeIdentifier: String, from: Date, to: Date, limit: Int, ascending: Bool, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
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

        let q = HKSampleQuery(sampleType: sampleType, predicate: predicate, limit: limit, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending)]) { (query: HKSampleQuery, sample: [HKSample]?, error: Error?) in
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

    @available(iOS 13.0.0, *)
    func getWorkoutByID(store: HKHealthStore,
                        workoutUUID: UUID) async -> HKWorkout? {
        let workoutPredicate = HKQuery.predicateForObject(with: workoutUUID);

        let samples = try! await withCheckedThrowingContinuation {
            (continuation: CheckedContinuation<[HKSample], Error>) in
                let query = HKAnchoredObjectQuery(type: HKSeriesType.workoutType(),
                                                predicate: workoutPredicate,
                                                anchor: nil,
                                                limit: 1) {
                (query, samples, deletedObjects, anchor, error) in

                if let hasError = error {
                    continuation.resume(throwing: hasError)
                    return
                }

                guard let samples = samples else {
                    fatalError("Should not fail")
                }

                continuation.resume(returning: samples)
            }
            store.execute(query)
        }

        guard let workouts = samples as? [HKWorkout] else {
            return nil
        }

        return workouts.first ?? nil
    }


    @available(iOS 13.0.0, *)
    func _getWorkoutRoutes(store: HKHealthStore, workoutUUID: UUID) async -> [HKWorkoutRoute]?{
        guard let workout = await getWorkoutByID(store: store, workoutUUID: workoutUUID) else {
            return nil
        }

        let workoutPredicate = HKQuery.predicateForObjects(from: workout)
        let samples = try! await withCheckedThrowingContinuation {
            (continuation: CheckedContinuation<[HKSample], Error>) in
                let query = HKAnchoredObjectQuery(type: HKSeriesType.workoutRoute(),
                                                predicate: workoutPredicate,
                                                anchor: nil,
                                                limit: HKObjectQueryNoLimit) {
                (query, samples, deletedObjects, anchor, error) in

                if let hasError = error {
                    continuation.resume(throwing: hasError)
                    return
                }

                guard let samples = samples else {
                    fatalError("Should not fail")
                }

                continuation.resume(returning: samples)
            }
            store.execute(query)
        }

        guard let routes = samples as? [HKWorkoutRoute] else {
            return nil
        }

        return routes
    }

    @available(iOS 13.0.0, *)
    func getRouteLocations(store: HKHealthStore, route: HKWorkoutRoute) async -> [CLLocation] {
        let locations = try! await withCheckedThrowingContinuation {
            (continuation: CheckedContinuation<[CLLocation], Error>) in
            var allLocations: [CLLocation] = []

            let query = HKWorkoutRouteQuery(route: route) {
                (query, locationsOrNil, done, errorOrNil) in

                if let error = errorOrNil {
                    continuation.resume(throwing: error)
                    return
                }

                guard let currentLocationBatch = locationsOrNil else {
                    fatalError("Should not fail")
                }

                allLocations.append(contentsOf: currentLocationBatch)

                if done {
                    continuation.resume(returning: allLocations)
                }
            }

            store.execute(query)
        }

        return locations
    }

    @available(iOS 13.0.0, *)
    func getSerializedWorkoutLocations(store: HKHealthStore, workoutUUID: UUID) async -> [Dictionary<String, Any>]? {
        let routes = await _getWorkoutRoutes(store: store, workoutUUID: workoutUUID)

        var allRoutes: [Dictionary<String, Any>] = []
        guard let _routes = routes else {
            return nil
        }
        for route in _routes {
            let routeMetadata = self.serializeMetadata(metadata: route.metadata) as! Dictionary<String, Any>
            let routeLocations = (await getRouteLocations(store: store, route: route)).map{serializeLocation(location: $0)}
            let routeInfos: Dictionary<String, Any> = ["locations": routeLocations]
            allRoutes.append(routeInfos.merging(routeMetadata) { (current, _) in current })
        }
        return allRoutes
    }

    func serializeLocation(location: CLLocation) -> Dictionary<String, Any> {
        return [
            "longitude": location.coordinate.longitude,
            "latitude": location.coordinate.latitude,
            "altitude": location.altitude,
            "speed": location.speed,
            "timestamp": location.timestamp.timeIntervalSince1970,
            "horizontalAccuracy": location.horizontalAccuracy,
            "speedAccuracy": location.speedAccuracy,
            "verticalAccuracy": location.verticalAccuracy,
        ]
    }

    @available(iOS 13.0.0, *)
    @objc(getWorkoutRoutes:resolve:reject:)
    func getWorkoutRoutes(
        workoutUUID: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock){

        guard let store = _store else {
            return reject(INIT_ERROR, INIT_ERROR_MESSAGE, nil)
        }

        guard let _workoutUUID = UUID(uuidString: workoutUUID) else {
            return reject("INVALID_UUID_ERROR", "Invalid UUID received", nil)
        }

        async {
            do {
                let locations = await getSerializedWorkoutLocations(store: store, workoutUUID: _workoutUUID)
                resolve(locations)
            }
            catch {
                reject("WORKOUT_LOCATION_ERROR", "Failed to retrieve workout locations", nil)
            }
        }
    }
}
