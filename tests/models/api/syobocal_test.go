package syobocalAPI

import (
  "github.com/otiai10/anisoon/app/models/api"
  "testing"
  "fmt"
)

func TestFindThisWeek(t *testing.T) {
  toriaezu_bool := syobocalAPI.FindThisWeek()  
  fmt.Printf("%v",toriaezu_bool)
}
