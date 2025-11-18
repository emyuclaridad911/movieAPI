const express = require("express");
const router = express.Router();
const movieController = require("../Controller/movie");
const { verifyToken, verifyAdmin } = require("../auth");

// Admin only
router.post("/addMovie", verifyAdmin, movieController.addMovie);
router.patch("/updateMovie/:id", verifyAdmin, movieController.updateMovie);
router.delete("/deleteMovie/:id", verifyAdmin, movieController.deleteMovie);

// Public
router.get("/getMovies", movieController.getMovies);
router.get("/getMovie/:id", movieController.getMovie);

// Comments
router.patch("/addComment/:id", verifyToken, movieController.addMovieComment);
router.get("/getComments/:id", movieController.getComments);

module.exports = router;
