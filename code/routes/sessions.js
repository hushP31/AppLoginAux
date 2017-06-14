

var User;
exports.setModel = function(model){
	User = model;
};


/**
  * @method get_login
  	
  * Description
	Redirects the browser to /login
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects
 */
exports.get_login = function(req, res){
	//console.log("Estoy en exports.GET_login\n");
	res.render('sessions/login');
};


/**
  * @method post_login
  	
  * Description
	the function receives two parameters, the function 
	processes the parameters and if they are correct, session starts.
	
	@param req
		It contains the information of the forms
	@param res
		It contains the current direction

	@return res
		it redirects
 */
exports.post_login = function(req, res){

	//Inicializan variables
	var datos_erroneos = false;
	var user_ = req.body.usuario;
	var pass_ = req.body.password;
	var mongoose = require('mongoose');
	var md5 = require('js-md5');
	var hashedpass = md5(pass_);
	
	User.findOne( { $and: [{name_user: { $eq: user_, $exists: true }}, {password: {$eq: hashedpass, $exists: true}}]}, function(error, document){
				if(document == null){
					res.render('sessions/login', {error: true});
				}
				else{
					//console.log(documento);
					req.session.user =user_;
					req.session.password = hashedpass;

					res.redirect('/index');
				}
	});
};


/**
  * @method index
  	
  * Description
	function check for an open session. 
	If the session is open shows the main page,
	else redirected to Login

	@param req
		It contains the information of the forms
	@param res
		It contains the current direction

	@return res
		it redirects
 */
exports.index = function(req, res){
	
	if(req.session.user){
		var user_session = {user: req.session.user}
		var fs = require('fs');
		var parameters	= fs.readFileSync('./config.cfg', 'utf8', function(err, parameters){
			if(err){
				console.log(err);
			}
		});
		parameters = JSON.parse(parameters);
		res.render('website/index', {parameters, user_session});
	}else{
		res.redirect('../login');
	}
};

/**
  * @method salir
  	
  * Descripción
	Function destroy the current session and redirect to Login
	
	@param req
		It contains the information of the forms
	@param res
		It contains the current direction

	@return res
		it redirects
 */
exports.exit = function(req, res){
	req.session.user = null;
	req.session.password = null;
	res.redirect('/login');
};