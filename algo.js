// distance methods
const euclideanDistance = require('./distanceMethods/euclidean.js')
const manhattenDistance = require('./distanceMethods/euclidean.js')
const cosineSimilarity = require('./distanceMethods/cosineSimilarity.js')
const dimensionalityInvariateSimilarity = require('./distanceMethods/dimensionalityInvariateSimilarity.js')
const weightedEuclideanDistance = require('./distanceMethods/weightedEuclidean.js')

// helper functions
const calculateColumnStandardDeviation = require('./helperFunctions/columnStandardDeviation')
const minMaxScaleColumns = require('./helperFunctions/minMaxScaleColumns')
const highestVote = require('./helperFunctions/highestVote')
const argsort = require('./helperFunctions/argSort')
const sumFeatures = require('./helperFunctions/sumFeatures')

const harness = require('./harness.js')


class KNNClassifier {
  constructor(kValue, distanceMethod, columnWeights) {
    this.kValue = kValue
    this.distanceMethod = distanceMethod
    this.dataPoints
    this.classes
    this.columnWeights = columnWeights
    this.columnTotals
    this.rowTotals
  } 

  fit(trainData, trainLabels) {
    this.dataPoints = trainData
    this.classes = trainLabels
    this.dataPointsRelative
  }

  predict(testData) {
    let targets = []
    // normalisation step.
    let trainingFeatureSums = sumFeatures(this.dataPoints)
    let testingFeatureSums = sumFeatures(testData)
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
  {
    name: 'cosine similarity',
    method: cosineSimilarity,
    bestK: 0,
    bestScore: 0
  },
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
  {
    name: 'dimensionality invariant similarity',
    method: dimensionalityInvariateSimilarity,
    bestK: 0,
    bestScore: 0
  },
]

weights = [2, 1, 5, 3, 9, 3, 4, 2]


console.log(weights)

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
          distanceMeasures[m].bestK = j
          distanceMeasures[m].bestScore = result
      }
    }
  }
}

console.log(distanceMeasures)

