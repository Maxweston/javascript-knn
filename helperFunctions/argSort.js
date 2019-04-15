module.exports = function argsort(d) {
  let ind = []
  let tmp
  for (i = 0; i < d.length; i++) {
    ind[i] = i
  }
  for (i = 0; i < d.length; i++) {
    for (j = 0; j < d.length-1; j++) {
      if (d[j] > d[j+1]) {
        tmp = d[j];
        d[j] = d[j+1];
        d[j+1] = tmp;
        tmp = ind[j];
        ind[j] = ind[j+1];
        ind[j+1] = tmp;
      }
    }
  }
  return ind;
}