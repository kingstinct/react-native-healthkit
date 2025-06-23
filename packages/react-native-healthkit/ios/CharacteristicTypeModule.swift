import HealthKit
import NitroModules

class CharacteristicTypeModule: HybridCharacteristicTypeModuleSpec {
    func getBloodTypeAsync() throws -> Promise<BloodType> {
        return Promise.resolved(withResult: try self.getBloodType())
    }

    func getDateOfBirthAsync() throws -> Promise<Date?> {
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

  func getDateOfBirth() throws -> Date? {
      do {
          let components = try store.dateOfBirthComponents()
          return components.date
      } catch {
          let nsError = error as NSError

          // 1️⃣ HealthKit’s documented “no data” error
          if nsError.domain == HKError.errorDomain,
             nsError.code   == HKError.Code.errorNoData.rawValue {
              return nil
          }

          // 2️⃣ The undocumented generic Obj-C error some OS versions emit
          if nsError.domain == "Foundation._GenericObjCError",
             nsError.code   == 0 {
              return nil
          }

          // Anything else is a real failure – surface it to JS
          throw RuntimeError.error(
              withMessage: "[react-native-healthkit] Failed to get date of birth: \(nsError.localizedDescription)"
          )
      }
  }

    func getBloodType() throws -> BloodType {
        let bloodTypeObject = try store.bloodType()

        if let bloodType = BloodType(rawValue: Int32(bloodTypeObject.bloodType.rawValue)) {
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
