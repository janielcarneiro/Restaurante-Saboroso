var express = require('express');
var users = require('./../inc/users');
var admin = require('./../inc/admin');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var contacts = require('./../inc/contacts');
var emails = require('./../inc/emails');
var moment = require('moment');
var router = express.Router();

module.exports = function(io){

    moment.locale('pt-BR');

// exe daqui e o meu Middleware para validar as minhas rotas
router.use(function(req, res, next){

    if(['/login'].indexOf(req.url) === -1 && !req.session.user){
        res.redirect('/admin/login')
    }else{
        //para chamar a rota
        next();
    }
    //console.log("Middleware: ", req.url);

});


router.use(function(req, res, next){

    req.menus = admin.getMenus(req);

    next();

});

router.get('/logout', function(req, res, next){

    delete req.session.user;

    res.redirect('/admin/login');

});

router.get('/', function(req, res){

    admin.dashboard().then(data => {

        res.render('admin/index', admin.getParams(req, {
           data : data
        }));

    }).catch(err => {

        console.log("ERROR: ", err);

    });

});

router.get('/dashboard', function(req, res, next){

    reservations.dashboard().then(data => {

        res.send(data);

    }).catch(err => {

        console.log("ERROR ADMIN na linha 67: ", err);

    })

})
//para fazer o login
router.post('/login', function(req, res, next){

    if(!req.body.email){

        users.render(req, res, "Preencha o campo E-mail");

    }else if(!req.body.password){

        users.render(req, res, "Preencha o campo Password");

    }else{

        users.login(req.body.email, req.body.password).then(user => {
            //guardar os dados na sessão
            req.session.user = user;
            res.redirect('/admin')

        }).catch(err => {

            users.render(req, res, err.message || err);

        });

    }

});

router.get('/login', function(req,res){
    //if(!req.session.views) req.session.views = 0;
    //console.log("SESSION: ",req.session.views++);
    //res.render('admin/login');
    users.render(req, res, null );
});

router.get('/contacts', function(req,res){

    contacts.getContacts().then(data => {

        res.render('admin/contacts', admin.getParams(req, {
            data
        }));

    }).catch(err => {

        res.send("ERROR: ", err);

    });

});

router.delete('/contacts/:id', function(req, res, next){

    contacts.delete(req.params.id).then(results => {

        io.emit('dashboard update');
        res.send(results); 

    }).catch(err => {

        res.send("ERROR: ",err);

    })

})

router.get('/emails', function(req,res){

    emails.getEmails().then(data => {

        res.render('admin/emails', admin.getParams(req, {
            data: data
        }));

    }).catch(err => {

        res.send("ERROR: ", err);

    });


});

router.delete('/emails/:id', function(req, res){
    emails.delete(req.params.id).then(results => {
        io.emit('dashboard update');
        res.send(results);
    }).catch(err => {

        res.send("ERROR: ", err);

    })
})

router.get('/menus', function(req,res){

    menus.getMenus().then(data => {

        res.render('admin/menus', admin.getParams(req, {
            data
        }));

    }).catch(err => {

        console.log("ERROR: ", err);

    });

});

router.post('/menus', function(req, res, next){

    menus.save(req.fields, req.files).then(results => {
        io.emit('dashboard update');
        res.send(results);
    }).catch(err => {
        res.send("ERROR: ",err);
    })
    //res.send(req.fields);
    //res.send(req.files);

});

router.delete('/menus/:id', function(req, res, next){

    menus.delete(req.params.id).then(results => {

        io.emit('dashboard update');
        res.send(results);

    }).catch(err => {

        res.send("ERROR: ", err);

    });

});

router.get('/reservations', function(req,res){

    let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
    let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');


    reservations.getReservations(req).then(pag => {

        res.render('admin/reservations', admin.getParams(req,{
        
            date : {
                start,
                end
            },
            data : pag.data,
            moment,
            links : pag.links
    
        }));

    }).catch(err => {

        console.log("ERROR: ", err);

    });

});

router.post('/reservations', function(req, res, next){

    reservations.save(req.fields, req.files).then(results => {
        io.emit('dashboard update');
        res.send(results);
    }).catch(err => {
        res.send("ERROR: ",err);
    })
    //res.send(req.fields);
    //res.send(req.files);

});

router.delete('/reservations/:id', function(req, res, next){

    reservations.delete(req.params.id).then(results => {
        io.emit('dashboard update');
        res.send(results);
    }).catch(err => {

        res.send("ERROR: ", err);

    });

});


router.get('/users', function(req,res){

    users.getUsers().then(data => {

        res.render('admin/users', admin.getParams(req, {

            data

        }));

    }).catch(err => {

        console.log(err);

    });

});

router.post('/users', function(req, res, next){

    users.save(req.fields).then(results => {
        io.emit('dashboard update');
        res.send(results);

    }).catch(err => {

        res.send("ERROR: ", err);

    });

});

router.post('/users/password-change', function(req, res, next){

    users.changePassword(req).then(results => {

        res.send(results);
        //console.log("Dados Completo: ", req.fields);
        //console.log("ID: ",req.fields.id);
        //console.log("Senha: ",req.fields.password);
        //console.log("Nova senha: ",req.fields.passwordConfirm);

    }).catch(err => {
        console.log("MEU ID: ", req.id);
        res.send({
            error: err
            
        });

    })

})

router.delete('/users/:id', function(req, res, next){

    users.delete(req.params.id).then(results =>{
        io.emit('dashboard update');
        res.send(results);

    }).catch(err => {

        res.send("ERROR: ", err);

    });

   // res.render('/admin/users', admin.getParams(req));

});

    return router;

}