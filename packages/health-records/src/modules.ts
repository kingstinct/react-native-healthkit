import { NitroModules } from 'react-native-nitro-modules'
import type { HealthRecordsModule } from './specs/HealthRecordsModule.nitro'

export const HealthRecords =
  NitroModules.createHybridObject<HealthRecordsModule>('HealthRecordsModule')
