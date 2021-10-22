const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const SubjectSchema = Schema(
	{
		subject_code: { type: String, required: true, trim: true, unique: true },
		subject_name: { type: String, required: true, trim: true, unique: true },
		assigned_career: { type: String, trim: true },
		passing_grade: { type: Number, trim: true },
		teacher: { type: String, trim: true },
		attendance: { type: Number, trim: true },
		max_grade: { type: Number, trim: true },
		total_students: { type: Number, trim: true },
		languages: { type: String, trim: true },
		hours_per_week: { type: Number, trim: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);
SubjectSchema.plugin(mongoosePaginate);

module.exports = model('Subject', SubjectSchema);
