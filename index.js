
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

async function kNN(kValue) {
  // read baseline csv 
  baselineData = await readCSV('./data/diabetes.csv')
  // format CSV to JSON
  baselineData = parseCSV(baselineData)
  // remove the headings
  baselineData.splice(0, 1)
  let { trainingData, testingData, testingLabels, trainingLabels } = split(baselineData)
  // need to loop over each testing entry and work out the distance between each training entry.
    // arg sort each distance vector.
    // get k top results.
    // work out mode.
    // compare result with labels
  let truePositiveCount = 0
  let trueNegativeCount = 0
  testingData.forEach((testingVector, testingIndex) => {
    let distances = []
    let trainingIndexes = []
    trainingData.forEach((trainingVector, trainingIndex) => {
      distances.push(euclideanDistance(trainingVector, testingVector))
      trainingIndexes.push(trainingIndex)
    })
    let sortedIndexes = argsort(distances)
    let kIndexes = []
    for (i = 0; i < kValue; i++) {
      // console.log(trainingIndexes[sortedIndexes[i]])
      kIndexes.push(trainingIndexes[sortedIndexes[i]])
    }
    // get labels form indexes
    let trainingLabelsFromIndex = []
    for (let i = 0; i < kIndexes.length; i++) {
      trainingLabelsFromIndex.push(trainingLabels[kIndexes[i]])
    }
    // calculate mode on each set
    const modeOnTrainingLabels = mode(trainingLabelsFromIndex)
    // console.log(modeOnTrainingLabels[0])
    if (modeOnTrainingLabels[0] == 1 && testingLabels[testingIndex] == 1) {
      truePositiveCount += 1
    }

    if (modeOnTrainingLabels[0] == 0 && testingLabels[testingIndex] == 0) {
      trueNegativeCount += 1
    }
  })
  totalCorrectPredictions = truePositiveCount + trueNegativeCount
  console.log('k =', kValue, ':', (totalCorrectPredictions/testingData.length) * 100)
}

for (i = 1; i < 10; i++) {
  kNN(i)
}

function euclideanDistance(trainingVector, testingVector) {
  let sum = 0
  // loop over the components of each vector, subtracting one from 
  for(i = 0; i < testingVector.length; i++) {
    // console.log(subVec(trainingVector[i], trainingVector[i]))
    sum += subVec(trainingVector[i], testingVector[i]) * subVec(trainingVector[i], testingVector[i])
  }
  sum = Math.sqrt(sum)
  // console.log(sum)
  return sum
}

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
