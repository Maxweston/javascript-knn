module.exports = function minMaxScaleColumns(data) {
  let columnMaximumArray = []
  let columnMinimumArray = []
  // set up column maximum array
  for (let i = 0; i < data[0].length; i++) {
    columnMaximumArray.push(0)
  }
  // calculate column maximum
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      columnMaximumArray[j] = Math.max(columnMaximumArray[j], data[i][j])
    }
  }
  // get column minimum
  for (let i = 0; i < data[0].length; i++) {
    columnMinimumArray.push(0)
  }
  // calculate column minimum
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      columnMinimumArray[j] = Math.min(columnMinimumArray[j], data[i][j])
    }
  }

  // apply scaling to data
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      data[i][j] = ( data[i][j] - columnMinimumArray[j] ) / (columnMaximumArray[j] - columnMinimumArray[j])
    }
  }

  return data
}