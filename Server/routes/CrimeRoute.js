const express = require('express');
const router = express.Router();
const crimeData = require('../data/CrimeData');

//Search for all crimes in the tri-state area
router.get('/tri-state', async (req, res) => {
    const response = await crimeData.showAllTriStateResults()
    res.json(response);
});


//Search for all crimes within a given state and city/county
router.get('/search', async (req, res) => {
    const state = req.query.state;
    const city = req.query.city;
    const county = req.query.county;

    if(!state || state.trim() === ""){
        return res.status(404).send(
            {
                error: "Bad request",
                message: "The 'state' query parameter is required"
            }
        );

    }

    else if(city && city.trim() !== "") {
        const response = await crimeData.showCrimesByCity(city.trim(),state);
        return res.json(response);
    }

    else if (county && county.trim() !== "") {
        const response = await crimeData.showCrimesByCity(county.trim(),state);
        return res.json(response);
    }

    else{
        return res.status(404).send(
            {
                error: "Bad request",
                message: " The 'city/county' query parameter is required "
            }
        );
    }
})

module.exports = router;
