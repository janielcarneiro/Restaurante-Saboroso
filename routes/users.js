var connection = require('./../inc/db');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {

  connection.query("SELECT * FROM `tb_users` ORDER BY title", (error, results)=>{

      if(error){

          res.send("ERROR NA CONEXÃO: ",error);

      }else{

        res.send(results);

      }

  });

});

module.exports = router;
