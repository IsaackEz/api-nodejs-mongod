const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const { port } = require('./config');
const db = require('./database');

app.listen(port, () => {
	console.log(`Server is in port ${port}`);
});
