import React from 'react';

import { Menubar } from 'primereact/menubar';

import 'primereact/resources/themes/bootstrap4-light-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function Nav() {


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
                  command:()=>{ window.location = "/bpbn"; }
               },
               {
                  label:'BPBS (Prado)',
                  icon:'pi pi-fw pi-chevron-circle-down',
                  command:()=>{ window.location = "/bpbs"; }
               },
               {
                  label:'Croix',
                  icon:'pi pi-fw pi-slack',
                  command:()=>{ window.location = "/croix"; }
               },

            ]
         },
         {
            label:'Logistics',
            icon:'pi pi-fw pi-compass',
            command:()=>{ window.location = "/logistics"; }
            
         },
         {
            label:'Ordering',
            icon:'pi pi-fw pi-shopping-cart',
            command:()=>{ window.location = "/ordering"; }
            
         },
         {
            label:'Customers',
            icon:'pi pi-fw pi-users',
            command:()=>{ window.location = "/customers"; }
           
         },
         {
            label:'Products',
            icon:'pi pi-fw pi-tags',
            command:()=>{ window.location = "/products"; }
           
         },
         {
            label:'Billing',
            icon:'pi pi-fw pi-dollar',
            command:()=>{ window.location = "/billing"; }

           
         },
         {
            label:'Admin',
            icon:'pi pi-fw pi-cog',
            command:()=>{ window.location = "/admin"; }
           
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
