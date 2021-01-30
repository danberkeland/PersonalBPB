import React from 'react';
import { useContext } from 'react';
import { CustDateRecentContext } from '../dataContexts/CustDateRecentContext';
import { CustomerContext } from '../dataContexts/CustomerContext';
import { OrdersContext } from '../dataContexts/OrdersContext';
import { ProductsContext } from '../dataContexts/ProductsContext';



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

const interpretEntry = (entry, customers, products) => {
  const newCust = checkForCustomer(entry, customers);
  const newJSDate = checkForDateOrDay(entry);
  const newProductsArray = checkForProducts(entry, products);
  return [newCust, newJSDate, newProductsArray];
};





const OrderCommandLine = () => {

  const { customers } = useContext(CustomerContext)
  const { products } = useContext(ProductsContext)
  const { setChosen, setDelivDate } = useContext(CustDateRecentContext)
  const { orders, setThisOrder } = useContext(OrdersContext)

  const handleInput = (entry) => {
    if (entry.key === "Enter") {
      let [cust, JSdate, prodArray] = interpretEntry(entry.target.value, customers, products)
      processEntry(cust, JSdate, prodArray)
      document.getElementById("orderCommand").value = ''; //clear the command line
    }      
  };

  const processEntry = (cust, JSdate, prodArray) => {
    if (cust) {setChosen(cust)};
    if (JSdate) {setDelivDate(JSdate)};
    if (prodArray) {
      for (let prod of prodArray) {
        setThisOrder(...orders,prod)
      }
    }
    };
  
  
  return (        
    <div className = "orderCommandLine">
      <input type="text" id="orderCommand" name="orderCommand" onKeyUp={e => handleInput(e)}></input>
    </div>     
  );
}

export default OrderCommandLine;
