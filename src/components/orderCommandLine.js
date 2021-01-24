import React from 'react';


function orderCommandLine() {

  const handleInput =(e) => {
      if (e.key === "Enter") {
        console.log("Oh yeah!")
      }
      
  }

  return (        
    <div className = "orderCommandLine">
    <label>Entry:</label>
      <input type="text" id="orderCommand" name="orderCommand" onKeyUp={e => handleInput(e)}></input>
    </div>     
  );
}

export default orderCommandLine;
