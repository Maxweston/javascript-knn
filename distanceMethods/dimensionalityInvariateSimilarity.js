module.exports = function dimensionalityInvariateSimilarity(trainingVector, testingVector) {
  // work out min value between the two
  let dist = 0
  for (i = 0; i < trainingVector.length; i++) {
    const min = Math.min(trainingVector[i], testingVector[i])
    const max = Math.max(trainingVector[i], testingVector[i])
    if (min >= 0) {
      sim = 1 - ((1 + min) / (1 + max))
    } else {
      sim = 1 - ((1 + min + Math.abs(min)) / (1 + max + Math.abs(min)))
    }
    dist += sim
  }
  return dist
}