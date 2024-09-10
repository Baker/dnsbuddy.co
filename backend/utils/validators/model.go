package validators

import (
	"encoding/json"
	"fmt"
	"strings"
)

func IsValid[T ~string](value T, validMap map[T]bool) bool {
	return validMap[T(strings.ToUpper(string(value)))]
}

func UnmarshalJSON[T ~string](data []byte, target *T, validMap map[T]bool, typeName string) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	*target = T(strings.ToUpper(s))
	if !IsValid(*target, validMap) {
		return fmt.Errorf("invalid %s: %s", typeName, s)
	}
	return nil
}
