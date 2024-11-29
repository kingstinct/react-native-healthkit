import Native from '../native-types'

export const queryStateOfMindSamples = async ({
  from, to, limit, ascending,
}: { readonly from?: Date; readonly to?: Date; readonly limit?: number; readonly ascending?: boolean } = {}) => {
  const fromString = (from || new Date(0)).toISOString()
  const toString = (to || new Date(0)).toISOString()

  const res = await Native.queryStateOfMindSamples(fromString, toString, limit ?? 0, ascending ?? false)

  return res
}

export default queryStateOfMindSamples
