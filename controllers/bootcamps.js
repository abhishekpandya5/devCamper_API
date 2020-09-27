const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

	res.status(200).json(res.advancedResults);

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

	// add current logged in user to req.body
	req.body.user = req.user.id;

	// Check for published bootcamp
	const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

	// if user is not admin, they can only add one bootcamp
	if (publishedBootcamp && req.user.role !== 'admin') {
		return next(new ErrorResponse(`User with id ${req.user.id} has already published a bootcamp`, 400));
	}

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
	let bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	// Make sure user is bootcamp owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User with id ${req.params.id} is not authorized to update this bootcamp`, 401
			)
		);
	}

	bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true, // because we get a response for a new data
		runValidators: true, // run mongoose validators on update
	});

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
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	// Make sure user is bootcamp owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User with id ${req.params.id} is not authorized to delete this bootcamp`, 401
			)
		);
	}

	bootcamp.remove();
	// this remove() method is used to trigger that middleware for cascade delete courses when a bootcamp is deleted.

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

// @desc     Upload photo for bootcamp
// @route    PUT /api/v1/bootcamps/:id/photo
// @access   Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	// Make sure user is bootcamp owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User with id ${req.params.id} is not authorized to update this bootcamp`, 401
			)
		);
	}

	if (!req.files) {
		return next(
			new ErrorResponse('Please upload a file', 400)
		);
	}

	console.log(req.files);

	const file = req.files['File Upload'];

	// Make sure the file is a photo
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse('Please upload an image file', 400));
	}

	// Check file size
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(`Please upload an image of size less than ${process.env.MAX_FILE_UPLOAD}`, 400)
		);
	}

	//  Create custom file name
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse('Problem with file upload', 500));
		}

		await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

		res.status(200).json({
			success: true,
			data: file.name
		});

	});
});