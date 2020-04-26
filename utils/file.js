const fs = require('fs');

module.exports = {
    deleteFile(path) {
        fs.unlink(path, (err) => {
            if (err) {
                throw (err);
            }
        })
    }
}