const Crime = require('../models/CrimeModel')

class CrimeData {
    //Returns all results in a city
     showCrimesByCity = async (city,state) => {
        const query = {'location.city':city,'location.state.abbreviation':state}
        const results =  await Crime.find(query)
            .then((a) => a)
            .catch(err => console.log("error", err));

        return results

    };


    //Returns all results within a county
        showCrimesByCounty = async (county,state) => {
            const query = {'location.county':county,'location.state.abbreviation':state};
            const results =  await Crime.find(query)
                .then((a) => a)
                .catch(err => console.log("error", err));

            return results;
        };

        showCrimesByState = async state => {
            const query = {'location.state.abbreviation':state};
            const results =  await Crime.find(query)
                .then((a) => a)
                .catch(err => console.log("error", err));
            return results;
        }


    //Returns all Results within Tri-State area
         showAllTriStateResults = async () => {
            const triStates = ["TN","MS","AR"];

            const results = await Crime.find({'location.state.abbreviation': {$in: triStates}})
             .then((a) => a)
             .catch(err => console.log("error", err));

             return results;

        }


    //Inserts many records into collection
    //TODO return success or error data
        bulkInsert = async data => {

            const results = await Crime.insertMany(data)
                .then(a => a)
                .catch(err => console.log("error", err));
        };
}

module.exports = new CrimeData();