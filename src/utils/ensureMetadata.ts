function ensureMetadata<TMetadata>(metadata?: TMetadata) {
  return metadata || ({} as TMetadata)
}

export default ensureMetadata
