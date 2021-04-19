import { listDoughs, listDoughComponents } from "../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";

export const fetchDoughs = async (setDoughs) => {
  try {
    const doughData = await API.graphql(
      graphqlOperation(listDoughs, {
        limit: "50",
      })
    );
    const doughList = doughData.data.listDoughs.items;
    sortAtoZDataByIndex(doughList, "doughName");
    let noDelete = doughList.filter((dough) => dough["_deleted"] !== true);

    setDoughs(noDelete);
  } catch (error) {
    console.log("error on fetching Dough List", error);
  }
};

export const fetchDoughComponents = async (setDoughComponents) => {
  try {
    const doughData = await API.graphql(
      graphqlOperation(listDoughComponents, {
        limit: "50",
      })
    );
    const doughList = doughData.data.listDoughComponents.items;
    sortAtoZDataByIndex(doughList, "doughName");
    let noDelete = doughList.filter((dough) => dough["_deleted"] !== true);
    console.log(noDelete);
    setDoughComponents(noDelete);
  } catch (error) {
    console.log("error on fetching Dough List", error);
  }
};
