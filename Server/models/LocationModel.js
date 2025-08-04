const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
        city:{
            type: String,
            required: true,
            trim: true
        },
        county:{
            type: String,
            required: true,
            trim: true
        },

        state:{
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
        }
    })
const LocationModel = mongoose.model('Locations', locationSchema);
module.exports = LocationModel;