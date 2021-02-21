import React, { useContext } from 'react';

import { Menubar } from 'primereact/menubar';

import swal from '@sweetalert/with-react';

import 'primereact/resources/themes/bootstrap4-light-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


import { OrdersContext } from './dataContexts/OrdersContext';

function Nav() {

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


   const items = [
    {
       label:'Menu',
       icon:'pi pi-fw pi-bars',
       items:[

          {
            label:'Production',
            icon:'pi pi-fw pi-chart-bar',
            items:[
               {
                  label:'BPBN (Carlton)',
                  icon:'pi pi-fw pi-chevron-circle-up',
                  command:()=>{  
                     handleChange("bpbn")
                  }
               },
               {
                  label:'BPBS (Prado)',
                  icon:'pi pi-fw pi-chevron-circle-down',
                  command:()=>{  
                     handleChange("bpbs")
                  }
               },
               {
                  label:'Croix',
                  icon:'pi pi-fw pi-slack',
                  command:()=>{  
                     handleChange("croix")
                  }
               },

            ]
         },
         {
            label:'Logistics',
            icon:'pi pi-fw pi-compass',
            items:[
               {
                  label:'By Route',
                  icon:'pi pi-fw pi-compass',
                  command:()=>{  
                     handleChange("logistics/byRoute")
                  }
               },
               {
                  label:'By Customer',
                  icon:'pi pi-fw pi-users',
                  command:()=>{  
                     handleChange("logistics/byCustomer")
                  }
               },
               {
                  label:'By Product',
                  icon:'pi pi-fw pi-tags',
                  command:()=>{  
                     handleChange("logistics/byProduct")
                  }
               },

            ]
            
         },
         {
            label:'Ordering',
            icon:'pi pi-fw pi-shopping-cart',
            command:()=>{  
               handleChange("ordering")
            }
            
         },
         {
            label:'Customers',
            icon:'pi pi-fw pi-users',
            command:()=>{  
               handleChange("customers")
            }
           
         },
         {
            label:'Products',
            icon:'pi pi-fw pi-tags',
            command:()=>{  
               handleChange("products")
            }
           
         },
         {
            label:'Billing',
            icon:'pi pi-fw pi-dollar',
            command:()=>{  
               handleChange("billing")
            }

           
         },
         {
            label:'Admin',
            icon:'pi pi-fw pi-cog',
            command:()=>{  
               handleChange("admin")
            }
           
         },
       ]
    },
    
 ];


 

  return (
      <div className = "card">
        <Menubar model={items} />
      </div>          
  );
}

export default Nav;
