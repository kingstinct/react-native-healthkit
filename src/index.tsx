import { NativeModules } from 'react-native';

type ReactNativeHealthkitType = {
  multiply(a: number, b: number): Promise<number>;
};

const { ReactNativeHealthkit } = NativeModules;

export default ReactNativeHealthkit as ReactNativeHealthkitType;
