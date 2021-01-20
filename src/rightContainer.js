import React from 'react';
import './rightContainer.css';

function rightContainer() {
  return (   
    <div className = "rightContainer">
      <h1>Recent Orders</h1>
      <div className = "recentOrdersList">      
        <p>1/20/2020 Novo</p>
        <p>1/20/2020 Coastal Peaks</p>
        <p>1/20/2020 Linnaea's</p>
        <p>1/20/2020 Kreuzberg</p>
        <p>1/20/2020 Kraken Avila</p>
      </div>
      <button>Upload</button>
      <button>Reomve Selected</button>
    </div>   
  );
}

export default rightContainer;
