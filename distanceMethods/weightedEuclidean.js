const subVec = require('../helperFunctions/subtractVectors')

module.exports = function weightedEuclideanDistance(trainingVector, testingVector, standardDiviationsArray) {
  let sum = 0
  // loop over the components of each vector, subtracting one from 
  for(i = 0; i < testingVector.length; i++) {
    
    sum += (1/Math.pow(standardDiviationsArray[i]),2) * Math.pow(subVec(trainingVector[i], testingVector[i]), 2)
  }
  sum = Math.sqrt(sum)
  return sum
}