import React from 'react';



function recentOrderList({chosen, orders}) {
  return (
      <React.Fragment>      
        <h2>Recent Orders</h2>
        <div className = "recentOrdersList">      
          <p>1/20/2020 Novo</p>
          <p>1/20/2020 Coastal Peaks</p>
          <p>1/20/2020 Linnaea's</p>
          <p>1/20/2020 Kreuzberg</p>
          <p>1/20/2020 Kraken Avila</p>
        </div>
        <button>Upload</button><br />
        <button>Remove Selected</button>
    </React.Fragment>  
  );
}

export default recentOrderList;
