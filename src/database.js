const mongoose = require('mongoose');
const URI = process.env.DB_URI;

(async () => {
	try {
		const db = await mongoose.connect(URI);
		console.log('Db connectect to', db.connection.name);
	} catch (error) {
		console.error(error);
	}
})();
