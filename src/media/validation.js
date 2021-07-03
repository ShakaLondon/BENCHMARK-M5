// import { checkSchema, validationResult } from "express-validator"


import { body, validationResult } from 'express-validator'


export const userValidationRules = () => {


  return [
//  CHECKS BODY REQUEST TO SEE IF IT FITS THE CORRECT STRUCTURE

  body("Title").exists().withMessage("Title is a mandatory field!"),
  body("Year").exists().withMessage("Year is a mandatory field!"),
  body("Type").exists().withMessage("Type is a mandatory field!"),
  body("Poster").exists().withMessage("Poster value is a mandatory field"),
  
  ]
}

// export const searchValidationRules = () => {

//   return [
//   //  CHECKS BODY REQUEST TO SEE IF IT FITS THE CORRECT STRUCTURE
  
//   query("searchQuery").exists().withMessage("There is nothing to search!"),
  
//   ]
//   }

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
