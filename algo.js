const harness = require('./harness.js')

function euclideanDistance(trainingVector, testingVector) {
  let sum = 0
  // loop over the components of each vector, subtracting one from 
  for(i = 0; i < testingVector.length; i++) {
    sum += subVec(trainingVector[i], testingVector[i]) * subVec(trainingVector[i], testingVector[i])
  }
  sum = Math.sqrt(sum)
  return sum
}

function weightedEuclideanDistance(trainingVector, testingVector, standardDiviationsArray) {
  let sum = 0
  // loop over the components of each vector, subtracting one from 
  for(i = 0; i < testingVector.length; i++) {
    
    sum += (1/Math.pow(standardDiviationsArray[i]),2) * Math.pow(subVec(trainingVector[i], testingVector[i]), 2)
  }
  sum = Math.sqrt(sum)
  return sum
}

function manhattenDistance(trainingVector, testingVector) {
  let sum = 0
  // loop over the components of each vector, subtracting one from 
  for(i = 0; i < testingVector.length; i++) {
    sum += Math.abs(subVec(trainingVector[i], testingVector[i]))
  }
  return sum
}

function dotProduct(vec1, vec2) {
  let product = 0
  for (i = 0; i < vec1.length; i++) {
    product += vec1[i] * vec2[i]
  }
  return product
}

function vectorMagnitude(vector) {
  let mag = 0
  for (let i = 0; i < vector.length; i++) {
    mag += Math.pow(vector[i], 2)
  }
  return mag
}

function cosineSimilarity(trainingVector, testingVector) {
  let dotPro = dotProduct(trainingVector, testingVector)
  let magA = vectorMagnitude(trainingVector)
  let magB = vectorMagnitude(testingVector)
  return Math.acos(dotPro / (magA * magB))
}

function dimensionalityInvariateSimilarity(trainingVector, testingVector) {
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

function subVec(componentOne, componentTwo) {
  return componentOne - componentTwo
  // return (componentOne - componentTwo) * (componentOne - componentTwo)
}

function chiSquareDist(a, b, featureSum, vectorSum) {
  let sum = 0
  for (i = 0; i < a.length; i++) {
    const numerator = Math.pow(a[i] - b[i], 2)
    const denominator = Math.pow(a[i] + b[i], 2)
    const div = numerator / denominator
    sum += div
  }
  return sum / 2
}

class KNNClassifier {
  constructor(kValue, distanceMethod, missingZeros = false) {
    this.kValue = kValue
    this.distanceMethod = distanceMethod
    this.dataPoints
    this.classes
    this.missingZeros = missingZeros
  } 

  fit(trainData, trainLabels) {
    this.dataPoints = trainData
    this.classes = trainLabels
  }

  predict(testData) {
    let targets = []
    // normalisation step.
    // console.log(testData[0])
    // testData = populateZeroValues(testData)
    // this.dataPoints = populateZeroValues(this.dataPoints)
    let standardDeviations = calculateColumnStandardDeviation(this.dataPoints)
    // console.log(testData[0])
    this.dataPoints = minMaxScaleColumns(this.dataPoints)
    testData = minMaxScaleColumns(testData)
    testData.forEach((testingVector, testingIndex) => {
      let distances = []
      let trainingIndexes = []
      // get sums
      this.dataPoints.forEach((trainingVector, trainingIndex) => {
        distances.push(this.distanceMethod(
          trainingVector,
          testingVector, 
          standardDeviations
        ))
        trainingIndexes.push(trainingIndex)
      })
      let sortedIndexes = argsort(distances)
      let kIndexes = []
      for (i = 0; i < this.kValue; i++) {
        kIndexes.push(trainingIndexes[sortedIndexes[i]])
      }
      // get labels form indexes
      let trainingLabelsFromIndex = []
      for (let i = 0; i < kIndexes.length; i++) {
        trainingLabelsFromIndex.push(this.classes[kIndexes[i]])
      }
      // const modeOnTrainingLabels = mode(trainingLabelsFromIndex)
      const modeOnTrainingLabels = highestVote(trainingLabelsFromIndex)
      targets.push(modeOnTrainingLabels)
    })
    return targets
  }
}

function populateZeroValues(data, ) {
  let columnTotals = []
  let columnMeans = []
  let noZeroLengths = []
  // let columnRootMeanSquaredDeviations = []
  // let columnStandardDeviations = []
  // set up column totals array
  for (let i = 0; i < data[0].length; i++) {
    columnTotals.push(0)
  }

  for (let i = 0; i < data[0].length; i++) {
    noZeroLengths.push(0)
  }
  // set up root mean squared devations
  // for (let i = 0; i < trainingData[0].length; i++) {
  //   columnRootMeanSquaredDeviations.push(0)
  // }
  // calculate column totals for each column.
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] !== 0) {
        columnTotals[j] = columnTotals[j] + data[i][j]
        noZeroLengths[j] += 1 
      }
    }
  }

  // calculate the means
  for (let i = 0; i < columnTotals.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      columnMeans[i] = columnTotals[i] / noZeroLengths[j]
    }
  }

  // apply mean to zero values
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if(data[i][j] === 0) {
        data[i][j] = columnMeans[j]
      }
    }
  }
  return data
}

