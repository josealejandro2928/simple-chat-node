const path = require('path');
const fs = require('fs');
const util = require('util');

module.exports = {
    async loadModules() {
        const rootName = path.dirname(require.main.filename);
        const directoryModulesPath = path.join(rootName, 'modules');
        const readdirPromise = util.promisify(fs.readdir);
        let files = [];
        try {
            files = await readdirPromise(directoryModulesPath);
            for (let file of files) {
                let fullPath = path.join(directoryModulesPath, file, 'index');
                ////////////////////////CARGO EL MÓDULO////////////////////////
                require(fullPath)();
            }
        } catch (err) {
            console.log("******Error cargando los módulos**********")
            console.log(err);
        }
        readdirPromise(directoryModulesPath)
    }

}