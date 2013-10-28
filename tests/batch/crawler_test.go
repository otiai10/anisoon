package batch

import (
  "anisoon/app/batch"
  "testing"
)

func TestHealth(t *testing.T) {
  statusCode := batch.SyobocalAPIStatus()
  expected := 200
  if statusCode != expected {
    t.Error("Expected '%v', Actual '%v'", expected, statusCode)
  }
}
