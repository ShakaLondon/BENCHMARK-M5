import express from "express";

import fs from "fs";
// USE FS TO DELETE THE FILE OR WRITE TO FILE

import path, { dirname } from "path";
import { fileURLToPath } from "url";
// USE TO LOCATE FILE

import uniqid from "uniqid";
// ASIGN ID TO JSON ENTRY

import { userValidationRules, searchValidationRules, validate } from "./validation.js"
// import { validationResult } from "express-validator";
// REVIEW POST VALIDATION CHAIN CHECKS ENTRY TYPE

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// DIRECTORY TO FILE PATH

const reviewFilePath = path.join(__dirname, "reviews.json");
// JOIN URL PATH TO DIRECTORY FILE

const router = express.Router();
// USE EXPRESS ROUTER

// CAPITAL LETTER FOR ROUTER!!


// GET REVIEW ALL REVIEWS
router.get("/", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(reviewFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSON = JSON.parse(fileAsString);
    res.send(fileAsJSON);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// // SEARCH REVIEW POSTS
// router.get("/search", 
// searchValidationRules(),
// validate,
// async (req, res, next) => {
//   try {
//     // const { query } = req.query
//     // query = title =something
//     const searchInput  = req.query.searchQuery
//     // const string = searchQuery.toString()

//     console.log(searchInput)

//     const searchQ = searchInput.replace(/_/g, ' ')

//     console.log(searchQ)

//     const fileAsBuffer = fs.readFileSync(reviewFilePath);
//     const fileAsString = fileAsBuffer.toString();
//     const fileAsJSONArray = JSON.parse(fileAsString);

    
//     const filteredResults = fileAsJSONArray.filter( (review) => 
//         review.title.toLowerCase().includes(searchQ.toLowerCase()) || review.category.toLowerCase().includes(searchQ.toLowerCase()) || review.author.nameAuth.toLowerCase().includes(searchQ.toLowerCase()))

//         console.log(filteredResults)

//     res.send(filteredResults);

//   } catch (error) {
//     res.send(500).send({ message: error.message });
//   }
// });


// CREATE NEW REVIEW
router.post(
  "/", 
  userValidationRules(), 
  validate, 
  async (req, res, next) => {
  try {

    const { comment, rate, elementId } = req.body;
    // ASSIGN ENTRY VALUES TO REQ.BODY

     const reviewInfo = {
      id: uniqid(),
      // ASSIGN UNIQUE ID TO POST
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      // ASSIGN DATES TO POST
    };

    const fileAsBuffer = fs.readFileSync(reviewFilePath);
    //  READ JSON FILE

    const fileAsString = fileAsBuffer.toString();
    // CHANGE JSON TO STRING

    const fileAsJSONArray = JSON.parse(fileAsString);
    // CREATE ARRAY FROM ENTRIES

    fileAsJSONArray.push(reviewInfo);
    // PUSH NEW ENTRY TO ARRAY

    fs.writeFileSync(reviewFilePath, JSON.stringify(fileAsJSONArray));
    // WRITE ARRAY BACK TO FILE DIRECTORY AS STRING
    
    res.send(reviewInfo);

    
  } catch (error) {
    res.send(500).send( validate );
  }
});

// GET SPECIFIC REVIEW
router.get("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(reviewFilePath);
    
    const fileAsString = fileAsBuffer.toString();
    
    const fileAsJSONArray = JSON.parse(fileAsString);

    const reviewEntry = fileAsJSONArray.find(review => review.id=== req.params.id)
    //  FILTER ARRAY TO FIND ENTRY MATCHING PARAM ID

    if (!reviewEntry){
        res
        .status(404)
        .send({message: `Review with ${req.params.id} is not found!`});
    }
    // IF ENTRY IS NOT FOUND THEN RETURN ERROR

    res.send(reviewEntry)
    
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// DELETE REVIEW POST
router.delete("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(reviewFilePath);
    
    const fileAsString = fileAsBuffer.toString();
    
    let fileAsJSONArray = JSON.parse(fileAsString);
    

    const reviewEnt = fileAsJSONArray.find(review => review.id=== req.params.id);

    if (!reviewEnt){
        res
        .status(404)
        .send({message: `Review with ${req.params.id} is not found!`});
    };

    fileAsJSONArray = fileAsJSONArray.filter((review) => review.id !== req.params.id);
    //  RETURN ALL ENTRIES EXCEPT THE ONE THAT HAS BEEN DELETED

    fs.writeFileSync(reviewFilePath, JSON.stringify(fileAsJSONArray));
    // WRITE NEW ARRAY BACK TO FILE

    res.status(204).send();
    
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// UPDATE REVIEW
router.put("/:id", async (req, res, next) => {
  try {

    const fileAsBuffer = fs.readFileSync(reviewFilePath);
    
    const fileAsString = fileAsBuffer.toString();
    
    let fileAsJSONArray = JSON.parse(fileAsString);
    

    const reviewIndex = fileAsJSONArray.findIndex(review => review.id=== req.params.id);

    if (!reviewIndex == -1){
// IF REVIEW INDEX IS NOT FOUND
        res
        .status(404)
        .send({message: `Review with ${req.params.id} is not found!`});

    };

    const previousReviewData = fileAsJSONArray[reviewIndex] 
    // PREVIOUS DATA FOR SPECIFIC ID

    const changedReviews= { ...previousReviewData, ...req.body, updatedAt: new Date(), id: req.params.id}
// NEW DATA OLD DATA NEW TIME AND SAME ID FROM PARAM

    fileAsJSONArray[reviewIndex] = changedReviews
    // REPLACE INDEX WITH NEW DATA

    fs.writeFileSync(reviewFilePath, JSON.stringify(fileAsJSONArray));
    // WRITE BACK TO JSON FILE

    res.send(changedReviews);
    
  } catch (error) {

    res.send(500).send({ message: error.message });

  }
});

export default router;
