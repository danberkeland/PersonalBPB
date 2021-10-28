
const axios = require("axios");

exports.handler = async (event, context) => {
  let access = event.accessCode;
  let custo = event.customer;
  let baseURL = "https://quickbooks.api.intuit.com/v3/company/480063645/";
  let version = "%20&minorversion=4&format=json"; //OPTIONAL ADDON TO URL

  let promise = await axios({
    method: "get",
    url:
      baseURL +
      "query?query=select%20%2A%20from%20customer%20where%20DisplayName%20%3D%20%27" +
      custo +
      "%27",
    responseType: "application/json",
    headers: {
      Authorization: access,
    },
  }).then((data) =>
    JSON.stringify(Number(data.data.QueryResponse.Customer[0].Id))
  );

  return promise;
};
