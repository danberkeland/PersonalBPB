import { listProducts } from "../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { sortAtoZDataByIndex } from "../../helpers/sortDataHelpers";

export default class DatabaseFetchers {

    fetchProducts = async () => {
        try {
          const prodData = await API.graphql(
            graphqlOperation(listProducts, { limit: "500" })
          );
          const prodList = prodData.data.listProducts.items;
          sortAtoZDataByIndex(prodList, "prodName");
          return prodList;
        } catch (error) {
          console.log("error on fetching Product List", error);
        }
      };
      
}

