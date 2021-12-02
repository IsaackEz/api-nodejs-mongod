const express = require('express');
const router = express.Router();
const Subject = require('../model/Subject');
const axios = require('axios');
const cors = require('cors');

//******** CRUD ********/
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

//********** API connection **************/

// Obtener todas las materias de un alumno
router.get('/student/:student_id', cors(), async (req, res) => {
	const { student_id } = req.params;
	const subjects = [];
	let student = [];
	const URL = `https://crud-nodejs-1.herokuapp.com/students/${student_id}`;
	try {
		axios.get(URL).then(async (response) => {
			student = response.data;
			const subject = await Subject.find().lean();
			for (let i = 0; i < subject.length; i++) {
				if (
					student[0].career.toLowerCase() ==
					subject[i].assigned_career.toLowerCase()
				) {
					subjects.push(subject[i]);
				}
			}
			const relation = {
				student,
				subjects,
			};
			res.send(relation);
		});
	} catch (error) {
		console.log({ error });
		return res.render('error', { errorMessage: error.message });
	}
});

//Obtener todas las materias de una carrera
router.get('/career/:career_code', cors(), async (req, res) => {
	const { career_code } = req.params;
	const subjects = [];
	let career = [];
	const URL = `https://app-flask-mysql.herokuapp.com/career/${career_code}`;
	try {
		axios.get(URL).then(async (response) => {
			career = response.data;
			const subject = await Subject.find().lean();

			for (let i = 0; i < subject.length; i++) {
				if (
					career_code.toLowerCase() ==
					subject[i].assigned_career.toLowerCase()
				) {
					subjects.push(subject[i]);
				}
			}
			const relation = {
				career,
				subjects,
			};
			res.send(relation);
		});
	} catch (error) {
		console.log({ error });
		return res.render('error', { errorMessage: error.message });
	}
});

//Obtener todoas las materias de una carrera en un semestre en especifico
router.get('/career/:career_code/:semester_num', cors(), async (req, res) => {
	const { career_code, semester_num } = req.params;
	let career = [];
	const semester = [];
	const subjects = [];
	const URL = `https://app-flask-mysql.herokuapp.com/career/${career_code}`;
	const URL2 = `https://app-flask-mysql.herokuapp.com/semester/${semester_num}`;
	try {
		axios.get(URL).then(async (response) => {
			career = response.data;
			const allSubjects = await Subject.find().lean();
			axios.get(URL2).then(async (response) => {
				itemsSemester = response.data;
				for (let i = 0; i < itemsSemester.length; i++) {
					if (
						itemsSemester[i].semester_num == semester_num &&
						itemsSemester[i].career_code.toLowerCase() ==
							career_code.toLowerCase()
					) {
						semester.push(itemsSemester[i]);
					}
				}
				for (let i = 0; i < allSubjects.length; i++) {
					if (
						allSubjects[i].assigned_career.toLowerCase() ==
							career_code.toLowerCase() &&
						allSubjects[i].semester_num == semester_num
					) {
						subjects.push(allSubjects[i]);
					}
				}
				const relation = {
					career,
					semester,
					subjects,
				};
				res.send(relation);
			});
		});
	} catch (error) {
		console.log({ error });
		return res.render('error', { errorMessage: error.message });
	}
});

//Obtener las materias con dicho nombre
router.get('/name/:subject_name', cors(), async (req, res) => {
	const { subject_name } = req.params;
	try {
		const subject = await Subject.find({
			subject_name: subject_name,
		})
			.collation({ locale: 'en', strength: 2 })
			.lean();
		res.send(subject);
	} catch (error) {
		console.log({ error });
	}
});

module.exports = router;
