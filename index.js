
// extract data from training set.
const csvFilePath = './data/diabetes.csv'
const dataToClassify = './data/classifyData.csv'
const csv = require('csvtojson')
const minHeap = require('./minHeap')
// const mathJS = require('mathjs')
let trainingData
let trainingFeatureVector = []
let trainingDataWithResult = []
let classifyVector = []
let distances = []
let k = 3

// TODO: convert to using papaParse.
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    trainingData = jsonObj
    // console.log(trainingData)
    trainingData.forEach(observation => {
      let observationVector = []
      Object.keys(observation).forEach(componentKey => {
        // if (componentKey !== 'Outcome') {
          observationVector.push(observation[componentKey])
        // }
      })
      trainingFeatureVector.push(observationVector)
    })
    // console.log(trainingFeatureVector)
    
})

csv()
.fromFile(dataToClassify)
.then(jsonObj => {
  classifyData = jsonObj
  classifyData.forEach(observation => {
    let observationVector = []
    Object.keys(observation).forEach(componentKey => {
      observationVector.push(observation[componentKey])
    })
    classifyVector = observationVector
    // console.log(classifyVector)
  })
  // console.log('trainingFeatureVector', trainingFeatureVector)
  trainingFeatureVector.forEach((featureVec, index) => {
    // console.log()
    // console.log('classifyVector', classifyVector)
    var distancefeatureVec = featureVec.slice(0, 8)
    // console.log(distancefeatureVec)
    let distance = euclideanDistance(distancefeatureVec, classifyVector)
    trainingFeatureVector[index].push(distance)
    // console.log(distance)
    distances.push(distance)
  })
  let heap = new minHeap()
  // console.log('distances', distances)
  distances.forEach(value => {
    heap.insert(value)
  })
  // now find distance matches of the top elements in the heap
  var kLengthHeap = heap.data
  kLengthHeap = kLengthHeap.slice(0, k)
  var featureVectorNearest = []
  trainingFeatureVector.forEach((vec, index) => {
    kLengthHeap.forEach(heapEntry => {
      if (vec[9] === heapEntry) {
        featureVectorNearest.push(trainingFeatureVector[index])
      }
    })
  })
  var neighboursResultArray = []
  featureVectorNearest.forEach(vec => {
    neighboursResultArray.push(vec[8])
  })

  console.log(mode(neighboursResultArray))
})


// need to make a feature vector for each observation.
// trainingData.forEach()

function euclideanDistance(vecOne, vecTwo) {
  // console.log(vecOne, vecTwo)
  let sum = 0
  for(i = 0; i < vecOne.length; i++) {
    sum += subVec(vecOne[i], vecTwo[i])
  }
  sum = Math.sqrt(sum)
  // console.log('sum after sqrt', sum)
  return sum
}

function subVec(componentOne, componentTwo) {
  // console.log(componentOne)
  // console.log(componentTwo)
  return (componentOne - componentTwo) * (componentOne - componentTwo)
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

  return modes;
}

// function dot(vecOne, vecTwo) {

// }