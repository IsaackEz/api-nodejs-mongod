const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const GradesSchema = Schema(
	{
		student_id: { type: Number, required: true, trim: true },
		subject_code: { type: String, required: true, trim: true },
		p_1: { type: Number, trim: true },
		p_2: { type: Number, trim: true },
		p_3: { type: Number, trim: true },
		total_grade: { type: Number, trim: true },
		best_student: { type: String, trim: true },
		worst_student: { type: String, trim: true },
		total_students: { type: Number, trim: true },
		total_failed: { type: Number, trim: true },
		total_succeded: { type: Number, trim: true },
		school_cycle: { type: String, trim: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

GradesSchema.plugin(mongoosePaginate);

module.exports = model('Grades', GradesSchema);
