/* eslint-disable */
const distanceBetweenCoords = require("./distanceBetweenCoords");
/**
 * Filter datas of an array considering the distance between latitude/longitude of each other
 *
 * @param {*} data array with datas get from database, they must contain {_geoloc.lat, _geoloc.lng}
 * @param {*} latitude latidade that will be compared
 * @param {*} longitude  longitude that will be compared
*/
module.exports = (data, latitude, longitude) => {
    return data.filter(item => 
            distanceBetweenCoords(item.latitude, item.longitude, latitude, longitude) <= item.delivery_range);
};
