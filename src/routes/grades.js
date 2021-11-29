const express = require('express');
const router = express.Router();
const Grade = require('../model/Grade');
const axios = require('axios');
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

//GET all grades from 1 student
router.get('/student/:student_id', cors(), async (req, res) => {
	const { student_id } = req.params;
	let student = [];
	const URL = 'https://crud-nodejs-1.herokuapp.com/students?limit=30';
	try {
		axios.get(URL).then(async (response) => {
			items = response.data;

			for (let i = 0; i < items.length; i++) {
				if (items[i].student_id == student_id) {
					student = items[i];
				}
			}
			const grades = await Grade.find({
				student_id: student.student_id,
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

router.get('/:assigned_career/:semester_num', cors(), async (req, res) => {
	const { assigned_career, semester_num } = req.params;
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
router.get(
	'/career/:assigned_career/:semester_num',
	cors(),
	async (req, res) => {
		const { assigned_career, semester_num } = req.params;
		const grades = [];
		let career = [];
		let semester = [];
		const URL = 'https://app-flask-mysql.herokuapp.com/career?limit=30';
		const URL2 = 'https://app-flask-mysql.herokuapp.com/semester?limit=30';
		try {
			axios.get(URL).then(async (response) => {
				items = response.data.data;
				const subject = await Grade.find().lean();
				for (let i = 0; i < items.length; i++) {
					if (items[i].career_code == assigned_career) {
						career = items[i];
					}
				}
				axios.get(URL2).then(async (response) => {
					itemsSemester = response.data.data;
					for (let i = 0; i < itemsSemester.length; i++) {
						if (
							itemsSemester[i].semester_num == semester_num &&
							career.career_code == itemsSemester[i].career
						) {
							semester = itemsSemester[i];
						}
					}

					for (let i = 0; i < subject.length; i++) {
						if (
							career.career_code == subject[i].assigned_career &&
							semester.semester_num == subject[i].semester_num
						) {
							grades.push(subject[i]);
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
	}
);

module.exports = router;
