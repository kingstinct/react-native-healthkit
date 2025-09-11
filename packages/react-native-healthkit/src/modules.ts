import { NitroModules } from 'react-native-nitro-modules'
import type {
  CategoryTypeModule,
  CategoryTypeModuleTyped,
} from './specs/CategoryTypeModule.nitro'
import type { CharacteristicTypeModule } from './specs/CharacteristicTypeModule.nitro'
import type { CoreModule } from './specs/CoreModule.nitro'
import type { CorrelationTypeModule } from './specs/CorrelationTypeModule.nitro'
import type { ElectrocardiogramModule } from './specs/ElectrocardiogramModule.nitro'
import type { HeartbeatSeriesModule } from './specs/HeartbeatSeriesModule.nitro'
import type { QuantityTypeModule } from './specs/QuantityTypeModule.nitro'
import type { StateOfMindModule } from './specs/StateOfMindModule.nitro'
import type { WorkoutsModule } from './specs/WorkoutsModule.nitro'

export const Core = NitroModules.createHybridObject<CoreModule>('CoreModule')

export const Workouts =
  NitroModules.createHybridObject<WorkoutsModule>('WorkoutsModule')

export const Characteristics =
  NitroModules.createHybridObject<CharacteristicTypeModule>(
    'CharacteristicTypeModule',
  )

export const QuantityTypes =
  NitroModules.createHybridObject<QuantityTypeModule>('QuantityTypeModule')

export const CategoryTypes =
  NitroModules.createHybridObject<CategoryTypeModule>(
    'CategoryTypeModule',
  ) as CategoryTypeModuleTyped

export const CorrelationTypes =
  NitroModules.createHybridObject<CorrelationTypeModule>(
    'CorrelationTypeModule',
  )

export const Electrocardiograms =
  NitroModules.createHybridObject<ElectrocardiogramModule>(
    'ElectrocardiogramModule',
  )

export const HeartbeatSeries =
  NitroModules.createHybridObject<HeartbeatSeriesModule>(
    'HeartbeatSeriesModule',
  )

export const StateOfMind =
  NitroModules.createHybridObject<StateOfMindModule>('StateOfMindModule')
