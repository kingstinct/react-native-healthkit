const serializeDate = (date?: Date | null): string => (
  (date || new Date(-1)).toISOString()
)

export default serializeDate
