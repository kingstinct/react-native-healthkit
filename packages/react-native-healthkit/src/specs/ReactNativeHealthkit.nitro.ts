// TODO: Export specs that extend HybridObject<...> here

import type { HybridObject } from "react-native-nitro-modules";

/*export class ReactNativeHealthkit implements HybridObject<{ ios: 'swift' }> {
	dispose(): void {
        
    }

    equals(other: ReactNativeHealthkit): boolean {
        return true
    }

    get name(): string {
        return 'ReactNativeHealthkit';
    }

    get platform(): string {
        return 'ios';
    }
}*/

export interface ReactNativeHealthkit extends HybridObject<{ ios: 'swift' }> {
    readonly pi: number
    add(a: number, b: number): number
}