module.exports = function scaleVectorComponents(vector, scaleVector) {
  for (i = 0; i < vector.length; i++) {
    vector[i] * scaleVector[i]
  }
  return vector
}