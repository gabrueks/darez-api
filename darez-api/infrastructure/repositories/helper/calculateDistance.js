module.exports = ({ lat, lng }) => (
  `(6371 * acos(cos(radians(${lat}))
      * cos(radians(latitude)) * cos(radians(${lng}) - radians(longitude))
      + sin(radians(${lat})) * sin(radians(latitude))))`
);
