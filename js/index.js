const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');

const myFlixDB = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(bodyParser.json());

// // Top 10
// let movies = [
//   {
//     title: 'The Shining',
//     director: 'Stanley Kubrick'
//   },
//   {
//     title: 'The Others',
//     director: 'Alejandro Amenabar'
//   },
//   {
//     title: 'Shaun of the Dead',
//     director: 'Edgar Wright'
//   },
//   {
//     title: 'The Exorcist',
//     director: 'William Friedkin'
//   },
//   {
//     title: 'The Mist',
//     director: 'Frank Darabont'
//   },
//   {
//     title: 'Let the Right One In',
//     director: 'Tomas Alfredson'
//   },
//   {
//     title: 'Sweeney Todd: The Demon Barber of Fleet Street',
//     director: 'Tim Burton'
//   },
//   {
//     title: 'The Birds',
//     director: 'Alfred Hitchcock'
//   },
//   {
//     title: 'Alien',
//     director: 'Ridley Scott'
//   },
//   {
//     title: 'The Omen',
//     director: 'Richard Donner'
//   },
//   {
//     title: 'Hannibal',
//     director: 'Ridley Scott'
//   }
// ];

// Homepage
app.get('/', (req, res) => {
  res.send('Welcome to MyFlix!');
});

app.get('/documentation', (req, res) => {
  res.sendfile('/public/documentation.html', {root: __dirname})
});

// Return list of all movies
app.get('/movies', (req, res) => {
  myFlixDB.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return list of all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about single movie title
app.get('/movies/:Title', (req, res) => {
  myFlixDB.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// // Return data about genre
// app.get('/genre/:Name', (reg, res) => {
//   Genres.findOne({ Name: req.params.Name })
//     .then((genre) => {
//       res.json(genre.Description);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// });
//
// // Return data about director
// app.get('/director/:Name', (req, res) => {
//   Directors.findOne({ Name: req.params.Name })
//     .then((director) => {
//       res.json(director);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// });

// Allow new user to register
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create ({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {
            res.status(201).json(user)
          })
          .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
       }
     })
     .catch((error) => {
       console.error(error);
       res.status(500).send('Error: ' + error);
     });
 });

// Allow user to update username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
   },
   { new: true }, // This line makes sure that the updated document is returned
   (err, updatedUser) => {
     if(err) {
       console.error(err);
       res.status(500).send('Error: ' + err);
     } else {
       res.json(updatedUser);
     }
   });
});

// Allow user to add movie to favorites
app.post('/users/:Username/movies/:Title', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.title }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Allow user to delete movie from favorites
app.delete('/users/:Username/movies/:Title', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.title }
  },
  { new: true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
      }
    });
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.Status(500).send('Error: ' + err);
    });
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.listen(8080, () => {
  console.log('App is listening on port 8080.');
});
