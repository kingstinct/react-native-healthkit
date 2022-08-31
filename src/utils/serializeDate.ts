const serializeDate = (date?: Date | null): string => (date ? date.toISOString() : new Date(0).toISOString())

export default serializeDate
