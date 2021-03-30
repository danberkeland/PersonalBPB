exports.handler = async (event) => {
  const { Client, Environment } = require("square");

  const { DateTime } = require("luxon");

  const client = new Client({
    environment: Environment.Production,
    accessToken:
      "EAAAEdTuE6f3UzTm7RBBPWa9SXM2AsBGbI9qz4wrf8ATEL9bW5AT0Weqt4zBugjE",
  });

  const yesterdayRFCDate = DateTime.now()
    .setZone("America/Los_Angeles")
    .toRFC2822();
  const tomorrowRFCDate = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: 1 })
    .toRFC2822();

  try {
    const response = await client.ordersApi.searchOrders({
      locationIds: ["16VS30T9E7CM9", "KTQGYHG092NK8"],
      query: {
        filter: {
          date_time_filter: {
            created_at: {
              start_at: yesterdayRFCDate,
              end_at: tomorrowRFCDate,
            },
          },
          fulfillment_filter: {
            fulfillment_types: ["PICKUP"],
          },
        },
      },
    });

    console.log(response.result);
  } catch (error) {
    console.log(error);
  }

  const response = {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
