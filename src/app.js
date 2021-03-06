const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const indexRoutes = require('./routes/index');
const subjectsRoutes = require('./routes/subjects');
const gradesRoutes = require('./routes/grades');
const cors = require('cors');

const app = express();
const port = require('./config');

// settings
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.engine(
	'.hbs',
	exphbs({
		layoutsDir: path.join(app.get('views'), 'layouts'),
		partialsDir: path.join(app.get('views'), 'partials'),
		defaulLayout: 'main',
		extname: '.hbs',
	})
);
app.set('view engine', '.hbs');

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// routes
app.use('/', indexRoutes);
app.use('/subjects', subjectsRoutes);
app.use('/grades', gradesRoutes);

app.use((req, res, next) => {
	res.status(404).render('404');
});

module.exports = app;
