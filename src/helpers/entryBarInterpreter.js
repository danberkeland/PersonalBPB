

export const interpretEntry = (entry, customers, products) => {
    const newCust = checkForCustomer(entry, customers);
    const newJSDate = checkForDateOrDay(entry);
    const newProductsArray = checkForProducts(entry, products);
    return [newCust, newJSDate, newProductsArray];
  };



  export const checkForCustomer = (entry, customers) => {
    let nextCustomer = '';
    for (let cust of customers) {
      if (entry.includes(cust[2]) /*Full name*/ || entry.includes(cust[0]) /* Nickname */) {
        nextCustomer = cust[2]; /*Full name*/
        document.getElementById("customers").value = cust[2]; /*Full name*/
      };
    };
    return nextCustomer;
  };



  export const checkForDateOrDay = (entry) => {
    return false
  };



  export const checkForProducts = (entry, products) => {
    return false
  }

