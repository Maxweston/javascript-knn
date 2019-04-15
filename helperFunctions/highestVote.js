module.exports = function highestVote(numbers) {
  let yesCount = 0
  let noCount = 0
  for (i = 0; i < numbers.length; i++) {
    if (numbers[i] === 1) {
      yesCount++
    } else {
      noCount++
    }
  }

  if (yesCount > noCount) {
    return [1]
  } else {
    return [0]
  }
}