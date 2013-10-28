package batch

import (
  "anisoon/app/models/api"
)

func SyobocalAPIStatus() int {
  resp := syobocalAPI.Health()
  return resp.StatusCode
}
