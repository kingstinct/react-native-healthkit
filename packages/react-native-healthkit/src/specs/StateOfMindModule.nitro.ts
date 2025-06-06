// TODO: Export specs that extend HybridObject<...> here

import type { HybridObject } from "react-native-nitro-modules";
import type { QueryOptionsWithSortOrder } from "../types/QueryOptions";
import type { StateOfMindSample } from "../types/StateOfMind";


export interface StateOfMindModule extends HybridObject<{ ios: 'swift' }> {
    querySamples(
        options?: QueryOptionsWithSortOrder
      ): Promise<readonly StateOfMindSample[]>;
}