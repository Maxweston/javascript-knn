var fs = require('fs')

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

function evaluator(csvPath, fitMethod, predictMethod) {
  // read data from csv
  const baseData = await readCSV(csvPath)
  // parse csv to JSON
  baseData = parseCSV(baselineData)
  // remove the headings
  baselineData.splice(0, 1)
  let { trainingData, testingData, testingLabels, trainingLabels } = split(baselineData)
  
}

module.exports = {
  fit: fit,
  predict: predict,
  evaluator: evalutator
}