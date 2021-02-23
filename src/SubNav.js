import React, { useContext } from 'react';

import { TabMenu } from 'primereact/tabmenu';



import swal from '@sweetalert/with-react';

import 'primereact/resources/themes/bootstrap4-light-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


import { OrdersContext } from './dataContexts/OrdersContext';

function SubNav() {

   const { recentOrders } = useContext(OrdersContext)

   const handleChange = (page) => {
      if (recentOrders.length>0){
         swal ({
         text: "Recent Order entries will be lost.  Continue?",
         icon: "warning",
         buttons: true,
       }).then(choice => {
          if(choice){
            window.location = `/${page}`;
          }
       }) } else {
         window.location = `/${page}`;
       }
   }


   const subitems = [
      {label: 'BPBN'},
      {label: 'BPBS'},
      {label: 'Croix'},
  ];


 

  return (
      <div className = "card">
        <TabMenu model={subitems} />
      </div>          
  );
}

export default SubNav;
