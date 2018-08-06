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

let setUpServer = function(password) {
  config.connection.password = password;

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
    if(!tagID || !DID){
      return res.status(400).send("Missing tagID or DID");
    }
    mysql('SafeAndMine').where('tagID', tagID).then((rows) => {
      if(rows.length > 0) {
        console.error("tagID is already registered.", tagID);
        return res.status(400).send();//We don't want to provide information because we don't want attackers to know if they found a legitimate tag already registered.
      }else {
        mysql('SafeAndMine').insert({ tagID, DID }).then((result) => {
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

  const redirectUser = (res, tagID, DID) => {
    let DIDParam = DID ? ('&DID=' + DID) : '';
    if(tagID) {
      res.redirect('http://localhost:3000/#/picolabs/safeandmine?tagID=' + tagID + DIDParam);
    } else {
      console.error("no tagID");
      throw Error("Cannot redirect without a tagID!");
    }
  };

  app.get('/safeandmine/:tagID', (req, res) => {
    const tagID = req.params.tagID;
    if(!tagID) {
      res.status(400).send("Missing tagID!");
    }
    //check who owns the tag
    mysql('SafeAndMine').where('tagID', tagID).then((rows) => {
      if(rows.length === 0) {
        redirectUser(res, tagID);
        return;
      }
      const DID = rows[0].DID;
      redirectUser(res, tagID, DID);
    });
  });

  app.listen(3001, () => console.log('Server listening on port 3001!'));
};

//if password defined in environment variable, use that, else prompt the user for a password
if(process.env.DATABASE_PASSWORD) {
  setUpServer(process.env.DATABASE_PASSWORD);
}else{
  //retrieve user imput for the databasePassword, THEN set up the server...
  prompt.get(schema, function (err, result) {
    setUpServer(result.databasePassword);
  });
}
