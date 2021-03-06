// import { checkSchema, validationResult } from "express-validator"


import { body, param, query, validationResult } from 'express-validator'


export const userValidationRules = () => {
  return [
//  CHECKS BODY REQUEST TO SEE IF IT FITS THE CORRECT STRUCTURE

  body("comment").exists().withMessage("Comment is a mandatory field!"),
  body("rate").exists().withMessage("Rate is a mandatory field!").isInt().withMessage("Rating should be an integer!"),
  body("elementId").exists().withMessage("Element ID is a mandatory field")

  ]
}

export const searchValidationRules = () => {

  return [
  //  CHECKS BODY REQUEST TO SEE IF IT FITS THE CORRECT STRUCTURE
  
  query("searchQuery").exists().withMessage("There is nothing to search!"),
  
  ]
  }

export const validate = (req, res, next) => {
    // ASSIGN VARIABLE TO VALIDATION RESULT OF REQUEST 
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

//   IF ERRORS ARRAY IS NOT EMPTY PUSH ARRAY OF ERRORS TO VARIABLE
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  // RETURN ERRORS
  return res.status(422).json({
    errors: extractedErrors,
  })
}
