var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o');


var Bear = require('./app/models/bear');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Set the port for the server to listen on 
var port = process.env.PORT || 8080;


var router = express.Router();


//middleware to use for all request

router.use(function(request, respond, next) {
    //Do loggin
    console.log("Something just happened");

    next();
});


router.get('/', function(request, respond) {
    respond.json({ message: 'Welcome to my API!' });
});

router.route('/bear')

    .post(function(request, respond) {

        //Create a bear object
        var bear = new Bear();
        bear.name = request.body.name;

        //Save the bear in the database
        bear.save(function(err) {
            if (err)
                respond.send(err);
        });
    })

    .get(function(request, respond) {
        Bear.find(function(err, bears) {
            if (err) {
                respond.send(err);
            }
            respond.json(bears);
        });
    });

  router.route('/bear/:bearId')
  	.get(function(request,respond){

  		Bear.findById(request.params.bearId,function(err,bear){

  			if(err)
  				respond.send(err);

  			respond.json(bear);

  		});
  	})

  	.put(function(request,respond){
  		
  		Bear.findById(request.params.bearId, function(err,bear){

  			if(err)
  				respond.send(err);

  			bear.name = request.params.name;
  			bear.save(function(err){

  				if(err)
  					respond.send(err);

  				respond.json({message: 'Bear updated'});
  			});
  		});
  	})

  	.delete(function(request,respond){
  		Bear.remove({
  			_id : request.params.bearId
  		}, function(err,bear){
  			if(err)
  				respond.send(err);

  			respond.json({message :'Successfully deleted'});
  		});
  	});
app.use('/api', router);

app.listen(port);
console.log('Listening on port ' + port);