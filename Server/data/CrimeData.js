const Crime = require('../models/CrimeModel')

class CrimeData {
    //Returns all results in a city
     showCrimesByCity = async (city,state) => {
        const query = {'location.city':city,'location.state':state}
        const results =  await Crime.find(query)
            .then((a) => a)
            .catch(err => console.log("error", err));

        return results

    };


    //Returns all results within a county
        showCrimesByCounty = async (county,state) => {
            const query = {'location.county':county,'location.state':state};
            const results =  await Crime.find(query)
                .then((a) => a)
                .catch(err => console.log("error", err));

            return results;
        };

        showCrimesByState = async state => {
            const query = {'location.state':state};
            const results =  await Crime.find(query)
                .then((a) => a)
                .catch(err => console.log("error", err));
            return results;
        }


    //Returns all Results within Tri-State area
         showAllTriStateResults = async () => {
            const triStates = ["TN","MS","AR"]
             const results = await Crime.find({'location.state':{ $in: triStates}})
                 .then((a) => a)
                 .catch(err => console.log("error", err));

             return results;

        }


    //Inserts many records into collection
        bulkInsert = async data => {

        };
}

module.exports = new CrimeData();