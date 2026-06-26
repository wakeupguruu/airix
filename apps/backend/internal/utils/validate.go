package utils

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
)

var validate = validator.New()
	

func DecodeAndValidate(w http.ResponseWriter, r *http.Request, dst any) bool {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(dst); err != nil {
		ResponseWithError(w, 400, "invalid request body")
		return false
	}

	//validate field and input using https://github.com/go-playground/validator

	if err := validate.Struct(dst); err != nil{
		ResponseWithError(w,422,"validation failed")
		return false
	}

	return true

}