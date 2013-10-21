package anison

import (
  "testing"
  "github.com/otiai10/anisoon/app/models/repository/anison"
  "fmt"
)

func TestFindThisWeek(t *testing.T) {
  res := anison.FindThisWeek()
  fmt.Printf("%v", res)
}
