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

function subVec(componentOne, componentTwo) {
  return (componentOne - componentTwo) * (componentOne - componentTwo)
}

class KNNClassifier {
  constructor(kValue, distanceMethod) {
    this.kValue = kValue
    this.distanceMethod = distanceMethod
    this.dataPoints
    this.classes
  }

  fit(trainData, trainLabels) {
    this.dataPoints = trainData
    this.classes = trainLabels
  }

  predict(testData) {
    let targets = []
    testData.forEach((testingVector, testingIndex) => {
      let distances = []
      let trainingIndexes = []
      this.dataPoints.forEach((trainingVector, trainingIndex) => {
        distances.push(this.distanceMethod(trainingVector, testingVector))
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
      const modeOnTrainingLabels = mode(trainingLabelsFromIndex)
       targets.push(modeOnTrainingLabels)
    })
    return targets
  }
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

function argsort(d) {
  let ind = []
  let tmp
  for (i = 0; i < d.length; i++) {
    ind[i] = i
  }
  for (i = 0; i < d.length; i++) {
    for (j = 0; j < d.length; j++) {
      if (d[j] > d[i]) {
        tmp = d[j];
        d[j] = d[i];
        d[i] = tmp;
        tmp = ind[j];
        ind[j] = ind[i];
        ind[i] = tmp;
      }
    }
  }
  return ind;
}

const kNN = new KNNClassifier(2, euclideanDistance)
const trailAmount = 10

harness.evaluator('./data/diabetes.csv', kNN)

let acc = []
let pre = []
let rec = []
let f1s = []

for (let i = 0; i < trailAmount; i++) {
  const evaluation = harness.evaluator('./data/diabetes.csv', kNN)
  acc.push(evaluation.accuracy)
  pre.push(evaluation.precision)
  rec.push(evaluation.recall)
  f1s.push(evaluation.f1)
}

function arrayMean(array) {
  var sum = 0;
  for( var i = 0; i < array.length; i++ ){
      sum += array[i]//don't forget to add the base
  }
  var avg = sum/array.length;
  return avg
}

console.log(`average accuracy over ${trailAmount} trails: `, arrayMean(acc))
console.log(`average precision over ${trailAmount} trails: `, arrayMean(pre))
console.log(`average recall over ${trailAmount} trails: `, arrayMean(rec))
console.log(`average f1 over ${trailAmount} trails: `, arrayMean(f1s))

