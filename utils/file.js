const fs = require('fs');

module.exports = {
    deleteFile(path) {
        if (!path) {
            return
        }

        fs.unlink(path, (err) => {
            if (err) {
                throw (err);
            }
        })
    }
}