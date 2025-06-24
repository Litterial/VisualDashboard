const Crime = require('../models/CrimeModel')

class CrimeData {
    //Returns all results in a city
     showCrimesByCity = async (city,state) => {
        const query = {city:city,state:state}
        const results =  await Crime.find(query)
        return results

    };


    //Returns all results within a county
        showCrimesByCounty = async (county,state) => {
            const query = {county:county,state:state};
            const results =  await Crime.find(query);
            return results;
        };


    //Returns all Results within Tri-State area
         showAllTriStateResults = async () => {
            //const results = await Crime.find().all('location.state',['TN,MS,AK'])
             const results = await Crime.find()

             return results;

        }
}

module.exports = new CrimeData();