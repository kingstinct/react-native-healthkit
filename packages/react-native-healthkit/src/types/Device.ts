/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkdevice Apple Docs }
 */
export interface Device {
  readonly name: string | null // ex: "Apple Watch"
  readonly firmwareVersion: string | null
  readonly hardwareVersion: string | null // ex: "Watch6,2",
  readonly localIdentifier: string | null
  readonly manufacturer: string | null // ex: "Apple Inc."
  readonly model: string | null // ex: "Watch"
  readonly softwareVersion: string | null // ex: "9.0"
  readonly udiDeviceIdentifier: string | null
}
