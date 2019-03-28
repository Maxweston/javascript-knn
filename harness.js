var fs = require('fs')
const papaParse = require('papaparse')

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

async function evaluator(csvPath, algo) {
  // read data from csv
  let baseData = await readCSV(csvPath)
  // parse csv to JSON
  baseData = parseCSV(baseData)
  // remove the headings
  baseData.splice(0, 1)
  let { trainingData, testingData, testingLabels, trainingLabels } = split(baseData)

  algo.fit(trainingData, trainingLabels)

  const predictions = algo.predict(testingData)

  return evaluate(predictions, testingLabels)
}

function evaluate(predictions, labels) {
  // console.log("predictions", predictions)
  // console.log("labels", labels)
  console.log('in evaluate')
}

module.exports = {
  evaluator: evaluator
}