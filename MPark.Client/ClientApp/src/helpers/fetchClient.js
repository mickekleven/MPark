// Fetch from api.
export async function fetchFromApi(url, requestOptions) {
  const response = await fetch(url, requestOptions);
  try {
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Error message " + err.message);
  }
}

//Post to api
export async function postToApi(url, requestOptions) {
  try {
    const res = await fetch(url, requestOptions);
    if (res.ok) {
      const data = await res.json();
      return JSON.stringify(data);
    } else {
      return res.text().then((text) => {
        throw new Error(text);
      });
    }
  } catch (e) {
    console.error("Response error " + e.message);
  }
}

export const getHeaderOption = (method, formData) => {
  if (formData === undefined || formData === "") {
    return {
      method: method,
      headers: {
        "Content-Type": "application/json, charset=UTF-8",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  return {
    method: method,
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json, charset=UTF-8",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
};

// File uploading
export const getHeaderOptionFile = (method, formData) => {
  console.log(formData);

  if (formData !== undefined || formData !== null) {
    return {
      method: method,
      body: formData,
      headers: {
        //"Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
