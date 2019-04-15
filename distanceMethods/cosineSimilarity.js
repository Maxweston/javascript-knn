const vectorMagnitude = require('../helperFunctions/vectorMagnitude')
const dotProduct = require('../helperFunctions/dotProduct')
module.exports = function cosineSimilarity(trainingVector, testingVector) {
  let dotPro = dotProduct(trainingVector, testingVector)
  let magA = vectorMagnitude(trainingVector)
  let magB = vectorMagnitude(testingVector)
  return Math.acos(dotPro / (magA * magB))
}