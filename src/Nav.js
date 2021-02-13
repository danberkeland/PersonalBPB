import React from 'react';

import { Menubar } from 'primereact/menubar';

import 'primereact/resources/themes/bootstrap4-light-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function Nav() {


  const items = [
    {
       label:'Menu',
       icon:'pi pi-fw pi-chart-bar',
       items:[

          {
            label:'Production',
            icon:'pi pi-fw pi-arrow-circle-up',
            items:[
               {
                  label:'AM Bake List',
                  icon:'pi pi-fw pi-bookmark'
               },
               {
                  label:'Mix List',
                  icon:'pi pi-fw pi-video'
               },

            ]
         },
         {
            label:'Logistics',
            icon:'pi pi-fw pi-arrow-circle-up',
            items:[
               {
                  label:'AM Bake List',
                  icon:'pi pi-fw pi-bookmark'
               },
               {
                  label:'Mix List',
                  icon:'pi pi-fw pi-video'
               },

            ]
         },
         {
            label:'Ordering',
            icon:'pi pi-fw pi-arrow-circle-up',
            items:[
               {
                  label:'AM Bake List',
                  icon:'pi pi-fw pi-bookmark'
               },
               {
                  label:'Mix List',
                  icon:'pi pi-fw pi-video'
               },

            ]
         },
         {
            label:'Customers',
            icon:'pi pi-fw pi-arrow-circle-up',
            items:[
               {
                  label:'AM Bake List',
                  icon:'pi pi-fw pi-bookmark'
               },
               {
                  label:'Mix List',
                  icon:'pi pi-fw pi-video'
               },

            ]
         },
         {
            label:'Products',
            icon:'pi pi-fw pi-arrow-circle-up',
            items:[
               {
                  label:'AM Bake List',
                  icon:'pi pi-fw pi-bookmark'
               },
               {
                  label:'Mix List',
                  icon:'pi pi-fw pi-video'
               },

            ]
         },
         {
            label:'Billing',
            icon:'pi pi-fw pi-arrow-circle-up',
            items:[
               {
                  label:'AM Bake List',
                  icon:'pi pi-fw pi-bookmark'
               },
               {
                  label:'Mix List',
                  icon:'pi pi-fw pi-video'
               },

            ]
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
