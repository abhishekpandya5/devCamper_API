const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query;

	// Copy req.query
	const reqQuery = { ...req.query };

	// Fields to exclude
	const removeFields = ['select', 'sort', 'page', 'limit'];

	// Loop over removeFields and delete them from reqQuery
	removeFields.forEach(param => delete reqQuery[param]);

	// console.log(reqQuery);

	// Create query string
	let queryStr = JSON.stringify(reqQuery);

	// Create operators ($gt, $gte, $lt, $lte, etc)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

	// console.log(queryStr);

	// Finding resource
	query = Bootcamp.find(JSON.parse(queryStr));

	// Select Fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		// console.log(fields);
		query = query.select(fields);
	}

	// Sort
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	}
	else {
		query = query.sort('-createdAt');
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();

	query = query.skip(startIndex).limit(limit);

	// Executing query
	const bootcamps = await query;

	// Pagination result 
	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit
		}
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit
		}
	}

	res.status(200)
		.json({ success: true, count: bootcamps.length, pagination, data: bootcamps });

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


// @desc     Get bootcamps within a radius
// @route    GET /api/v1/bootcamps/radius/:zipcode/:distance	
// @access   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat/lng from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lng = loc[0].longitude;
	const lat = loc[0].latitude;

	// Earth equitorial radius 6,378 Km or 3,963 Mi

	// Calc radius in radians = divide distance by radius of earth
	const radius = distance / 6378;

	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
	});

	console.log(bootcamps);

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps
	});

});