import { File, Paths } from 'expo-file-system'

export const contractReportFile = new File(
  Paths.document,
  'healthkit-contract-report.json',
)

export function writeContractReport(value: unknown) {
  contractReportFile.create({
    overwrite: true,
    intermediates: true,
  })
  contractReportFile.write(
    JSON.stringify(
      value,
      (_key, currentValue) =>
        currentValue instanceof Date
          ? currentValue.toISOString()
          : currentValue,
      2,
    ),
  )
}
