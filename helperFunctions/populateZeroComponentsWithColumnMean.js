module.exports = function populateZeroValues(data) {
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