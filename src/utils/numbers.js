export const mapFromRange = (valeur, minRef, maxRef, minDest, maxDest) => {
  let result =
    minDest + (valeur - minRef) * (maxDest - minDest) / (maxRef - minRef)
  if (result < Math.min(minDest, maxDest)) {
    result = Math.min(minDest, maxDest)
  }
  if (result > Math.max(minDest, maxDest)) {
    result = Math.max(minDest, maxDest)
  }
  return result
}

export const signe = valeur => {
  if (valeur == 0) return 0
  else if (valeur > 0) return 1
  else return -1
}
