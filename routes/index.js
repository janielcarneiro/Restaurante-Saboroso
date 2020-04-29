var conection = require('./../inc/db');
var express = require('express');
var menus = require('./../inc/menus');
var contacts = require('./../inc/contacts');
var reservations = require('./../inc/reservations');
var emails = require('./../inc/emails');
var router = express.Router();


module.exports = function(io){


/* GET home page. */
router.get('/', function(req, res) {

  //res.render('index', { title: 'Express Restaurante' });

  menus.getMenus().then(results => {

    res.render('index', { 
      
      title: 'Express Restaurante Ok',
      menus: results,
      isHome: true
    
    });

  }).catch(err => {

      console.error(err);

  });

  /*conection.query("SELECT * FROM tb_menus ORDER BY title", (err, results)=> {

    if(err){

        console.log(err);

    }

    res.render('index', { 
      
      title: 'Express Restaurante Ok',
      menus: results
    
    });

  });*/

});

router.get('/contact', function(req,res) {

    contacts.render(req, res);
    /*res.render('contact', {

      title: 'Contact',
      background: 'images/img_bg_3.jpg',
      h1: 'Diga ola',
      autor: "Janiel Carneiro Lima"
      
    });*/

});

router.post('/contact', function(req,res){

    //res.send(req.body);
    if(!req.body.name){
      contacts.render(req, res, 'Digete seu nome');
      //res.send("nome não existente");
    }else if(!req.body.email){
      contacts.render(req, res, 'Digete o seu email');
      //res.send("email nao existente");
    }else if(!req.body.message){
      contacts.render(req, res, 'Digete uma mensagem');
      //res.send("messagem obrigatoria");
    }else{

      contacts.save(req.body).then(results => {

          //para limpar os meus campos
        req.body = {};
        io.emit('dashboard update');
        contacts.render(req, res, null, "Formulario Enviado com sucesso");

      }).catch(err => {

        contacts.render(req, res, err.message);

      })
      //res.send(req.body);

    }
    

});

router.get('/menu', function(req,res){

  menus.getMenus().then(results => {

    res.render('menu', {

      title: 'Menu',
      background: 'images/img_bg_1.jpg',
      h1: 'Diga ola',
      autor: "Janiel Carneiro Lima",
      menus: results
  
    });

  }).catch(err => {

      console.error("ERROR: ", err);

  });

});

router.get('/reservation', function(req, res){

  reservations.render(req, res);

  /*res.render('reservation', {

    title: 'reservation',
    background: 'images/img_bg_2.jpg',
    h1: 'Reservas',
    autor: "Janiel Carneiro Lima"

  });*/

});

router.post('/reservation', function(req,res){
  //mandar informaçao na tela
  //res.send(req.body);
  //fazer a validação se os campos esta preenchido
  if(!req.body.name){
    reservations.render(req, res, 'Digete o nome');
  } else if(!req.body.email){
    reservations.render(req, res, "Digete o seu email");
  }else if(!req.body.people){
    reservations.render(req, res, "Selecione quantas vagas e para reservar");
  }else if(!req.body.date){
    reservations.render(req, res, "Digete a data da reserva");
  }else if(!req.body.time){
    reservations.render(req, res, "Digete o Hora da reservar");
  }else{
    //Salvar os meus dados
    //res.send(req.body);
    reservations.save(req.body).then(results => {
        //para limpar os meus campos
        req.body = {};
        io.emit('dashboard update');
        reservations.render(req, res, null, "Formulario Enviado com sucesso");

    }).catch( err => {

        reservations.render(req, res, err.message);

    });

  };

});

router.get('/services', function(req,res){

  res.render('services',{

    title: 'services',
    background: 'images/img_bg_1.jpg',
    h1: 'esperimente nossos serviços',
    autor: "Janiel Carneiro Lima"

  });

});

router.post('/subscribe', function(req, res, next){

  emails.save(req).then(results => {

    res.send(results);
  }).catch(err => {

    res.send("ERROR: ", err);

  })

});

return router;

};
