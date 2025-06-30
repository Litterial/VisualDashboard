const express = require('express');
const crimeData = require('../data/CrimeData');
const uploadCSV = require('../helper/fileHelper');
const csv = require('csv-parser');
// Node.js built-in for streams
const { Readable } = require('stream');

const router = express.Router();

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
        const response = await crimeData.showCrimesByCity(city.trim(),state.trim());
        return res.json(response);
    }
    else if (county && county.trim() !== "") {
        const response = await crimeData.showCrimesByCounty(county.trim(),state.trim());
        return res.json(response);
    }
    else {
        const response = await crimeData.showCrimesByState(state.trim());
        return res.json(response);
    }
})

//Bulk insert of crimes via csv
// crimeFile is name attribute for input field for the file
router.post('/upload-crimes-csv', uploadCSV.single("crimeFile"),async (req, res) => {
    if(!req.file)
        return res.status(400).send({error: "Bad request",message:"No .cvs file uploaded"});

    //file content exist in buffer
    const csvBuffer = req.file.buffer;
    const results = []

    //Create a readable stream from the buffer
    try {
        const readableStream = new Readable();
        //When a new ReadableStream is initialized; it's required to have an implementation of _read() function even though it won't b used
        readableStream._read = () => {}

        //injects entire cvs data into a readable stream
        readableStream.push(csvBuffer);

        //signals there is no more data to come
        readableStream.push(null);


        //Pipe the buffer to stream to csv-parser
        readableStream
            .pipe(csv())
            .on('data', data => {
                //transform the data in nested objects
                const transformedData = {
                    location: {
                        city: data['location.city'],
                        state: {
                            name:data['location.state.name'],
                            abbreviation:data['location.state.abbreviation'],
                        },
                        county: data['location.county'],
                    },
                    convict: {
                        firstName: data['convict.firstName'],
                        middleName: data['convict.middleName'] || null, // Handle optional fields
                        lastName: data['convict.lastName'],
                        dateOfBirth: new Date(data['convict.dateOfBirth']) ,
                        address: {
                            street1: data['convict.address.street1'],
                            street2: data['convict.address.street2'] || null,
                            city: data['convict.address.city'],
                            state: data['convict.address.state'],
                            postalCode: data['convict.address.postalCode'],
                            country: data['convict.address.country'],
                        },
                        ssn: data['convict.ssn'],

                    },
                    category: {
                        primary: data['category.primary'],
                        secondary: data['category.secondary'],
                    },
                    dateOccurrence: new Date(data['dateOccurrence']),
                    dateEntered:  new Date(data['dateEntered']),
                    dateModified: data['dateModified'] ? new Date(data['dateModified']) : null,
                };
                results.push(transformedData);
            })
            // Return a message based on how many entries succeeded
            .on('end', async() => {
                console.log('CSV data parsed from memory. Total rows:', results.length);
                await crimeData.bulkInsert(results);
                res.status(200).json({
                    message: 'CSV data parsed from memory'
                })
            })

            .on('error', error => {
                res.status(500).json({
                    error: "Internal Server Error",
                    message: 'Error processing CSV from memory',
                    details: error.message
                });
            })


    } catch (error){
        res.status(500).json({
            error: "Internal Server Error",
            message: 'An unexpected error occurred',
            details: error.message
        });
    }
})



module.exports = router;
