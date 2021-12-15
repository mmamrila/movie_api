const express = require('express');
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topHorrorMovies = [
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

app.get('/', (req, res) => {
  res.send('Any zombies out there?')
});

app.get('/movies', (req, res) => {
  res.json(topHorrorMovies);
});

app.use('/documentation.html', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('App is listening on port 8080.');
});