function minMaxScaleColumns(data) {
  let columnMaximumArray = []
  let columnMinimumArray = []
  // set up column maximum array
  for (let i = 0; i < data[0].length; i++) {
    columnMaximumArray.push(0)
  }
  // calculate column maximum
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      columnMaximumArray[j] = Math.max(columnMaximumArray[j], data[i][j])
    }
  }
  // get column minimum
  for (let i = 0; i < data[0].length; i++) {
    columnMinimumArray.push(0)
  }
  // calculate column minimum
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      columnMinimumArray[j] = Math.min(columnMinimumArray[j], data[i][j])
    }
  }

  // apply scaling to data
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      data[i][j] = ( data[i][j] - columnMinimumArray[j] ) / (columnMaximumArray[j] - columnMinimumArray[j])
    }
  }

  return data
}

// scale vector components.
function scaleVectorComponents(vector, scaleFactor) {
  for (i = 0; i < vector.length; i++) {
    vector[i] * scaleFactor
  }
  return vector
}

function mode(numbers) {
  // as result can be bimodal or multi-modal,
  // the returned result is provided as an array
  // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
  var modes = [], count = [], i, number, maxIndex = 0;

  for (i = 0; i < numbers.length; i += 1) {
      number = numbers[i];
      count[number] = (count[number] || 0) + 1;
      if (count[number] > maxIndex) {
          maxIndex = count[number];
      }
  }

  for (i in count)
      if (count.hasOwnProperty(i)) {
          if (count[i] === maxIndex) {
              modes.push(Number(i));
          }
      }
  // handle multi-modal data, by randomly selecting one of the modes
  if (modes.length > 1) {
    modes = [modes[Math.floor(Math.random() *  modes.length)]]
  }
  return modes;
}

function calculateColumnStandardDeviation(trainingData) {
  let columnTotals = []
  let columnMeans = []
  let columnRootMeanSquaredDeviations = []
  let columnStandardDeviations = []
  // set up column totals array
  for (let i = 0; i < trainingData[0].length; i++) {
    columnTotals.push(0)
  }
  // set up root mean squared devations
  for (let i = 0; i < trainingData[0].length; i++) {
    columnRootMeanSquaredDeviations.push(0)
  }
  // calculate column totals for each column.
  for (let i = 0; i < trainingData.length; i++) {
    for (let j = 0; j < trainingData[i].length; j++) {
      columnTotals[j] = columnTotals[j] + trainingData[i][j] 
    }
  }

  // calculate the means
  for (let i = 0; i < columnTotals.length; i++) {
    columnMeans[i] = columnTotals[i] / trainingData.length
  }
  // console.log(columnMeans)
  // work out root mean squared deviation
  for (let i = 0; i < trainingData.length; i++) {
    for (let j = 0; j < trainingData[i].length; j++) {
      columnRootMeanSquaredDeviations[j] += Math.pow(trainingData[i][j] - columnMeans[j], 2)
    }
  }

  // get standard deviations
  for (let i = 0; i < columnRootMeanSquaredDeviations.length; i++) {
    columnStandardDeviations[i] = Math.sqrt(columnRootMeanSquaredDeviations[i] / (trainingData.length - 1))
  }

  return columnStandardDeviations
}

