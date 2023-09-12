function ensureTotals<TTotals>(totals?: TTotals) {
  return totals || ({} as TTotals)
}

export default ensureTotals
