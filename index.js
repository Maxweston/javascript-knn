
// extract data from training set.
const csvFilePath = './data/diabetes.csv'
const dataToClassify = './data/classifyData.csv'
const csv = require('csvtojson')
const minHeap = require('./minHeap')
// const mathJS = require('mathjs')
let trainingData
let trainingFeatureVector = []
let classifyVector = []
let distances = []
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    trainingData = jsonObj
    // console.log(trainingData)
    trainingData.forEach(observation => {
      let observationVector = []
      Object.keys(observation).forEach(componentKey => {
        if (componentKey !== 'Outcome') {
          observationVector.push(observation[componentKey])
        }
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
  trainingFeatureVector.forEach(featureVector => {
    // console.log('classifyVector', classifyVector)
    let distance = euclideanDistance(featureVector, classifyVector)
    // console.log(distance)
    distances.push(distance)
  })
  let heap = new minHeap()
  distances.forEach(value => {
    heap.insert(value)
  })
  console.log(heap)
  // console.log(heap.extractMin())
  // let distance = euclideanDistance(trainingFeatureVector, classifyVector)
  // console.log(distance)
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

// function dot(vecOne, vecTwo) {

// }