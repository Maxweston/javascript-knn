module.exports = function vectorMagnitude(vector) {
  let mag = 0
  for (let i = 0; i < vector.length; i++) {
    mag += Math.pow(vector[i], 2)
  }
  return mag
}