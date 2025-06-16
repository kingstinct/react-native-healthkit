// Unit types are a straight mapping from here https://developer.apple.com/documentation/healthkit/hkunit/1615733-init
export type MetricPrefix =
  | ''
  | 'p'
  | 'n'
  | 'mc'
  | 'm'
  | 'c'
  | 'd'
  | 'da'
  | 'h'
  | 'k'
  | 'M'
  | 'G'
  | 'T'
  | 'f'

export type UnitMetric =
  | 'g'
  | 'J'
  | 'K'
  | 'l'
  | 'm'
  | 'Pa'
  | 's'
  | 'S'
  | 'Hz'
  | 'V'

export type Units =
  | 'dBHL'
  | 'dBASPL'
  | '%'
  | 'count'
  | 'IU'
  | 'appleEffortScore'

export type MeterUnit<Prefix extends MetricPrefix> = `${Prefix}m`
export type LiterUnit<Prefix extends MetricPrefix> = `${Prefix}l`
export type GramUnit<Prefix extends MetricPrefix> = `${Prefix}g`
export type PascalUnit<Prefix extends MetricPrefix> = `${Prefix}Pa`
export type SecondUnit<Prefix extends MetricPrefix> = `${Prefix}s`
export type JouleUnit<Prefix extends MetricPrefix> = `${Prefix}J`
export type HertzUnit<Prefix extends MetricPrefix> = `${Prefix}Hz`
export type VoltUnit<Prefix extends MetricPrefix> = `${Prefix}V`
export type SiemenUnit<Prefix extends MetricPrefix> = `${Prefix}S`

// not 100% sure about these
export type MoleUnit<MolarMass extends number> = `mol<${MolarMass}>`
export type MoleUnitWith<
  MolarMass extends number,
  Prefix extends MetricPrefix,
> = `${Prefix}mol<${MolarMass}>`

export type FrequencyUnit = HertzUnit<MetricPrefix>

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'cm', 'km'
 */
export type UnitOfLength =
  | 'ft'
  /**
   * More SI prefixes also available as literals, just type the string
   * @example 'cm', 'km'
   */
  | 'm'
  | 'in'
  | 'yd'
  | 'mi'

export type LengthUnit = MeterUnit<MetricPrefix> | UnitOfLength

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ml', 'cl'
 */
export type UnitOfVolume =
  | 'cup_imp'
  | 'fl_oz_imp'
  | 'pt_imp'
  | 'cup_us'
  | 'fl_oz_us'
  | 'pt_us'
  /**
   * More SI prefixes also available as literals, just type the string
   * @example 'ml', 'cl'
   */
  | 'l'

export type VolumeUnit = LiterUnit<MetricPrefix> | UnitOfVolume

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'mg', 'kg'
 */
export type UnitOfMass =
  | 'oz'
  | 'st'
  | 'lb'
  /**
   * More SI prefixes also available as literals, just type the string
   * @example 'mg', 'kg'
   */
  | 'g'

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'mg', 'kg'
 */
export type MassUnit = GramUnit<MetricPrefix> | UnitOfMass

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kPa', 'hPa'
 */
export type UnitOfPressure =
  | 'atm'
  | 'cmAq'
  | 'mmHg'
  | 'inHg'
  | 'dBASPL'
  /**
   * More SI prefixes also available as literals, just type the string
   * @example 'kPa', 'hPa'
   */
  | 'Pa'

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kPa', 'hPa'
 */
export type PressureUnit = PascalUnit<MetricPrefix> | UnitOfPressure

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ms'
 */
export type UnitOfTime =
  | 'd'
  | 'min'
  | 'hr'
  /**
   * More SI prefixes also available as literals, just type the string
   * @example 'ms'
   */
  | 's'

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ms'
 */
export type TimeUnit = SecondUnit<MetricPrefix> | UnitOfTime
export type TemperatureUnit = 'degC' | 'degF' | 'K'

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kJ'
 */
export type UnitOfEnergy = 'kcal' | 'Cal' | 'cal' | 'J'

export type EnergyUnit = JouleUnit<MetricPrefix> | UnitOfEnergy

export type BloodGlucoseUnit = 'mmol<180.15588000005408>/l' | 'mg/dL'

export type SpeedUnit<
  TLength extends LengthUnit,
  TTime extends TimeUnit,
> = `${TLength}/${TTime}`

export type CountPerTime<TTime extends TimeUnit> = `count/${TTime}`

export type Unit =
  | BloodGlucoseUnit
  | CountPerTime<TimeUnit>
  | EnergyUnit
  | FrequencyUnit
  | Units
  | LengthUnit
  | MassUnit
  | PressureUnit
  | SpeedUnit<LengthUnit, TimeUnit>
  | TemperatureUnit
  | TimeUnit
  | VolumeUnit

export interface IdentifierWithUnit {
  typeIdentifier: string
  unit: string
}
