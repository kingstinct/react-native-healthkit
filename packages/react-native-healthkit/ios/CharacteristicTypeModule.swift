
import HealthKit
import NitroModules

class CharacteristicTypeModule: HybridCharacteristicTypeModuleSpec {
    func getBloodTypeAsync() throws -> Promise<BloodType> {
        return Promise.resolved(withResult: try self.getBloodType())
    }
    
    func getDateOfBirthAsync() throws -> Promise<Date> {
        return Promise.resolved(withResult: try self.getDateOfBirth())
    }
    
    func getBiologicalSexAsync() throws -> Promise<BiologicalSex> {
        return Promise.resolved(withResult: try self.getBiologicalSex())
    }
    
    func getFitzpatrickSkinTypeAsync() throws -> Promise<FitzpatrickSkinType> {
        return Promise.resolved(withResult: try self.getFitzpatrickSkinType())
    }
    
    func getWheelchairUseAsync() throws -> Promise<WheelchairUse> {
        return Promise.resolved(withResult: try self.getWheelchairUse())
    }
    
    // Using the global 'store' instance defined in Auth.swift

    func getBiologicalSex() throws -> BiologicalSex {
        let biologicalSexObject = try store.biologicalSex()
        if let biologicalSex = BiologicalSex(rawValue: Int32(biologicalSexObject.biologicalSex.rawValue)) {
            return biologicalSex
        }
        throw RuntimeError.error(withMessage: "[react-native-healthkit] Got unknown biological sex value: \(biologicalSexObject.biologicalSex.rawValue)")
    }

    func getDateOfBirth() throws -> Date {
        let dateOfBirthComponents = try store.dateOfBirthComponents()
        
        if let date = dateOfBirthComponents.date {
            return date
        }
        
        throw RuntimeError.error(withMessage: "[react-native-healthkit] Date of birth is not available or not set")
    }

    func getBloodType() throws -> BloodType {
        let bloodTypeObject = try store.bloodType()
        
        if let bloodType = BloodType(rawValue: Int32(bloodTypeObject.bloodType.rawValue)){
            return bloodType
        }
        
        throw RuntimeError.error(withMessage: "[react-native-healthkit] Got unknown blood type value: \(bloodTypeObject.bloodType.rawValue)")
    }

    func getFitzpatrickSkinType() throws -> FitzpatrickSkinType {
        if #available(iOS 9.0, *) {
            let skinTypeObject = try store.fitzpatrickSkinType()
            
            if let skinType = FitzpatrickSkinType(rawValue: Int32(skinTypeObject.skinType.rawValue)) {
                return skinType
            }
            
            throw RuntimeError.error(withMessage: "[react-native-healthkit] Got unknown Fitzpatrick skin type value: \(skinTypeObject.skinType.rawValue)")
        } else {
            throw RuntimeError.error(withMessage: "Fitzpatrick skin type is not available before iOS 9.0")
        }
    }

    @available(iOS 10.0, *)
    func getWheelchairUse() throws -> WheelchairUse {
        let wheelchairUseObject = try store.wheelchairUse()
        if let wheelChairUse = WheelchairUse(rawValue: Int32(wheelchairUseObject.wheelchairUse.rawValue)) {
            return wheelChairUse
        }
        throw RuntimeError.error(withMessage: "[react-native-healthkit] Got unknown wheelchair use value: \(wheelchairUseObject.wheelchairUse.rawValue)")
    }
}
