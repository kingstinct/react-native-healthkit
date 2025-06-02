
import HealthKit
import NitroModules

class Characteristic: HybridCharacteristicSpec {
    func getBloodTypeAsync() throws -> Promise<Double> {
        return Promise.resolved(withResult: try self.getBloodType())
    }
    
    func getDateOfBirthAsync() throws -> Promise<String> {
        return Promise.resolved(withResult: try self.getDateOfBirth())
    }
    
    func getBiologicalSexAsync() throws -> Promise<Double> {
        return Promise.resolved(withResult: try self.getBiologicalSex())
    }
    
    func getFitzpatrickSkinTypeAsync() throws -> Promise<Double> {
        return Promise.resolved(withResult: try self.getFitzpatrickSkinType())
    }
    
    func getWheelchairUseAsync() throws -> Promise<Double> {
        return Promise.resolved(withResult: try self.getWheelchairUse())
    }
    
    // Using the global 'store' instance defined in Auth.swift

    func getBiologicalSex() throws -> Double {
        let biologicalSexObject = try store.biologicalSex()
        return Double(biologicalSexObject.biologicalSex.rawValue)
    }

    func getDateOfBirth() throws -> String {
        let dateOfBirthComponents = try store.dateOfBirthComponents()
        guard let date = dateOfBirthComponents.date else {
            throw RuntimeError.error(withMessage: "Date of birth is not available or not set")
        }
        let formatter = ISO8601DateFormatter()
        // Consistent with formatOptions in ReactNativeHealthkitInternal.swift constructor
        formatter.formatOptions = [.withFullDate]
        return formatter.string(from: date)
    }

    func getBloodType() throws -> Double {
        let bloodTypeObject = try store.bloodType()
        return Double(bloodTypeObject.bloodType.rawValue)
    }

    func getFitzpatrickSkinType() throws -> Double {
        if #available(iOS 9.0, *) {
            let skinTypeObject = try store.fitzpatrickSkinType()
            return Double(skinTypeObject.skinType.rawValue)
        } else {
            throw RuntimeError.error(withMessage: "Fitzpatrick skin type is not available before iOS 9.0")
        }
    }

    @available(iOS 10.0, *)
    func getWheelchairUse() throws -> Double {
        let wheelchairUseObject = try store.wheelchairUse()
        return Double(wheelchairUseObject.wheelchairUse.rawValue)
    }
}
