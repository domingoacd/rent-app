const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const home = require('./routes/index');
const database = require('./database/connect');



app.set('view engine', 'hbs');

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