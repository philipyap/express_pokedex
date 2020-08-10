var express = require('express');
var router = express.Router();
// Make sure to require your models in the files where they will be used.
var db = require('../models');
const axios = require('axios')


// GET /pokemon - return a page with favorited Pokemon
router.get('/', function(req, res) {
  db.pokemon.findAll()
  .then(function(poke){
    res.render('fave', {pokemon: poke})
  })
  .catch(err =>{
    res.send(err, 'error')
  })
   //res.send('Render a page of favorites here');
 });

// POST /pokemon - receive the name of a pokemon and add it to the database
router.post('/', function(req, res) {
  // TODO: Get form data and add a new record to DB
  db.pokemon.create({
    name: req.body.name
  })
  .then(function(poke){
    console.log('myFave', poke.name)
    res.redirect('/pokemon')
  })
 
  //res.send(req.body);
});
router.get('/:name', (req, res) => {
  let name = req.params.name
  console.log(name)
axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
.then((response) => {
  console.log(response.data)
  let pokemon = response.data
  //setting a variable to data
  res.render('show', {pokemon: pokemon})
})
.catch(err => {
  console.log(err, 'error')
})

})
module.exports = router;
