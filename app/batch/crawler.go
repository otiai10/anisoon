package batch

import (
  "github.com/otiai10/anisoon/app/models/api"
)

func SyobocalAPIStatus() int {
  resp := syobocalAPI.Health()
  return resp.StatusCode
}
