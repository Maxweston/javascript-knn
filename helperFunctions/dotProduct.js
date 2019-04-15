module.exports = function dotProduct(vec1, vec2) {
  let product = 0
  for (i = 0; i < vec1.length; i++) {
    product += vec1[i] * vec2[i]
  }
  return product
}