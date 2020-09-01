const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.find();

	res
		.status(200)
		.json({ success: true, count: bootcamps.length, data: bootcamps });
	/* try {
			const bootcamps = await Bootcamp.find();
	
			res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
		} catch (err) {
			next(err);
		} */
});
/* res
    .status(200)
    .json({ success: true, msg: 'Show all bootcamp', hello: req.hello }); */

// @desc     Get single bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	// res.status(200).json({ success: true, msg: `Get Bootcamp ${req.params.id}` });

	const bootcamp = await Bootcamp.findById(req.params.id);

	// if it is not a formatted id and not in database
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });

	/* try {
		const bootcamp = await Bootcamp.findById(req.params.id);
		// if it is not a formatted id and not in database
		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		}
		res.status(200).json({ success: true, data: bootcamp });
	} catch (err) {
		// if it is not a formatted id
		next(err);
	} */
});

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access   Public
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	//console.log(req.body);
	// res.status(200).json({ success: true, msg: 'create new bootcamp' });
	// Bootcamp.create(req.body).then(data => )  this also works

	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({
		success: true,
		data: bootcamp,
	});

	/* try {
		const bootcamp = await Bootcamp.create(req.body);

		res.status(201).json({
			success: true,
			data: bootcamp,
		});
	} catch (err) {
		next(err);
		// next(new ErrorResponse(`Bootcamp cannot be created with same name ${req.body.name}`, 404));
	} */
});

// @desc     Update bootcamps
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true, // because we get a response for a new data
		runValidators: true, // run mongoose validators on update
	});

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });

	/* try {
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true, // because we get a response for a new data
			runValidators: true // run mongoose validators on update
		});

		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		}

		res.status(200).json({ success: true, data: bootcamp });
	} catch (err) {
		// res.status(400).json({ success: false });
		next(err);
	} */
});

// @desc     Delete bootcamps
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: {} });

	/* try {
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		}

		res.status(200).json({ success: true, data: {} });
	} catch (err) {
		next(err);
	} */
});
