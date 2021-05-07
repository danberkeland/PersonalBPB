

import DatabaseFetchers from './databaseFetchers';

const databaseFetchers = new DatabaseFetchers();

export default class DatabaseServices {
  getProducts() {
    const prom = new Promise((resolve, reject) => {
      resolve(databaseFetchers.fetchProducts());
    });
    return prom;
  }
}
