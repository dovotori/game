export const mapFromRange = (valeur, minRef, maxRef, minDest, maxDest) => {
  let resultat =
    minDest + (valeur - minRef) * (maxDest - minDest) / (maxRef - minRef)
  if (resultat < Math.min(minDest, maxDest)) {
    resultat = Math.min(minDest, maxDest)
  }
  if (resultat > Math.max(minDest, maxDest)) {
    resultat = Math.max(minDest, maxDest)
  }
  return resultat
}
