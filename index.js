
// extract data from training set.
var fs = require('fs')
var nj = require('numjs')
const csvFilePath = './data/diabetes.csv'
// const baselineData = require('./data/diabetes.csv')
const dataToClassify = './data/classifyData.csv'
const csv = require('csvtojson')
const minHeap = require('./minHeap')
const papaParse = require('papaparse')
// const mathJS = require('mathjs')
let trainingData
let trainingFeatureVector = []
let trainingDataWithResult = []
let classifyVector = []
let distances = []
let k = 3


function readCSV(filePath) {
  return new Promise( (resolve,reject) => {
    fs.readFile(filePath,'utf-8',(err, data) => {
      if (err) {
        reject(err); // in the case of error, control flow goes to the catch block with the error occured.
      }
      else{
        resolve(data);  // in the case of success, control flow goes to the then block with the content of the file.
      }
    });
  })
  .then((data) => {
    return data
  })
  .catch((err) => {
    throw err; //  handle error here.
  })
}

function parseCSV(CSV) {
  return papaParse.parse(CSV, { delimiter: ',' }).data
}

function split(baselineData) {
  const trainingLength = Math.round((baselineData.length/100)*70)
  let trainingData = []
  let trainingLabels = []
  let testingLabels = []
  // make training set, by pulling random indexs from the baselineData.
  // this would leave random data left in the test data.
  for (i = 0; i < trainingLength; i++) {
    trainingData.push(baselineData.splice(Math.round(Math.random()*10), 1)[0])
  }
  // get training labels by removing from traning data.
  for (i = 0; i < trainingData.length; i++) {
    trainingLabels.push(trainingData[i].splice(8, 1)[0])
  }
  // get testing labels by removing from testing data.
  for (i = 0; i < baselineData.length; i++) {
    testingLabels.push(baselineData[i].splice(8, 1)[0])
  }
  return {
    trainingData,
    testingData: baselineData,
    trainingLabels,
    testingLabels
  }
}

async function kNN() {
  // read baseline csv 
  baselineData = await readCSV('./data/diabetes.csv')
  // format CSV to JSON
  baselineData = parseCSV(baselineData)
  // remove the headings
  baselineData.splice(0, 1)
  let { trainingData, testingData, testingLabels, trainingLabels } = split(baselineData)
  let distances = []
  let indexes = []
  // calculate distances and record index the distance has in each feature vector.
  trainingData.forEach((trainingVector, trainingIndex) => {
    testingData.forEach((testingVector, testingIndex) => {
      distances.push(euclideanDistance(trainingVector, testingVector))
      indexes.push({ trainingIndex: trainingIndex, testingIndex: testingIndex})
    })
  })
  // console.log(argsort(distances))
  // disters = [0.2, 0.1, 0.7, 0.3, 0.4, 0.6];
  // distances
  // console.log(distances)
  console.log(argsort(distances));
  let sortedIndexes = argsort(distances)
  for (i = 0; i < 3; i++) {
    console.log(indexes[sortedIndexes[i]])
  }
}

kNN()

function euclideanDistance(trainingVector, testingVector) {
  // let incremtorLength = trainingVector.length > testingVector.length ? testingVector.length : trainingVector.length
  // console.log(vecOne, vecTwo)
  // console.log(trainingVector)
  // console.log(testingVector)
  let sum = 0
  // loop over the components of each vector, subtracting one from 
  for(i = 0; i < testingVector.length; i++) {
    // console.log(subVec(trainingVector[i], trainingVector[i]))
    sum += subVec(trainingVector[i], testingVector[i]) ^ 2
  }
  sum = Math.sqrt(sum)
  // console.log(sum)
  return sum
}

// var data = papaParse.parse(baselineData, {
//   delimiter: ','
// })
// console.log(data)
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

  // console.log(mode(neighboursResultArray))
})


// need to make a feature vector for each observation.
// trainingData.forEach()

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