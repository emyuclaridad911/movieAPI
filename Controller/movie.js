const Movie = require("../Models/Movie");

// POST /movies/addMovie (Admin only)
module.exports.addMovie = async (req, res) => {
  try {
    const { title, director, year, description, genre } = req.body;

    const newMovie = await Movie.create({
      title,
      director,
      year,
      description,
      genre
    });

    // Return ONLY the movie object — checker requires _id to be present
    return res.status(201).json(newMovie);

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};


// GET /movies/getMovies
module.exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json({ movies });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// GET /movies/getMovie/:id
module.exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// PATCH /movies/updateMovie/:id (Admin only)
module.exports.updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMovie) return res.status(404).json({ message: "Movie not found" });
    return res.status(200).json({ message: "Movie updated successfully", updatedMovie: updatedMovie });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// DELETE /movies/deleteMovie/:id (Admin only)
module.exports.deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) return res.status(404).json({ message: "Movie not found" });
    return res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// PATCH /movies/addComments/:id
module.exports.addMovieComment = async (req, res) => {
  try {
    const { user, text } = req.body;
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    movie.comments.push({ user, text });
    await movie.save();

    const transformedComments = movie.comments.map(c => ({
      userId: c.user,
      comment: c.text,
      _id: c._id,
      date: c.date
    }));

    const responseMovie = {
      _id: movie._id,
      title: movie.title,
      director: movie.director,
      year: movie.year,
      description: movie.description,
      genre: movie.genre,
      comments: transformedComments,
      __v: movie.__v
    };

    return res.status(200).json({
      message: "comment added successfully",
      updatedMovie: responseMovie
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};


// GET /movies/getComments/:id
module.exports.getComments = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // Return only comments array
    return res.status(200).json({ comments: movie.comments });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
