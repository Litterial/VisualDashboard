const express = require('express');
const locationData = require('../data/LocationData');
const router = express.Router();


router.get('/', async (req, res) => {
    const response = await locationData.showAllStates()
    res.json(response);
})

router.get('/filter', async (req, res) => {
    const state = req.query.state;

    if(!state || state.trim() === ""){
        return res.status(404).send(
            {
                error: "Bad request",
                message: "The 'state' query parameter is required"
            }
        );
    }

    const response = await locationData.filterByCityByState(state.trim());
    return res.json(response);



})
module.exports = router;
