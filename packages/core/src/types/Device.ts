/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkdevice Apple Docs }
 */
export interface Device {
  readonly name?: string // ex: "Apple Watch"
  readonly firmwareVersion?: string
  readonly hardwareVersion?: string // ex: "Watch6,2",
  readonly localIdentifier?: string
  readonly manufacturer?: string // ex: "Apple Inc."
  readonly model?: string // ex: "Watch"
  readonly softwareVersion?: string // ex: "9.0"
  readonly udiDeviceIdentifier?: string
}
