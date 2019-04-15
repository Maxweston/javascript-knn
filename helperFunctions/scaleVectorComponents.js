module.exports = function scaleVectorComponents(vector, scaleFactor) {
  for (i = 0; i < vector.length; i++) {
    vector[i] * scaleFactor
  }
  return vector
}