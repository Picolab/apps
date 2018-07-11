const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const knex = require('knex');

const prompt = require('prompt');

prompt.start();

const schema = {
  properties: {
    databasePassword: {
      hidden: true
    }
  }
};

const env = process.env.NODE_ENV || 'development';
let config = require('./knexfile')[env];

//retrieve user imput for the databasePassword, THEN set up the server...
prompt.get(schema, function (err, result) {

  config.connection.password = result.databasePassword;
  
  const mysql = knex(config);

  mysql.raw('select 1+1 as result').then(() => {
    // there is a valid connection in the pool
    console.log("DB connection successful!");
  }).catch((e) => {
    console.error(e);
    mysql.destroy();
    process.exit();
  });

  //set up server
  app.post('/safeandmine/api/tags', (req, res) => {

  });

  app.get('/safeandmine/:tagID', (req, res) => {
    //check who owns the tag
    //redirect to Manifold
    res.redirect('http://localhost:3000')
  });

  app.listen(3001, () => console.log('Server listening on port 3001!'));
});
