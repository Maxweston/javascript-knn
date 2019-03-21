distances = [0.2, 0.1, 0.7, 0.3, 0.4, 0.6];

function argsort(d) {
  for i = 0; i < d.length; i++) {
    ind[i] = i
  }
  for (i = 0; i < d.length; i++) {
    for (j = 0; j < d.length; j++) {
      if (d[j] > d[i]) {
        tmp = d[j];
        d[j] = d[i];
        d[i] = tmp;
        tmp = ind[j];
        ind[j] = ind[i];
        ind[i] = tmp;
      }
    }
  }
  return ind;
}

console.log(argsort(distances));