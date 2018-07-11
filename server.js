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

  //This query is only used for the purpose of verifying the connection to the database. If the query fails, the application exits.
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
    const { tagID, DID } = req.body;
    if(!tagID && !DID){
      return res.status(400).send("Missing tagID or DID");
    }
    mysql('SafeAndMine').where('tagID', tagID).then((rows) => {
      if(rows.length > 0) {
        console.error("tagID is already registered.", tagID);
        return res.status(400).send();//We don't want to provide information because we don't want attackers to know if they found a legitimate tag already registered.
      }else {
        mysql('SafeAndMine').insert({ tagID, DID }).then((result) => {
          console.log("result", result);
          res.status(200).json({
            tagID,
            DID
          })
        }).catch((e) => {
          console.error(e);
        });
      }
    });
  });

  app.get('/safeandmine/:tagID', (req, res) => {
    //check who owns the tag
    //redirect to Manifold
    res.redirect('http://localhost:3000')
  });

  app.listen(3001, () => console.log('Server listening on port 3001!'));
});
