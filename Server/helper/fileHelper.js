//Dependency to handle multipart/form-data requests
const multer = require('multer');


const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => (file.mimetype ==='text/csv') ? callback(null, file) : callback(new Error('No csv file uploaded'),false);
const limits = {fileSize: 1024 * 1024 * 10};

const uploadCSV = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: limits,
    });


module.exports = uploadCSV;

