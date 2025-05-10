
// Unit types are a straight mapping from here https://developer.apple.com/documentation/healthkit/hkunit/1615733-init
export type HKMetricPrefix =
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

export type HKUnitMetric =
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

export type HKUnits =
    | 'dBHL'
    | 'dBASPL'
    | '%'
    | 'count'
    | 'IU'
    | 'appleEffortScore'

export type MeterUnit<Prefix extends HKMetricPrefix> =
    `${Prefix}m`;
export type LiterUnit<Prefix extends HKMetricPrefix> =
    `${Prefix}l`;
export type GramUnit<Prefix extends HKMetricPrefix> =
    `${Prefix}g`;
export type PascalUnit<Prefix extends HKMetricPrefix> =
    `${Prefix}Pa`;
export type SecondUnit<Prefix extends HKMetricPrefix> =
    `${Prefix}s`;
export type JouleUnit<Prefix extends HKMetricPrefix> =
    `${Prefix}J`;
export type HertzUnit<Prefix extends HKMetricPrefix> =
    `${Prefix}Hz`;
export type VoltUnit<Prefix extends HKMetricPrefix> =
    `${Prefix}V`;
export type SiemenUnit<Prefix extends HKMetricPrefix> =
    `${Prefix}S`;

// not 100% sure about these
export type MoleUnit<MolarMass extends number> = `mol<${MolarMass}>`;
export type MoleUnitWith<
    MolarMass extends number,
    Prefix extends HKMetricPrefix
> = `${Prefix}mol<${MolarMass}>`;

export type FrequencyUnit = HertzUnit<HKMetricPrefix>;

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

export type LengthUnit = MeterUnit<HKMetricPrefix> | UnitOfLength;

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

export type VolumeUnit = LiterUnit<HKMetricPrefix> | UnitOfVolume;

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
export type MassUnit = GramUnit<HKMetricPrefix> | UnitOfMass;

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
export type PressureUnit = PascalUnit<HKMetricPrefix> | UnitOfPressure;

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
export type TimeUnit = SecondUnit<HKMetricPrefix> | UnitOfTime;
export type TemperatureUnit = 'degC' | 'degF' | 'K';

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kJ'
 */
export type UnitOfEnergy = 'kcal' | 'Cal' | 'cal' | 'J';

export type EnergyUnit = JouleUnit<HKMetricPrefix> | UnitOfEnergy;

export type BloodGlucoseUnit = 'mmol<180.15588000005408>/l' | 'mg/dL';

export type SpeedUnit<
    TLength extends LengthUnit,
    TTime extends TimeUnit
> = `${TLength}/${TTime}`;

export type CountPerTime<TTime extends TimeUnit> = `count/${TTime}`;

export type HKUnit =
    | BloodGlucoseUnit
    | CountPerTime<TimeUnit>
    | EnergyUnit
    | FrequencyUnit
    | HKUnits
    | LengthUnit
    | MassUnit
    | PressureUnit
    | SpeedUnit<LengthUnit, TimeUnit>
    | TemperatureUnit
    | TimeUnit
    | VolumeUnit