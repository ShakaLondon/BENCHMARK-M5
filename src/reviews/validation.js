// import { checkSchema, validationResult } from "express-validator"


import { body, param, query, validationResult } from 'express-validator'


export const userValidationRules = () => {
  return [
//  CHECKS BODY REQUEST TO SEE IF IT FITS THE CORRECT STRUCTURE

  body("category").exists().withMessage("Category is a mandatory field!"),
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("cover").exists().withMessage("Cover is a mandatory field!"),
  body("readTime.value").exists().withMessage("Read value is a mandatory field").isInt().withMessage("Read value should be an integer!"),
  body("readTime.unit").exists().withMessage("Read unit is a mandatory field"),
  body("author.avatar").exists().withMessage("You are not logged in!"),
  body("author.authID").exists().withMessage("You are not logged in!"),
  body("author.nameAuth").exists().withMessage("You are not logged in!"),
  body("content").exists().withMessage("Please add some text to post."),
  body("words").exists().withMessage("Please add some text to post.").isInt({max: 5000}).withMessage("Word value should be an integer!"),
  
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
