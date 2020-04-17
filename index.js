const express = require('express');
const session = require('express-session');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');

app.set('view engine', 'hbs');

//MIDDLEWARES
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(session({secret: 'ssshhhh'}));

app.engine('hbs', hbs({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
}));

//ROUTES
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use('/', require('./routes'));
app.use('/admin', require('./routes/admin'));
app.use('/panel', require('./routes/panel'));
app.use('/async', require('./routes/async'));

//SERVER START
app.listen(3000, () => {
  console.log('Running on port 3000');
  console.log(__dirname);
});