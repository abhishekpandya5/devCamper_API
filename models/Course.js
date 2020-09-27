const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a decription'],
    },
    weeks: {
        type: Number,
        required: [true, 'Please add number of weeks'],
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost'],
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// Static method can call directly from model named 'Course' like
// Course.goFish();
// While for a regular method
/* const courses = Course.find();
courses.goFish();  */

// Declaring a static method to get avg of course tuition
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    // console.log('Calculating avg cost...'.blue);

    // console.log(this); // Model { Course }

    // aggregate method containing pipeline (pipeline contains different steps, different operators)
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
        },
        // the calculated object 'group'
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' },
            },
        },
    ]);

    // console.log(obj);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
        });
    } catch (err) {
        console.log(err);
    }
};

// Call getAverageCost after save
CourseSchema.post('save', function () {
    // console.log(this); // req body with _id, bootcamp id & createdAt
    // console.log("constructor: ", this.constructor); // Model { Course }
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
