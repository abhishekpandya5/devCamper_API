// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamp' });
};
/* res
    .status(200)
    .json({ success: true, msg: 'Show all bootcamp', hello: req.hello }); */

// @desc     Get bootcamp
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Get Bootcamp ${req.params.id}` });
};

// @desc     Create new bootcamps
// @route    POST /api/v1/bootcamps/:id
// @access   Public
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'create new bootcamp' });
};

// @desc     Update bootcamps
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update Bootcamp ${req.params.id}` });
};

// @desc     Delete bootcamps
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete Bootcamp ${req.params.id}` });
};
