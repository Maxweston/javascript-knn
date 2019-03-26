package main

import (
	"log"
	"math"

	"github.com/fresh8/gomlworkshop"
	"gonum.org/v1/gonum/floats"
	"gonum.org/v1/gonum/mat"
)

func main() {

	log.Println("Evaluating model")

	model := KNNClassifier{
		K:        2,
		Distance: EuclideanDistance,
	}

	result, err := gomlworkshop.Evaluate("diabetes.csv", &model)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Result = %f", result)
}

func EuclideanDistance(a, b mat.Vector) float64 {
	var v mat.VecDense
	v.SubVec(a, b)
	return math.Sqrt(mat.Dot(&v, &v))
}

type KNNClassifier struct {
	K          int
	Weighted   bool
	Distance   func(a, b mat.Vector) float64
	datapoints mat.Matrix
	classes    []string
}

func (k *KNNClassifier) Fit(m mat.Matrix, labels []string) {
	k.datapoints = m
	k.classes = labels
}

func (k *KNNClassifier) Predict(m mat.Matrix) []string {
	r, _ := m.Dims()
	targets := make([]string, r)
	distances := make([]float64, len(k.classes))
	inds := make([]int, len(k.classes))

	for i := 0; i < r; i++ {
		votes := make(map[string]float64)
		for j := 0; j < len(k.classes); j++ {
			distances[j] = k.Distance(k.datapoints.(mat.RowViewer).RowView(j), m.(mat.RowViewer).RowView(i))
		}
		floats.Argsort(distances, inds)
		for n := 0; n < k.K; n++ {
			votes[k.classes[inds[n]]]++
		}
		var winningCount float64
		for k, v := range votes {
			if v > winningCount {
				targets[i] = k
			}
		}
	}
	return targets
}
