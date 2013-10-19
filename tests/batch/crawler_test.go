package batch

import (
  "github.com/otiai10/anisoon/app/batch"
  "testing"
)

func TestTest(t *testing.T) {
  expected := 200
  state := batch.SyobocalAPIStatus()
  if state != expected {
    t.Error("Expected '%v', Actual '%v'", expected, state)
  }
}
