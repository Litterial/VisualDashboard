const Location = require('../models/LocationModel');
class LocationData {
    filterByCityByState = async state => {
        const query = {'state.abbreviation':state};
        const results = await Location.find(query)
            .then((a) => a)
            .catch(err => console.log("error", err));

        return results
    }

    showAllStates = async() => {
        const results = await Location.find()
            .then((a) => a) .then((a) => a)
            .catch(err => console.log("error", err));

        return results
    }
}

module.exports = new LocationData();