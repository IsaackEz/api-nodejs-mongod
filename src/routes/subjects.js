const express = require('express');
const router = express.Router();
const Subject = require('../model/Subject');
const cors = require('cors');

//GET ALL ITEMS AND SHOW THEM IN A TABLE
router.get('/all', cors(), async (req, res) => {
	const limit = req.query.limit || 5;
	const page = req.query.page || 1;

	try {
		const subjectsPOST = await Subject.paginate({}, { limit, page });
		const subjects = subjectsPOST;
		res.send(subjects);
	} catch (error) {
		console.log({ error });
		return res.render('error', { errorMessage: error.message });
	}
});

router.get('/', cors(), async (req, res) => {
	try {
		const subjects = await Subject.find().lean();

		res.render('subjects/index', {
			subjects,
		});
	} catch (error) {
		console.log({ error });
		return res.render('error', { errorMessage: error.message });
	}
});

//GET 1 ITEM
router.get('/:subject_code', cors(), async (req, res) => {
	const { subject_code } = req.params;
	try {
		const subject = await Subject.findOne({
			subject_code: subject_code,
		}).lean();
		res.send(subject);
	} catch (error) {
		console.log({ error });
	}
});

//ADD A NEW RECORD
router.post('/addNew', cors(), async (req, res, next) => {
	try {
		const subject = new Subject(req.body);
		await subject.save();
		res.redirect('/subjects');
	} catch (error) {
		return res.render('error', { errorMessage: error.message });
	}
});

//POSTMAN
router.post('/add', cors(), async (req, res, next) => {
	try {
		const subject = new Subject(req.body);
		await subject.save();
		res.send('Subject added successfully');
	} catch (error) {
		return res.send(error.message);
	}
});

//EDIT A RECORD
router.get('/edit/:id', cors(), async (req, res, next) => {
	const subject = await Subject.findOne({
		_id: req.params.id,
	}).lean();
	res.render('subjects/edit', { subject });
});

router.post('/edit/:id', cors(), async (req, res, next) => {
	const { id } = req.params;
	console.log(id);
	await Subject.updateOne({ _id: id }, req.body);
	res.redirect('/subjects');
});
//POSTMAN
router.put('/edit/:id', cors(), async (req, res, next) => {
	const { id } = req.params;
	try {
		await Subject.findOneAndUpdate({ _id: id }, req.body);
		res.send('Record updated successfully');
	} catch (err) {
		res.json({ message: err });
	}
});

//DELETE A RECORD
router.get('/delete/:id', cors(), async (req, res, next) => {
	let { id } = req.params;
	await Subject.remove({ _id: id });
	res.redirect('/subjects');
});
//POSTMAN
router.delete('/delete/:id', cors(), async (req, res, next) => {
	const { id } = req.params;
	try {
		await Subject.remove({ _id: id });
		res.send('Record deleted successfully');
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