function highestVote(numbers) {
  let yesCount = 0
  let noCount = 0
  for (i = 0; i < numbers.length; i++) {
    if (numbers[i] === 1) {
      yesCount++
    } else {
      noCount++
    }
  }

  if (yesCount > noCount) {
    return [1]
  } else {
    return [0]
  }
}

// function argsort(d) {
//   let ind = []
//   let tmp
//   for (i = 0; i < d.length; i++) {
//     ind[i] = i
//   }
//   for (i = 0; i < d.length; i++) {
//     for (j = 0; j < d.length; j++) {
//       if (d[j] > d[i]) {
//         tmp = d[j];
//         d[j] = d[i];
//         d[i] = tmp;
//         tmp = ind[j];
//         ind[j] = ind[i];
//         ind[i] = tmp;
//       }
//     }
//   }
//   return ind;
// }

function argsort(d) {
  let ind = []
  let tmp
  for (i = 0; i < d.length; i++) {
    ind[i] = i
  }
  for (i = 0; i < d.length; i++) {
    for (j = 0; j < d.length-1; j++) {
      if (d[j] > d[j+1]) {
        tmp = d[j];
        d[j] = d[j+1];
        d[j+1] = tmp;
        tmp = ind[j];
        ind[j] = ind[j+1];
        ind[j+1] = tmp;
      }
    }
  }
  return ind;
}

let distanceMeasures = [
  {
    name: 'euclidean Distance', 
    method: euclideanDistance,
    bestK: 0,
    bestScore: 0
  },
  {
    name: 'weighted euclidean distance',
    method: weightedEuclideanDistance,
    bestK: 0,
    bestScore: 0
  },
  // {
  //   name: 'cosine similarity',
  //   method: cosineSimilarity
  // },
  // {
  //   name: 'chi square distance',
  //   method: chiSquareDist
  // },
  {
    name: 'manhatten distance',
    method: manhattenDistance,
    bestK: 0,
    bestScore: 0
  },
  // {
  //   name: 'dimensionality invariant similarity',
  //   method: dimensionalityInvariateSimilarity,
  //   bestK: 0,
  //   bestScore: 0
  // },
]

let bestK
let bestScore = 0
let bestDistanceMeasure
let bestScaleFactor = 0
// loop for 10 trials.
for (let o = 0; o < 5; o++) {
  // loop over distance measures
  for (let m = 0; m < distanceMeasures.length; m++) {
    // lopp over k values
    for (let j = 1; j < 15; j++) {
      // loop over scale factor values
      // for (let l = 1; l < 10; l++) {
        // const kNN = new KNNClassifier(j, distanceMeasures[m].method, l)
        const kNN = new KNNClassifier(j, distanceMeasures[m].method)
        const result = harness.evaluator('./data/diabetes.csv', kNN).f1
        if (result > distanceMeasures[m].bestScore) {
        // if (result > bestScore) {
          distanceMeasures[m].bestK = j
          distanceMeasures[m].bestScore = result
          // bestK = j
          // bestScore = result
          // bestDistanceMeasure = distanceMeasures[m].name
          // bestScaleFactor = 'none'
        }
      // }
    }
  }
}
// console.log('best score: ', bestScore, '\nbest k value: ', bestK, '\nbest distance method: ', bestDistanceMeasure, '\nbest scale factor: ', bestScaleFactor)
console.log(distanceMeasures)

