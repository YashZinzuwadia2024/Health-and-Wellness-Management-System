const cloudinary = require("../config/cloudinary");

module.exports = (filePath, options) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, options, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    })
}