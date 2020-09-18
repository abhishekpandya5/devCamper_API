const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middlewares/advancedResults');

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

router
  .route('/:id/photo')
  .put(bootcampPhotoUpload);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;

/* router.get('/', (req, res) => {
  // res.send('<h1>Hello from express</h1>');
  //res.json({ name: "Abhishek" });
  // res.sendStatus(400);
  res.status(200).json({ success: true, msg: 'All Bootcamp data' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Get Bootcamp ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'create new bootcamp' });
});

router.put('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update Bootcamp ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete Bootcamp ${req.params.id}` });
}); */
