export const API_BASE = "https://mparkfuncapp.azurewebsites.net";

export const apiRoutes = {
  api_base: `${API_BASE}/api/machinepark`,
  get_enginepark: `${API_BASE}/api/machinepark/get`,
  get_engineparks: `${API_BASE}/api/machinepark/getall`,
  update_toggleOnOff: `${API_BASE}/api/machinepark/toggleonoffline`,
  update_enginepark: `${API_BASE}/api/machinepark/update`,
  delete_enginepark: `${API_BASE}/api/machinepark/delete`,
  insert_enginepark: `${API_BASE}/api/machinepark/insert`,
};
