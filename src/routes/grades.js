const express = require('express');
const router = express.Router();
const Grade = require('../model/Grade');
const axios = require('axios');
const cors = require('cors');

//******** CRUD ********/

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
		const grades = await Grade.findOne({
			student_id: student_id,
		}).lean();
		res.send(grades);
	} catch (error) {
		console.log({ error });
	}
});

//GET all items with total_grade
router.get('/total/:total_grade', cors(), async (req, res) => {
	const { total_grade } = req.params;
	try {
		const grades = await Grade.find({
			total_grade: total_grade,
		}).lean();
		res.send(grades);
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
		return res.send(error.message);
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

//********** API connection **************/

// Obtener todas las calificaciones de una alumno
router.get('/student/:student_id', cors(), async (req, res) => {
	const { student_id } = req.params;
	let student = [];
	const URL = `https://crud-nodejs-1.herokuapp.com/students/${student_id}`;

	try {
		axios.get(URL).then(async (response) => {
			student = response.data;
			const grades = await Grade.find({
				student_id: student[0].student_id,
			}).lean();

			const relation = {
				student,
				grades,
			};
			res.send(relation);
		});
	} catch (error) {
		console.log({ error });
	}
});

//Obtener todas las calificaciones de una carrera en un semestre
router.get('/career/:career_code/:semester_num', cors(), async (req, res) => {
	const { career_code, semester_num } = req.params;
	let career = [];
	const semester = [];
	const grades = [];
	const URL = `https://app-flask-mysql.herokuapp.com/career/${career_code}`;
	const URL2 = `https://app-flask-mysql.herokuapp.com/semester/${semester_num}`;
	try {
		axios.get(URL).then(async (response) => {
			career = response.data;
			const allGrades = await Grade.find().lean();
			axios.get(URL2).then(async (response) => {
				items = response.data;
				for (let i = 0; i < items.length; i++) {
					if (
						items[i].semester_num == semester_num &&
						items[i].career_code.toLowerCase() ==
							career_code.toLowerCase()
					) {
						semester.push(items[i]);
					}
				}
				for (let i = 0; i < allGrades.length; i++) {
					if (
						allGrades[i].assigned_career.toLowerCase() ==
							career_code.toLowerCase() &&
						allGrades[i].semester_num == semester_num
					) {
						grades.push(allGrades[i]);
					}
				}
				const relation = {
					career,
					semester,
					grades,
				};
				res.send(relation);
			});
		});
	} catch (error) {
		console.log({ error });
		return res.render('error', { errorMessage: error.message });
	}
});

module.exports = router;
