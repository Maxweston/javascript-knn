module.exports = function sumFeatures(data) {
  let featureSumsArray = new Array(data[0].length).fill(0)
  // set inititalise with zeros
  // for (let i = 0; i < data[0].length; i++) {
  //   featureSumsArray.push(0)
  // }

  for (let i = 0; i < data.length; i++) {
    let sum = 0
    for (let i = 0; i < data[i].length; j++) {
      sum += data[i][j]
    }
    featureSumsArray[i] = sum
  }

  return featureSumsArray
}