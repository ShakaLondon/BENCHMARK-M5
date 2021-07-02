// import { checkSchema, validationResult } from "express-validator"


import { body, validationResult } from 'express-validator'


export const userValidationRules = () => {

     const d = new Date();
     const year = d.getFullYear();
     const month = d.getMonth();
     const day = d.getDate();
     const cA = new Date(year - 18, month, day).toDateString();

  return [
//  CHECKS BODY REQUEST TO SEE IF IT FITS THE CORRECT STRUCTURE

  body("name").exists().withMessage("Name is a mandatory field!"),
  body("surname").exists().withMessage("Surname is a mandatory field!"),
  body("email").exists().withMessage("Email is a mandatory field!").isEmail().withMessage("Email is not a valid email address!"),
  body("dateOfBirth").exists().withMessage("DOB value is a mandatory field").isDate().withMessage("Date invalid").isBefore(cA).withMessage("You need to be older than 18!"),
  
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
