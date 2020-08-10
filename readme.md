# Express Pokedex

Working with databases, especially through ORMs, can present quite a learning curve. We'll start by incorporating one database model into an application to save favorite Pokemon.

#### Backstory: Pokemon

If you're not familiar with Pokemon, Pokemon is a franchise/universe created by Satoshi Tajiri in 1995. It's a famous franchise in both the US and Japan. Fun facts:

* Pokemon is short for "Pocket Monsters"
* The Pokemon universe extends to games, trading cards, and TV
* [The Pokemon Company](https://en.wikipedia.org/wiki/The_Pok%C3%A9mon_Company) is headquartered in Bellevue, WA.

## Getting Started

We'll be using an existing application that uses the [PokeAPI](http://pokeapi.co/), a Pokemon API that allows us to get a list of Pokemon.

* Fork and clone this repository
* Run `npm install` to install dependencies
  * Use `nodemon` to start the server

#### Read the Code

* After setup, **STOP**. You're using an existing application, so make sure to read the code and ensure what the application does. Some questions you may want to ask yourself:
  * How does the app retrieve a list of Pokemon?
  * How many Pokemon does the API call retrieve? Why that many?
  * What are the routes defined in the application?
  * Think about adding a Pokemon to your favorites.
    * How will this data be submitted?
    * What will you have to do to save this data to a database?
    * What will you have to do to display favorite Pokemon?

## User Stories

* As a user, I want to select my favorite Pokemon and add them to a list of favorites.
* As a user, once I add a Pokemon to my list of favorites, I want to be redirected to my favorites page.

## Requirements

#### Part 1: Setup Database

Your first step will be to create a SQL database for your application. Recall the process:

1. Use `npm` to install the required modules for postgres and sequelize: `pg` and `sequelize`
2. Make sure your Postgres server is running (check for the elephant).
3. Run `sequelize init` to initialize Sequelize.
4. Update your newly created `config/config.json` file as we did in class. This means changing the credentials, updating the SQL flavor, and changing the database name to `pokedex`.
5. Run `sequelize db:create` to create your database inside of Postgres

#### Part 2: Create your Pokemon Model and Table

Our data model needs only one attribute: `name`.

1. Use the `sequelize model:create` command to make the `pokemon` model. This creates both the model JS and the migration JS files.
2. Use the `sequelize db:migrate` command to apply the migrations.
3. Confirm that your `database` and `model` are inside Postgres using the `terminal` or `Postico` (shoutout to Adam)

```js
// Make sure to require your models in the files where they will be used.
var db = require('./models');

db.pokemon.create({
  name: 'Pikachu'
}).then(function(poke) {
  console.log('Created: ', poke.name)
})

db.pokemon.findAll().then(function(poke) {
  console.log('Found: ', poke.name)
})
```

Test by running the file: `node db-test.js`.

#### Part 3: Integrating the database with the app

You'll want to add functionality to the following routes by incorporating the `pokemon` table you created.

* `GET /pokemon`
  * View: `views/pokemon/index.ejs`
  * Purpose: Retrieve all favorited Pokemon and display them on the page
  * What sequelize function will do this for us?

  ## Create a File called Fave.ejs:
```  
  <div class="container">
    <h3 class="text-center">YOUR FAVORITE POKEMON</h3>
<% pokemon.forEach(function(pokemon) { %>
    <div class="well">
      <h4><a href="/pokemon/<%= pokemon.name %>"><%= pokemon.name %></a></h4>
      <form method="POST" action="/pokemon">
        <input hidden type="text" name="name" value="<%= pokemon.name %>">
      </form>
    </div>
  <% }); %>
</div>
```

* `POST /pokemon`
  * The form for adding is already included on the main index page
  * View: none (redirect to `/pokemon`)
  * Purpose: Creates a new Pokemon and redirects back to `/pokemon`
  * What is the sequelize function we use here?

```
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
```
  

#### Part 4: Display more info on each Pokemon

Add a route `GET /pokemon/:id` that renders a `show` page with information about the Pokemon with the corresponding row `id`.

* You can get detailed information about a Pokemon by passing the Pokemon's name to PokeAPI. You can retrieve images, abilities, stats, and moves through the API.
* Example: http://pokeapi.co/api/v2/pokemon/bulbasaur/

Check out the result of the pokemon API calls (or see the [doc page](http://pokeapi.co/)) for ideas on what data you could show. Show at least 4 pieces of data (e.g. attacks, habitat, etc.)

## Create a File called show.ejs
```
<h1><%= pokemon.name%></h1>

    <div class="row">
        <div class="col s12 m7">
          <div class="card">
            <div class="card-image">
                <img src="<%= pokemon.sprites.other['official-artwork'].front_default %>" alt="<%= pokemon.name %>image">
              <span class="card-title">Card Title</span>
            </div>
            <div class="card-content">
                <h5>Weight: <%= pokemon.weight %></h5>
                <h5>Height:  <%= pokemon.height %></h5>
                <h5>Moves #1: <%= pokemon.moves[0].move.name %></h5>
                <h5>Moves #2: <%= pokemon.moves[1].move.name %></h5>
                <h5>Moves #3: <%= pokemon.moves[2].move.name %></h5>
                <h5>Moves #4: <%= pokemon.moves[3].move.name %></h5>
            </div>
          </div>
        </div>
      </div>
  </div>  
```
```
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
```
#### Part 5: Styling

When finished with the above, style the application more to your liking with CSS.

## API Limits
You might notice the API doesn't return all the data it has at once. It has a
default limit of 20. That means if it has a list of 150 (or more) Pokemon it
will only return 20 at a time, by default.

<http://pokeapi.co/api/v2/pokemon/>

The API has a way to get around this limit. You can pass a different limit in
the query string. The limit allows you to ask the API to return more than it's
default amount.

Remember, query strings are parameters passed in the URL after a question mark
and separated with ampersands. They look like this:

```
http://mapwebsite.com/?lat=40.284&long=110.133&zoom=12
```

This is a URL. It consists of four parts:
1. the *protocol* is `http://`
2. the *domain* is `mapwebsite.com`
3. the *path* is `/` (the root path)
4. the *query string* is `?lat=40.284&long=110.133`

The query string is like a JavaScript object. There's keys and values.
This query string has three keys and values:

| Key  | Value   |
| ---  | ---     |
| lat  | 40.284  |
| long | 110.133 |
| zoom | 12  |

The Pokemon API is configured to read all sorts of keys and values from
the query string. Perhaps the most useful one we'll use is `limit`. Specifying
smaller or larger limits tells the server to send back more or less data.

Specify a limit of just one to see the first item in the list:
`<http://pokeapi.co/api/v2/pokemon?limit=1>`

Or, specify a limit of 151 to see all 151 pokemon!
`<http://pokeapi.co/api/v2/pokemon?limit=151>`

## Bonuses

* Add the ability to DELETE Pokemon from the favorites list.  
* Rethink the `pokemon` table. Instead of it being a list of favorites, have it be a list of pokemon the user owns. What columns should the table have? `nickname`, `level`, etc... How would this change the app?
---

## Licensing
1. All content is licensed under a CC-BY-NC-SA 4.0 license.
2. All software code is licensed under GNU GPLv3. For commercial use or alternative licensing, please contact legal@ga.co.
