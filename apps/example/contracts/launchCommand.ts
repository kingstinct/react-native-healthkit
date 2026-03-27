import { File, Paths } from 'expo-file-system'

export interface LaunchCommand {
  readonly route: 'contracts'
  readonly autorun?: 'all'
  readonly scenario?: string
}

export const contractLaunchCommandFile = new File(
  Paths.document,
  'healthkit-contract-command.json',
)

export function readLaunchCommand(): LaunchCommand | null {
  if (!contractLaunchCommandFile.exists) {
    return null
  }

  try {
    const value = JSON.parse(
      contractLaunchCommandFile.textSync(),
    ) as LaunchCommand

    return value
  } catch (error) {
    console.error('Failed to read contract launch command:', error)
    return null
  }
}

export function clearLaunchCommand() {
  if (!contractLaunchCommandFile.exists) {
    return
  }

  try {
    contractLaunchCommandFile.delete()
  } catch (error) {
    console.error('Failed to delete contract launch command:', error)
  }
}

export function readAndClearLaunchCommand(): LaunchCommand | null {
  const command = readLaunchCommand()
  if (!command) {
    return null
  }
  clearLaunchCommand()
  return command
}
