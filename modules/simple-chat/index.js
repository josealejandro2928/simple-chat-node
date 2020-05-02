module.exports = function loadModule() {
    ///////////////LOAD MODELS///////////////
    require('./models/index')()
    ////////////////////////////////////////

    ///////////REGISTRY ROUTES/////////////
    require('./routes/registry')()
    /////////////////////////////////////
    console.log("Cargado el módulo:", "SimpleChat")

}