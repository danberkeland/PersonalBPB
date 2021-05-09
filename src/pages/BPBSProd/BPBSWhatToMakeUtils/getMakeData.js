import {
  fetchProducts,
  fetchCustomers,
  fetchRoutes,
  fetchStanding,
  fetchOrders,
} from "../../../helpers/databaseFetchers";

export const promisedMakeData = (setIsLoading) => {
  const all = new Promise((resolve, reject) => {
    resolve(fetchMakeData(setIsLoading));
  });
  return all;
};

const fetchMakeData = async (setIsLoading) => {
  setIsLoading(true)
  let products = await fetchProducts();
  let customers = await fetchCustomers();
  let routes = await fetchRoutes();
  let standing = await fetchStanding();
  let orders = await fetchOrders();
  let data = [products, customers, routes, standing, orders];
  setIsLoading(false)
  return data;
};
