import { NativeModules } from 'react-native'

NativeModules.ReactNativeHealthkit = {
  isHealthDataAvailable: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}
