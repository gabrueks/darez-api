module.exports = (
  body, creator, latitude = null, longitude = null, userId, endpoint = null, isUpdate = false,
) => {
  const resp = { ...body };
  if (latitude && longitude) {
    resp.latitude = latitude;
    resp.longitude = longitude;
  }
  if (endpoint) {
    resp.user_id = userId;
    resp.endpoint = endpoint;
  }
  if (isUpdate) resp.updated_by = creator;
  else resp.created_by = creator;
  return resp;
};
