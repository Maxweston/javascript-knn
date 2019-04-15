module.exports = function chiSquareDist(a, b, featureSum, vectorSum) {
  let sum = 0
  for (i = 0; i < a.length; i++) {
    const numerator = Math.pow(a[i] - b[i], 2)
    const denominator = Math.pow(a[i] + b[i], 2)
    const div = numerator / denominator
    sum += div
  }
  return sum / 2
}