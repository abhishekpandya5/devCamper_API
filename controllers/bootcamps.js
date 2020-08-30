const Bootcamp = require('../models/Bootcamp');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();

		res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};
/* res
    .status(200)
    .json({ success: true, msg: 'Show all bootcamp', hello: req.hello }); */

// @desc     Get single bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = async (req, res, next) => {
	// res.status(200).json({ success: true, msg: `Get Bootcamp ${req.params.id}` });
	try {
		const bootcamp = await Bootcamp.findById(req.params.id);

		if (!bootcamp) {
			return res.status(400).json({ success: false });
		}

		res.status(200).json({ success: true, data: bootcamp });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access   Public
exports.createBootcamp = async (req, res, next) => {
	//console.log(req.body);
	// res.status(200).json({ success: true, msg: 'create new bootcamp' });
	// Bootcamp.create(req.body).then(data => )  this also works

	try {
		const bootcamp = await Bootcamp.create(req.body);

		res.status(201).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		res.status(400).json({ success: false });
	}

};

// @desc     Update bootcamps
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true, // because we get a response for a new data
			runValidators: true // run mongoose validators on update
		});

		if (!bootcamp) {
			return res.status(400).json({ success: false });
		}

		res.status(200).json({ success: true, data: bootcamp });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

// @desc     Delete bootcamps
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

		if (!bootcamp) {
			return res.status(400).json({ success: false });
		}

		res.status(200).json({ success: true, data: {} });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};
