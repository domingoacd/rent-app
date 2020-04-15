const express = require('express');
const session = require('express-session');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const home = require('./routes/index');



app.set('view engine', 'hbs');

//MIDDLEWARES
app.use(express.urlencoded());
app.use(bodyParser.json());


app.engine('hbs', hbs({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
}));


app.use(express.static(__dirname + '/public'));
app.use('/', home);
app.use(express.static('public'));
// app.get('/', (req, res)=> {
//   res.send('test');
// });

app.listen(3000, () => {
  console.log('Running on port 3000');
  console.log(__dirname);
});