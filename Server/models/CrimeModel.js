const mongoose = require("mongoose");
const crimeSchema = new mongoose.Schema({
    location: {
        type:{
            city: {
                type: String,
                required: true,
                trim: true
            },
            state: {
                name:{
                    type: String,
                    required: true,
                    trim: true
                },
                abbreviation:{
                    type: String,
                    required: true,
                    trim: true
                }

            },
            county: {
                type: String,
                required: true,
                trim: true
            },
        },
        required: true
    },
    convict: {
        type:{
            firstName:{
                type: String,
                required: true,
                trim: true
            },

            middleName:{
                type: String,
                required: false,
                trim: true
            },

            lastName:{
                type: String,
                required: true,
                trim: true
            },

            dateOfBirth:{
                type: Date,
                required: true,
                validate: [
                    {
                        validator: date => {
                            return date <= new Date();
                        },
                        message: date => `Cannot select a date in the future`
                    },
                    {
                        validator: date => {
                            var today = new Date();
                            today.setFullYear(today.getFullYear() - 18);
                            return date < today;
                        },
                        message: data => `Cannot arrest anyone under 18 `
                    }
                ]

            },
            address: {
                type:{
                    street1: {
                        type: String,
                        required: true,
                        trim: true
                    },

                    street2: {
                        type: String,
                        required: false,
                        trim: true
                    },

                    city: {
                        type: String,
                        required: true,
                        trim: true
                    },

                    state: {
                        type: String,
                        required: true,
                        trim: true
                    },

                    postalCode: {
                        type: String,
                        required: true,
                        trim: true
                    },

                    country: {
                        type: String,
                        required: true,
                        trim: true
                    },
                },
                required: true

            },
                //TODO: Consider adding crypto to encrypt user passwords
            ssn:{
                    type: String,
                    required: true,
                    trim: true,
                    validate:{
                        //Regex for without or without hyphens
                        validator: ssn =>{
                            const clean = ssn ? ssn.replace(/[-\s]/g, '') : '';
                            return /^\d{9}/.test(clean);
                        },
                        message: props => `${props.value} is not a valid SSN format`
                    },
                    //Stores SSN without hypten
                    set: ssn => ssn ? ssn.replace(/[-\s]/g, '') : ''

                }

            },
        required:true
    },

    category:{
        type:{
            primary:{
                type: String,
                required: true,
                trim: true
            },
            secondary:{
                type: String,
                required: true,
                trim: true
            }
        },
        required:true
    },

    dateOccurrence:{
        type: Date,
        required: true
    },

    dateEntered:{
        type: Date,
        required: true,
        default: () => Date.UTC(Date.now())
    },

    dateModified:{
        type: Date,
        required: false
    }

});


// Create and export the CrimeModel Model based on the schema
const CrimeModel = mongoose.model('Crimes', crimeSchema,)


module.exports = CrimeModel;