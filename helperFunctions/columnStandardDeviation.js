module.exports = function calculateColumnStandardDeviation(trainingData) {
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