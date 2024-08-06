const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js'); 
const reviewsRouter = require('./reviews.js'); 
const bookingRouter = require('./bookings.js');
const spotImagesRouter = require('./spot-images.js');
const reviewImagesRouter = require('./review-images.js');

// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');
router.use(restoreUser);


router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
// router.use('/bookings',bookingRouter);
// router.use('/spot-images',spotImagesRouter);
// router.use('/review-images',reviewImagesRouter);



router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
});


module.exports = router;


//----------------auth me setup testing phrase------------------//

// GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// router.post('/test', function (req, res) {
    // test in the browser's devtools console.phase-1
    // fetch('/api/test', {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "XSRF-TOKEN": "sPVbz7xd-5DMsDGhmFN0HMg8q0j1GyUnbzrk"
    //     },
    //     body: JSON.stringify({ hello: 'world' })
    // }).then(res => res.json()).then(data => console.log(data));

//     res.json({ requestBody: req.body });

// });

// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );


module.exports = router;