const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

// Top 10
let movies = [
  {
    title: 'The Shining',
    director: 'Stanley Kubrick'
  },
  {
    title: 'The Others',
    director: 'Alejandro Amenabar'
  },
  {
    title: 'Shaun of the Dead',
    director: 'Edgar Wright'
  },
  {
    title: 'The Exorcist',
    director: 'William Friedkin'
  },
  {
    title: 'The Mist',
    director: 'Frank Darabont'
  },
  {
    title: 'Let the Right One In',
    director: 'Tomas Alfredson'
  },
  {
    title: 'Sweeney Todd: The Demon Barber of Fleet Street',
    director: 'Tim Burton'
  },
  {
    title: 'The Birds',
    director: 'Alfred Hitchcock'
  },
  {
    title: 'Alien',
    director: 'Ridley Scott'
  },
  {
    title: 'The Omen',
    director: 'Richard Donner'
  }
];

// Homepage
app.get('/', (req, res) => {
  res.send('Any zombies out there?');
});

app.get('/documentation', (req, res) => {
  res.sendfile('/public/documentation.html', {root: __dirname})
});

// Return list of all movies
app.get('/movies', (req, res) => {
  res.json(movies)
});

// Return data about single movie title
app.get('/movies/:title', (req, res) => {
  res.send("Movie by title");
});

// Return data about genre
app.get('/movies/genres/:title', (req, res) => {
  res.send('Genre by title');
});

// Return data about director
app.get('/movies/director/:name', (req, res) => {
  res.send('Director info by name');
});

// Allow new user to register
app.post('/users', (req, res) => {
  res.send('Registration complete')
});

// Allow user to update username
app.put('/users/:username', (req, res) => {
  res.send('Username updated')
});

// Allow user to add movie to favorites
app.post('/users/:username/movies/:movieId/favorites', (req, res) => {
  res.send('Movie added to favorites list')
});

// Allow user to delete movie from favorites
app.delete('/users/:username/favorites/:movieId', (req, res) => {
  res.send('Movie removed from favorites list')
});

// Allow user to unregister
app.delete('/users/:username', (req, res) => {
  res.send('Your account was deleted')
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('App is listening on port 8080.');
});
