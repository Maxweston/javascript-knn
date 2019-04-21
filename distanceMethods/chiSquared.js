module.exports = function chiSquareDist(a, b, sd, aColSum, bColSum) {
  let sum = 0
  let vectorASum
  // sum vector a components
  for (i = 0; i < a.length; i++) {
    vectorASum += a[i]
  }
  // Vector B sum
  for (i = 0; i < b.length; i++) {
    vectorBSum += b[i]
  }

  for (i = 0; )

  // for (i = 0; i < a.length; i++) {
  //   const numerator = Math.pow(a[i] - b[i], 2)
  //   const denominator = Math.pow(a[i] + b[i], 2)
  //   const div = numerator / denominator
  //   sum += div
  // }
  return sum / 2
}