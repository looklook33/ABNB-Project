// backend/routes/api/index.js
const router = require('express').Router();

router.post('/test', function (req, res) {
    // test in the browser's devtools console.phase-1
    // fetch('/api/test', {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "XSRF-TOKEN": "sPVbz7xd-5DMsDGhmFN0HMg8q0j1GyUnbzrk"
    //     },
    //     body: JSON.stringify({ hello: 'world' })
    // }).then(res => res.json()).then(data => console.log(data));

    res.json({ requestBody: req.body });

});



module.exports = router;