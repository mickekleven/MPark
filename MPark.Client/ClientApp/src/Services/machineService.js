import { apiRoutes } from "../helpers/apiUrls";
import { getMachines, getHeaderOption, fetchFromApi, postToApi } from "../helpers/fetchClient";

//**************************************
// Gets machines from api
//**************************************
export const GetMachines = async () => {
  let response;
  const url = getUrl("get");
  const options = getHeaderOption("GET");

  var _response = await fetchFromApi(url, options).then((data) => {
    response = data;
  });

  return response;
};

//**************************************
// Insert machines on api
//**************************************
export const InsertMachine = async (formData) => {
  let response;

  const url = getUrl("post");
  const options = getHeaderOption("POST", formData);

  var insertResult = await postToApi(url, options).then((data) => {
    response = data;
  });

  return response;
};

//**************************************
// Update machine on api
//**************************************
export const UpdateMachine = async (formData) => {
  let response;
  const url = getUrl("put", formData.id);
  const options = getHeaderOption("PUT", formData);
  var updateResult = await postToApi(url, options).then((data) => {
    response = data;
  });

  return response;
};

export const UpdateToggleOnOff = async (formData, id) => {
  let response;
  const url = getUrl("puttoggleonoff", id);
  const options = getHeaderOption("put", formData);

  var updateResult = await postToApi(url, options).then((data) => {
    response = data;
  });

  return response;
};

//**************************************
// Delete machine on api
//**************************************
export const DeleteMachine = async (id) => {
  let response;
  const url = getUrl("delete", id);
  const options = getHeaderOption("delete");

  var updateResult = await postToApi(url, options).then((data) => {
    response = data;
  });
  return response;
};

// Gets target api url
function getUrl(httpMethod, id) {
  switch (httpMethod.toLowerCase()) {
    case "get":
      return apiRoutes.get_engineparks;
    case "put":
      return apiRoutes.update_enginepark + "/" + id;
    case "post":
      return apiRoutes.insert_enginepark;
    case "delete":
      return apiRoutes.delete_enginepark + "/" + id;
    case "puttoggleonoff":
      return apiRoutes.update_toggleOnOff + "/" + id;
    default:
      return "";
  }
}
