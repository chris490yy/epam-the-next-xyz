// include and setup express
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

var User = require('./model/user.js');

var Article = require('./model/article.js');

//connect to mongoDB
mongoose.connect('mongodb://localhost/epam');

//npm package for user authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// include express handlebars (templating engine)
var exphbs  = require('express-handlebars');

// specify the layout for our handlebars template
var hbs = exphbs.create({defaultLayout: 'main'});

// crethe the express app
var app = express();


// setup our public directory (which will serve any file stored in the 'public' directory)
app.use(express.static('public'));

// express middleware that parser the key-value pairs sent in the request body in the format of our choosing (e.g. json)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//----------------------------------------------------
app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());
//---------------------------------------------------

// setup handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// setup api
var api = require('./routes/api');
var api_for_category = require('./routes/api_for_category');

// authentication with database
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// Use Passport's 'serializeUser' method to serialize the user
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Use Passport's 'deserializeUser' method to load the user document
passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.use(function (req, res, next) {
 res.locals.scripts = [];
 next();
});
// respond to the get request with the home page
app.get('/', function (req, res) {
  res.locals.scripts.push('/js/home.js');
  res.render('home');
});

// respond to the get request with the about page
app.get('/about', function(req, res) {
  res.locals.scripts.push('/js/about.js');
  res.render('about');
});

app.get('/addCategory', function(req, res) {
  res.locals.scripts.push('/js/addCategory.js');
  res.render('addCategory');
});

app.get('/signIn', function(req, res) {

  res.render('signIn');
});

app.post('/signIn', passport.authenticate('local', { successRedirect: '/dashboard',
    failureRedirect: '/signIn' }), function(req, res) {
      console.log('in signin post');
});




//-------------------use mongodb data
app.get('/categories/:id', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Header", "X-Requestd-With");
  Article.findById(req.params.id, function(err, data) {
    //console.log(article);
    if(!err){
      //console.log(data);
      res.render('article', data);
    } else {
      res.send(404, "page not found");
    }
  });
});
//------------------- USE LOCAL DATA
app.get('/article/:id', function(req, res) {
  var fs = require('fs');
  var _ = require('underscore');
  var obj;
  fs.readFile('./data/articles.json', 'utf8', function (err, data) {
    if (err) throw err;
    data = _.filter(JSON.parse(data), function(item) {
      return item.id == req.params.id;
    });
    //console.log(data);
    res.render('article', data[0]);
  });

});

//---------------------

// respond to the get request with the register page
app.get('/register', function(req, res) {
  res.render('register');
});

// handle the posted registration data
app.post('/register', function(req, res) {
  if(req.body.receive === 'on') {
    req.body.receive = true;
  }
  var user = new User(req.body);
  user.save(function(err) {
    if (err) return handleError(err);
    res.redirect('/signIn');
  });
});

// handle the posted category data
app.post('/addCategory', function(req, res) {
  var category = new Article(req.body);
  category.save(function(err) {
    if (err) return handleError(err);
    res.redirect('/about');
  });
});

// respond to the get request with dashboard page (and pass in some data into the template / note this will be rendered server-side)
app.get('/dashboard', function (req, res) {
  res.render('dashboard', {
   stuff: [{
    greeting: "Hello",
    subject: "World!"
  }
  ],
  name: req.user.name
});
});



// the api (note that typically you would likely organize things a
//little differently to this)
app.use('/api', api);
app.use('/api_for_category', api_for_category);

// create the server based on express
var server = require('http').createServer(app);

// start the server
server.listen(1337, '127.0.0.1', function () {
  console.log('The Next XYZ is looking good! Open http://localhost:%d to begin.', 1337);
});