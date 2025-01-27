const { CloudantV1 } = require("@ibm-cloud/cloudant");
const client = CloudantV1.newInstance({});

const plantedCrops = "plantedCrops";
const cropProductionForecast = "cropProductionForecast";
const LOT_DB = "lot-areas";
//
// client.postAllDocs({
//     db: LOT_DB,
//     includeDocs: true,
//     limit: 10,
// }).then(response => {
//     console.log(response.result.rows.map(f => f.doc.properties.data.crops_planted[0]));
// }).catch((e) => console.log(e));

client.headDesignDocument({
    db: LOT_DB,
    ddoc: plantedCrops,
}).then((response) => {
    console.log(plantedCrops + " view already exists: ", response.status);
    // const rev = response.headers["etag"].replace("\"", "").replace("\"", "");
    // client.deleteDesignDocument({
    //     db: LOT_DB,
    //     ddoc: plantedCrops,
    //     rev: rev,
    // }).then(response => {
    // // getOverallCropDistribution();
    //     createOverallCropDistributionView();
    // }).catch(reason => console.log(reason));
}).catch(e => {
    if (e.status === 404) {
        createOverallCropDistributionView();
    } else {
        console.log(e);
    }
});

const plantedAreaView = "cropPlantedArea";
const cropProductionByMonthView = "cropProductionByMonth";

function createOverallCropDistributionView() {
    const overallCropDistributionMap = {
        map: "function(doc) {" +
            "    if (doc.properties && doc.properties.data && doc.properties.data.crops_planted) {\n" +
            "        var len = doc.properties.data.crops_planted.length; " +
            "        var plantedCrop; " +
            "        for(var i=0; i < len; i++) { " +
            "            if (doc.properties.data.crops_planted[i].harvested == null) { plantedCrop = doc.properties.data.crops_planted[i]; break;} " +
            "        }\n" +
            "        if (plantedCrop) {\n" +
            "            emit(plantedCrop.crop.name, doc.properties.Area_Ha);\n" +
            "        } else {\n" +
            "            emit('Empty', doc.properties.Area_Ha);\n" +
            "        }\n" +
            "    } else {\n" +
            "        emit('Empty', doc.properties.Area_Ha);\n" +
            "    }" +
            "}",
        reduce: "_sum",
    };

    const designDoc = {
        views: {cropPlantedArea: overallCropDistributionMap},
        // indexes: {cropPlantedArea: cropIndex},
    };

    client.putDesignDocument({
        db: LOT_DB,
        designDocument: designDoc,
        ddoc: plantedCrops,
    }).then(response => {
        console.log(plantedCrops + " view is created: ", response.result);
        // client.postView({
        //     db: LOT_DB,
        //     ddoc: plantedCrops,
        //     view: plantedAreaView,
        //     group: true,
        // }).then(response => {
        //     console.log(response.result.rows);
        // }).catch(e => console.log(e));
    }).catch((e) => console.log(e));
}

client.headDesignDocument({
    db: LOT_DB,
    ddoc: cropProductionForecast,
}).then((response) => {
    console.log(cropProductionForecast + " view already exists: ", response.status);
    // const rev = response.headers["etag"].replace("\"", "").replace("\"", "");
    // client.deleteDesignDocument({
    //     db: LOT_DB,
    //     ddoc: cropProductionForecast,
    //     rev: rev,
    // }).then(response => {
    //     // getOverallCropDistribution();
    //     createCropProductionForecastView();
    // }).catch(reason => console.log(reason));
}).catch(e => {
    if (e.status === 404) {
        createCropProductionForecastView();
    } else {
        console.log(e);
    }
});

function createCropProductionForecastView() {
    const map = {
        map: "function(doc) {" +
            "    if (doc.properties && doc.properties.data && doc.properties.data.crops_planted) {\n" +
            "        var len = doc.properties.data.crops_planted.length; " +
            "        var plantedCrop; " +
            "        for(var i=0; i < len; i++) { " +
            "            if (doc.properties.data.crops_planted[i].harvested == null) { plantedCrop = doc.properties.data.crops_planted[i]; break;} " +
            "        }\n" +
            "        if (plantedCrop) {\n" +
            "            var d = new Date(plantedCrop.planted); d.setHours(0,0,0,0); " +
            "            d.setDate(d.getDate() + plantedCrop.crop.time_to_harvest);" +
            "            emit([new Date(d.getFullYear(), d.getMonth(), 1), plantedCrop.crop.name], doc.properties.Area_Ha * plantedCrop.crop.yield /10000);\n" +
            "        }\n" +
            "    }" +
            "}",
        reduce: "_sum",
    };

    const designDoc = {
        views: {cropProductionByMonth: map},
    };

    client.putDesignDocument({
        db: LOT_DB,
        designDocument: designDoc,
        ddoc: cropProductionForecast,
    }).then(response => {
        console.log(plantedCrops + " view is created: ", response.result);
        // client.postView({
        //     db: LOT_DB,
        //     ddoc: cropProductionForecast,
        //     view: "cropProductionByMonth",
        //     groupLevel: 2,
        // }).then(response => {
        //     console.log(response.result.rows);
        // }).catch(e => console.log(e));
    }).catch((e) => console.log(e));
}

module.exports = {
    client,
    plantedCrops,
    cropProductionForecast,
    plantedAreaView,
    cropProductionByMonthView,
};
