
const clonedeep = require("lodash.clonedeep");


export const FilterOrdersDups = (data) => {
  let groupedData = data.map((item) => [
    item["prodName"] + "_" + item["custName"] + "_" + item["delivDate"],
    item["qty"],
    item["SO"],
    item["isWhole"],
    item["timeStamp"],
    item["PONote"],
    item["route"],
  ]);

  for (let i = 0; i < groupedData.length; ++i) {
    for (let j = i + 1; j < groupedData.length; ++j) {
      while (groupedData[i][0] === groupedData[j][0]) {
        groupedData.splice(j, 1);
      }
    }
  }
  let newGroupedData = clonedeep(groupedData);
  let reassembledData = newGroupedData.map((item) => ({
    qty: item[1],
    prodName: item[0].split("_")[0],
    custName: item[0].split("_")[1],
    PONote: item[5],
    route: item[6],
    SO: item[2],
    isWhole: item[3],
    delivDate: item[0].split("_")[2],
    timeStamp: item[4],
  }));
  return reassembledData;
};

export const FilterDupsByIndex = (data, ind) => {
  for (let i = 0; i < data.length; ++i) {
    for (let j = i + 1; j < data.length - 1; ++j) {
      while (data[i][ind] === data[j][ind]) {
        data.splice(j, 1);
      }
    }
  }

  return data;
};

export const FilterStandHoldDups = (data) => {
  let groupedData = data.map((item) => [
    item["dayNum"].toString() + "_" + item["prodName"] + "_" + item["custName"],
    item["qty"],
    item["SO"],
    item["timeStamp"],
  ]);

  for (let i = 0; i < groupedData.length; ++i) {
    for (let j = i + 1; j < groupedData.length - 1; ++j) {
      while (groupedData[i][0] === groupedData[j][0]) {
        groupedData.splice(j, 1);
      }
    }
  }

  let reassembledData = groupedData.map((item) => ({
    dayNum: Number(item[0].split("_")[0]),
    qty: item[1],
    SO: item[2],
    timeStamp: item[3],
    prodName: item[0].split("_")[1],
    custName: item[0].split("_")[2],
  }));
  return reassembledData;
};

