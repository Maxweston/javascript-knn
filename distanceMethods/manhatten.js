const subVec = require('../helperFunctions/subtractVectors')

module.exports = function manhattenDistance(trainingVector, testingVector) {
  let sum = 0
  // loop over the components of each vector, subtracting one from 
  for(i = 0; i < testingVector.length; i++) {
    sum += Math.abs(subVec(trainingVector[i], testingVector[i]))
  }
  return sum
}