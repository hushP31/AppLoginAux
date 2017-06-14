
/**
 * Module dependencies.
 */

var express 	= require('express');
var routes 		= require('./routes');
var user 		= require('./routes/user');
var http 		= require('http');
var path 		= require('path');
var mongoose 	= require('mongoose'); //MongoDB
var users 		= require('./routes/users');
var sessions 	= require('./routes/sessions');
var fs 			= require('fs');

var parameters	= fs.readFileSync('./config.cfg', 'utf8', function(err, parameters){
	if(err){
		console.log(err);
	}
});

parameters = JSON.parse(parameters);

exports.parameters;

//var parameters = require('./config.cfg')
var app = express();


// Creamos el Schema Usuario con los datos iniciales de
// cualquier usuario
var UserSchema = mongoose.Schema({
		name: {type: String, required: true},
		last_name: {type: String, required: true},
		name_user: {type: String, required: true},
		email: {type: String, required: true}, 
		password: {type: String, required: true},
		role: {type: String, required:true}
	});

// Se crea el model a partir del Schema
var UserModel = mongoose.model('User', UserSchema);

//Importación del modelo a los archivos usuarios.js y sesiones.js
users.setModel(UserModel);
sessions.setModel(UserModel);


//Conexión a la Base de Datos (MongoDB) //************************//
var simple_connection = 'mongodb://localhost/UsersDB';
//var full_connection = 'mongodb://'+ var_config.mongodb.username +':'+ var_config.mongodb.password +'@'+ var_config.mongodb.host +':'
//							+ var_config.mongodb.port +'/' + var_config.mongodb.database;

//console.log(conexion);

mongoose.connect(simple_connection, function(error){
	if(error){
		throw error;
	}
	else{
		console.log('Conectado a MongoDB correctamente');
	}
});

//******************************************************************//


// all environments
app.set('port', process.env.PORT || parameters.entorno.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({secret: 'abcd1234'}));

app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Identificación de rutas

app.get('/', sessions.index);
//app.get('/users', user.list);

app.get('/login', sessions.get_login);
app.post('/login', sessions.post_login);
app.get('/index', sessions.index);

app.get('/users', users.index);
app.post('/users', users.store);
app.get('/users/create', users.create);
app.get('/users/:id', users.show);
app.get('/users/:id/edit', users.edit);
app.put('/users/:id', users.update);
app.delete('/users/:id', users.destroy);

app.get('/exit', sessions.exit);


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
