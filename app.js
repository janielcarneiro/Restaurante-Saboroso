var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({host: 'localhost', port: 6379});
var formidable = require('formidable');
//trabalhando com socket.io
var http = require('http');
var socket = require('socket.io');
////////////////////////////
var path = require('path');

var app = express();

//criando o servidor
var http = http.Server(app);
//criar o socket
var io = socket(http);

//conectar com o socket
io.on('connection', function(socket){

    console.log("Conectado ao socket.Io");

    //mandar o evento quando cliente estiver conectador
   /* io.emit('reservations update', {
        data: new Date()
    })*/

});

var routes = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);

//isso daqui  e o meu middle
app.use(function(req, res, next){

    let contentType = req.headers["content-type"];

    if(req.method === 'POST'   && contentType.indexOf('multipart/form-data;') > -1){

        var form = formidable.IncomingForm({

            uploadDir:path.join(__dirname, "/public/images"),
            keepExtensions:true

        });

        form.parse(req, function(err, fields, files){

            req.fields = fields;
            req.files = files;

            next();

        });

    }else{

        next();

    }
    
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
    session({

        store: new RedisStore({ client: redisClient }),
        secret : 'password',
        resave: true,
        saveUninitialized:true
    })

)

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/admin', adminRouter);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//para dizer que http esta ouvindo nossa portar 3000 do (socket.io)

http.listen(3000, function(){

    console.log("OK servidor esta rodadando");

});

//module.exports = app;
