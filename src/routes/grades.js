const express = require('express');
const router = express.Router();
const Grade = require('../model/Grade');

//GET ALL ITEMS AND SHOW THEM IN A TABLE
router.get('/', async (req, res) => {
	try {
		const grades = await Grade.find().lean();

		res.render('grades/index', {
			grades,
		});
	} catch (error) {
		console.log({ error });
		return res.render('error', { errorMessage: error.message });
	}
});

router.get('/all', async (req, res) => {
	const limit = req.query.limit || 5;
	const page = req.query.page || 1;

	try {
		const gradesPOST = await Grade.paginate({}, { limit, page });

		res.send(gradesPOST);
	} catch (error) {
		console.log({ error });
		return res.render('error', { errorMessage: error.message });
	}
});

//GET 1 ITEM
router.get('/:student_id', async (req, res) => {
	const { student_id } = req.params;
	try {
		const subject = await Grade.findOne({
			student_id: student_id,
		}).lean();
		res.send(subject);
	} catch (error) {
		console.log({ error });
	}
});

//ADD A NEW RECORD
router.post('/add', async (req, res, next) => {
	try {
		const grade = new Grade(req.body);
		await grade.save();
		res.redirect('/grades');
	} catch (error) {
		return res.render('error', { errorMessage: error.message });
	}
});

//EDIT A RECORD
router.get('/edit/:id', async (req, res, next) => {
	const grade = await Grade.findOne({
		_id: req.params.id,
	}).lean();
	res.render('grades/edit', { grade });
	console.log(grade);
});

router.post('/edit/:id', async (req, res, next) => {
	const { id } = req.params;
	await Grade.updateOne({ _id: id }, req.body);
	res.redirect('/grades');
});

//POSTMAN
router.put('/edit/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		await Grade.findOneAndUpdate({ _id: id }, req.body);
		res.send('Record updated successfully');
	} catch (err) {
		res.json({ message: err });
	}
});

//DELETE A RECORD
router.get('/delete/:id', async (req, res, next) => {
	let { id } = req.params;
	await Grade.findOneAndDelete({ _id: id });
	res.redirect('/grades');
});

//POSTMAN
router.delete('/delete/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		await Grade.remove({ _id: id });
		res.send('Record deleted successfully');
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
