import express from "express";

import fs from "fs";
// USE FS TO DELETE THE FILE

import path, { dirname } from "path";
import { fileURLToPath } from "url";
// USE TO LOCATE FILE

import { userValidationRules, validate } from "./validation.js"
// IMPORT VALIDATION MIDDLEWARES


import uniqid from "uniqid";

// ASIGN ID TO JSON ENTRY

// GET ALL MEDIA

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// DIRECT TO FILE PATH

const mediaFilePath = path.join(__dirname, "media.json");
const blogsFilePath = path.join(__dirname, "reviews.json");

const router = express.Router();

// CAPITAL LETTER FOR ROUTER!!



router.get("/", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSON = JSON.parse(fileAsString);
    res.send(fileAsJSON);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// CREATE MEDIA

router.post("/",
userValidationRules(), 
  validate, 
   async (req, res, next) => {
  try {
    const { Title, Year, imdbID, Type, Poster } = req.body;

    const media = {
      id: uniqid(),
      Title,
      Year,
      imdbID,
      Type,
      Poster,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fileAsBuffer = fs.readFileSync(mediaFilePath);

    const fileAsString = fileAsBuffer.toString();

    const fileAsJSONArray = JSON.parse(fileAsString);

    const emailDuplicate = fileAsJSONArray.findIndex( (media) => media.email == req.body.email )



    if (emailDuplicate != -1) {

      req.body.emailCheck = true

      const feedBack = {...req.body}
      

        res
        .status(404)
        .send({message: `Media with ${req.body.email} already exists!`}
        );

    } else {

        fileAsJSONArray.push(media);

        fs.writeFileSync(mediaFilePath, JSON.stringify(fileAsJSONArray));
    
        res.send(media);

    };

    // to delete entry
    
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// GET ONE MEDIA

router.get("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    // read json file
    const fileAsString = fileAsBuffer.toString();
    // convert JSON to string
    const fileAsJSONArray = JSON.parse(fileAsString);
    // read as an array

    const media = fileAsJSONArray.find(media => media.id=== req.params.id)

    if (!media){
        res
        .status(404)
        .send({message: `Media with ${req.params.id} is not found!`});
    }

    res.send(media)
    
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// // SEARCH BLOG POSTS
// router.get("/:id/reviews/:imdbID", 
// async (req, res, next) => {
//   try {

//     const fileAsBuffer = fs.readFileSync(mediaFilePath);
//     // read json file
//     const fileAsString = fileAsBuffer.toString();
//     // convert JSON to string
//     const fileAsJSONArray = JSON.parse(fileAsString);
//     // read as an array

//     const media = fileAsJSONArray.find(media => media.id=== req.params.id)

//     if (!media){
//         res
//         .status(404)
//         .send({message: `Media with ${req.params.id} is not found!`});
//     }

//     // res.send(media)



//     const blogfileAsBuffer = fs.readFileSync(blogsFilePath);
    
//     const blogfileAsString = blogfileAsBuffer.toString();
    
//     const blogfileAsJSONArray = JSON.parse(blogfileAsString);

//     const matchingBlogEntry = blogfileAsJSONArray.filter(blog => blog.media.authID === req.params.id)
//     //  FILTER ARRAY TO FIND ENTRY MATCHING PARAM ID

//     if (!matchingBlogEntry){
//         res
//         .status(404)
//         .send({message: `Media with ${req.params.id} is not found!`});
//     }

//     res.send(media, matchingBlogEntry);

//   } catch (error) {
//     res.send(500).send({ message: error.message });
//   }
// });

// DELETE MEDIA

router.delete("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    // read json file
    const fileAsString = fileAsBuffer.toString();
    // convert JSON to string
    let fileAsJSONArray = JSON.parse(fileAsString);
    // read as an array

    const media = fileAsJSONArray.find(media => media.id=== req.params.id);

    // get result then if error say not found

    if (!media){
        res
        .status(404)
        .send({message: `Media with ${req.params.id} is not found!`});
    };

    // to delete entry

    fileAsJSONArray = fileAsJSONArray.filter((media) => media.id !== req.params.id);
    //  return all entries except the one being deleted

    fs.writeFileSync(mediaFilePath, JSON.stringify(fileAsJSONArray));

    res.status(204).send();
    
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// GET UPDATE MEDIA

router.put("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    // read json file
    const fileAsString = fileAsBuffer.toString();
    // convert JSON to string
    let fileAsJSONArray = JSON.parse(fileAsString);
    // read as an array

    const mediaIndex = fileAsJSONArray.findIndex(media => media.id=== req.params.id);

    // get index of result to replace it

    if (!mediaIndex == -1){
        res
        .status(404)
        .send({message: `Media with ${req.params.id} is not found!`});
    };

    // to delete entry

    const previousMediaData = fileAsJSONArray[mediaIndex]

    const changedMedia = { ...previousMediaData, ...req.body, updatedAt: new Date(), id: req.params.id}

    fileAsJSONArray[mediaIndex] = changedMedia

    fs.writeFileSync(mediaFilePath, JSON.stringify(fileAsJSONArray));

    res.send(changedMedia);
    
  } catch (error) {

    res.send(500).send({ message: error.message });

  }
});

// router.get('/*', (req, res) => {                       
//     res.sendFile(path.resolve(__dirname, '.../client/public/index.html',));                               
//   });

export default router;
