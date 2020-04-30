const path = require('path');
const fs = require('fs');

module.exports = {
    processImageUpload(req, res, next) {
        var keyNames = ['image', 'imageUrl', 'logo', 'picture', 'photo'];
        var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

        if (req.method == "PATCH" || req.method == "PUT" || req.method == "POST") {
            // console.log("Body antes del procesamiento", req.body);
            try {
                for (let key in req.body) {
                    if (req.body[key] && req.body[key].constructor == String && keyNames.find(namesKey => (namesKey == key))) {
                        let base64Encoded = req.body[key].split(',')[1];
                        if (base64Encoded && base64regex.test(base64Encoded)) {
                            let {
                                path
                            } = saveImage(req.body[key]);
                            req.body[key] = path;
                        }
                    }
                }
                // console.log("Body despues del procesamiento", req.body);
                return next();
            } catch (err) {
                let error = new Error(err.message);
                error.statusCode = 500;
                throw (error);
            }
        } else {
            return next();
        }
    },
    saveBase64Image: saveImage
}

function saveImage(baseImage) {
    try {
        const rootName = path.dirname(require.main.filename);
        const directoryModulesPath = path.join(rootName, 'public');
        const uploadPath = directoryModulesPath;
        const localPath = `${uploadPath}/images/`;
        //Find extension of file
        const ext = baseImage.substring(baseImage.indexOf("/") + 1, baseImage.indexOf(";base64"));
        const fileType = baseImage.substring("data:".length, baseImage.indexOf("/"));
        //Forming regex to extract base64 data of file.
        const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
        //Extract base64 data.
        const base64Data = baseImage.replace(regex, "");
        const rand = Math.ceil(Math.random() * 1000);
        //Random photo name with timeStamp so it will not overide previous images.
        const filename = `Photo_${Date.now()}_${rand}.${ext}`;

        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath);
        }

        fs.writeFileSync(localPath + filename, base64Data, 'base64');
        return {
            filename,
            path: 'public/images/' + filename
        };
    } catch (error) {
        throw new Error(error);
    }
}