const express = require('express');
const router = express.Router();
const Grade = require('../model/Grade');
const cors = require('cors');

//GET ALL ITEMS AND SHOW THEM IN A TABLE
router.get('/', cors(), async (req, res) => {
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

router.get('/all', cors(), async (req, res) => {
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
router.get('/:student_id', cors(), async (req, res) => {
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
router.post('/addNew', cors(), async (req, res, next) => {
	try {
		const grade = new Grade(req.body);
		await grade.save();
		res.redirect('/grades');
		return;
	} catch (error) {
		return res.render('error', { errorMessage: error.message });
	}
});

//POSTMAN
router.post('/add', cors(), async (req, res, next) => {
	try {
		const grade = new Grade(req.body);
		await grade.save();
		res.send('Subject added successfully');
	} catch (error) {
		return res.send(error);
	}
});

//EDIT A RECORD
router.get('/edit/:id', cors(), async (req, res, next) => {
	const grade = await Grade.findOne({
		_id: req.params.id,
	}).lean();
	res.render('grades/edit', { grade });
	console.log(grade);
});

router.post('/edit/:id', cors(), async (req, res, next) => {
	const { id } = req.params;
	await Grade.updateOne({ _id: id }, req.body);
	res.redirect('/grades');
});

//POSTMAN
router.put('/edit/:id', cors(), async (req, res, next) => {
	const { id } = req.params;
	try {
		await Grade.findOneAndUpdate({ _id: id }, req.body);
		res.send('Record updated successfully');
	} catch (err) {
		res.json({ message: err });
	}
});

//DELETE A RECORD
router.get('/delete/:id', cors(), async (req, res, next) => {
	let { id } = req.params;
	await Grade.findOneAndDelete({ _id: id });
	res.redirect('/grades');
});

//POSTMAN
router.delete('/delete/:id', cors(), async (req, res, next) => {
	const { id } = req.params;
	try {
		await Grade.remove({ _id: id });
		res.send('Record deleted successfully');
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
