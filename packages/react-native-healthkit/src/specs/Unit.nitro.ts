import type { HybridObject } from "react-native-nitro-modules";
import type { HKQuantityTypeIdentifier } from "../types/HKQuantityTypeIdentifier";

export interface Unit extends HybridObject<{ ios: 'swift' }> {
    readonly getPreferredUnits: (
        identifiers: readonly HKQuantityTypeIdentifier[]
    ) => Promise<Record<HKQuantityTypeIdentifier, HKUnit>>;
}

// Unit types are a straight mapping from here https://developer.apple.com/documentation/healthkit/hkunit/1615733-init
export enum HKMetricPrefix {
    None = '',
    Pico = 'p',
    Nano = 'n',
    Micro = 'mc',
    Milli = 'm',
    Centi = 'c',
    Deci = 'd',
    Deca = 'da',
    Hecto = 'h',
    Kilo = 'k',
    Mega = 'M',
    Giga = 'G',
    Tera = 'T',
    Femto = 'f',
}

export enum HKUnitMetric {
    Gram = 'g',
    Joule = 'J',
    Kelvin = 'K',
    Liter = 'l',
    Meter = 'm',
    Pascal = 'Pa',
    Second = 's',
    Siemen = 'S',
    Hertz = 'Hz',
    Volt = 'V',
}

export enum HKUnits {
    DecibelHearingLevel = 'dBHL',
    DecibelSoundPressureLevel = 'dBASPL',
    Percent = '%',
    Count = 'count',
    InternationalUnit = 'IU',
    AppleEffortScore = 'appleEffortScore'
}

export type MeterUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
    `${Prefix}${HKUnitMetric.Meter}`;
export type LiterUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
    `${Prefix}${HKUnitMetric.Liter}`;
export type GramUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
    `${Prefix}${HKUnitMetric.Gram}`;
export type PascalUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
    `${Prefix}${HKUnitMetric.Pascal}`;
export type SecondUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
    `${Prefix}${HKUnitMetric.Second}`;
export type JouleUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
    `${Prefix}${HKUnitMetric.Joule}`;
export type HertzUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
    `${Prefix}${HKUnitMetric.Hertz}`;
export type VoltUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
    `${Prefix}${HKUnitMetric.Volt}`;
export type SiemenUnit<Prefix extends HKMetricPrefix = HKMetricPrefix.None> =
    `${Prefix}${HKUnitMetric.Siemen}`;

// not 100% sure about these
export type MoleUnit<MolarMass extends number> = `mol<${MolarMass}>`;
export type MoleUnitWith<
    MolarMass extends number,
    Prefix extends HKMetricPrefix = HKMetricPrefix.None
> = `${Prefix}mol<${MolarMass}>`;

export type FrequencyUnit = HertzUnit<HKMetricPrefix>;

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'cm', 'km'
 */
export enum UnitOfLength {
    Feet = 'ft',
    /**
     * More SI prefixes also available as literals, just type the string
     * @example 'cm', 'km'
     */
    Meter = 'm',
    Inches = 'in',
    Yards = 'yd',
    Miles = 'mi',
}
export type LengthUnit = MeterUnit<HKMetricPrefix> | UnitOfLength;

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ml', 'cl'
 */
export enum UnitOfVolume {
    ImperialCup = 'cup_imp',
    ImperialFluidOunces = 'fl_oz_imp',
    ImperialPint = 'pt_imp',
    USCup = 'cup_us',
    USFluidOunces = 'fl_oz_us',
    USPint = 'pt_us',
    /**
     * More SI prefixes also available as literals, just type the string
     * @example 'ml', 'cl'
     */
    Liter = 'l',
}
export type VolumeUnit = LiterUnit<HKMetricPrefix> | UnitOfVolume;

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'mg', 'kg'
 */
export enum UnitOfMass {
    Ounces = 'oz',
    Stones = 'st',
    Pounds = 'lb',
    /**
     * More SI prefixes also available as literals, just type the string
     * @example 'mg', 'kg'
     */
    Gram = 'g',
}
/**
 * More SI prefixes also available as literals, just type the string
 * @example 'mg', 'kg'
 */
export type MassUnit = GramUnit<HKMetricPrefix> | UnitOfMass;

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kPa', 'hPa'
 */
export enum UnitOfPressure {
    Atmospheres = 'atm',
    CentimetersOfWater = 'cmAq',
    MillimetersOfMercury = 'mmHg',
    InchesOfMercury = 'inHg',
    DecibelAWeightedSoundPressureLevel = 'dBASPL',
    /**
     * More SI prefixes also available as literals, just type the string
     * @example 'kPa', 'hPa'
     */
    Pascals = 'Pa',
}

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kPa', 'hPa'
 */
export type PressureUnit = PascalUnit<HKMetricPrefix> | UnitOfPressure;

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ms'
 */
export enum UnitOfTime {
    Days = 'd',
    Minutes = 'min',
    Hours = 'hr',
    /**
     * More SI prefixes also available as literals, just type the string
     * @example 'ms'
     */
    Seconds = 's',
}
/**
 * More SI prefixes also available as literals, just type the string
 * @example 'ms'
 */
export type TimeUnit = SecondUnit<HKMetricPrefix> | UnitOfTime;
export enum TemperatureUnit {
    DegreesCelsius = 'degC',
    DegreesFahrenheit = 'degF',
    Kelvin = 'K',
}

/**
 * More SI prefixes also available as literals, just type the string
 * @example 'kJ'
 */
export enum UnitOfEnergy {
    Kilocalories = 'kcal',
    LargeCalories = 'Cal',
    SmallCalories = 'cal',
    /**
     * More SI prefixes also available as literals, just type the string
     * @example 'kJ'
     */
    Joules = 'J',
}
export type EnergyUnit = JouleUnit<HKMetricPrefix> | UnitOfEnergy;

export enum BloodGlucoseUnit {
    GlucoseMmolPerL = 'mmol<180.15588000005408>/l',
    GlucoseMgPerDl = 'mg/dL',
}

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
    | `${BloodGlucoseUnit}`
    | `${EnergyUnit}`

    | `${HKUnits}`
    | `${LengthUnit}`
    | `${MassUnit}`
    | `${PressureUnit}`
    | `${TemperatureUnit}`
    | `${TimeUnit}`
    | `${VolumeUnit}`;
