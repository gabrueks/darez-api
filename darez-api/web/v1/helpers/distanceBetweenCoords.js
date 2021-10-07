/* eslint-disable */
/**
 * Compare distance between 4 coodinates points
 * 
 * @param {lat1} lat1 - latitude received from Algolia's search initial
 * @param {lon1} lon1 - longitude received from Algolia's search final
 * @param {lat2} lat2 - latitude informed that will be used to compare distance 
 * @param {lon2} lon2 - longitude informed that will be used to compare distance
 */
module.exports = (lat1, lon1, lat2, lon2) => {
    const p = 0.017453292519943295;// Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2
        + c(lat1 * p) * c(lat2 * p)
        * ((1 - c((lon2 - lon1) * p)) / 2);
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};
