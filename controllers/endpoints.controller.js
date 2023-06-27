const endpoints = require("../endpoints.json");

exports.getAllEndpoints = (request, response) => {
  const apiDocs = { ...endpoints };
  response.status(200).send(apiDocs);
};
