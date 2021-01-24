import React,{ useContext } from 'react';
import { CustomerContext } from '../dataContexts/CustomerContext';

function OrderCommandLine() {

  const [customers, setCustomer, chosen, setChosen] = useContext(CustomerContext);

  const checkForCustomerName = (entry) => {
    for (let cust of customers) {
      console.log(cust[2])
      if (entry.includes(cust[2]) || entry.includes(cust[0])) {
        setChosen(cust[2]);
        document.getElementById("customers").value = cust[2];
      };
    };
  };

  const handleInput =(e) => {
      if (e.key === "Enter") {
        checkForCustomerName(e.target.value)
        document.getElementById("orderCommand").value = '';
      }      
  }

  return (        
    <div className = "orderCommandLine">
    <label>Entry:</label>
      <input type="text" id="orderCommand" name="orderCommand" onKeyUp={e => handleInput(e)}></input>
    </div>     
  );
}

export default OrderCommandLine;
