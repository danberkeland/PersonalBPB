import React, { useRef, useState } from 'react';

import { Menubar } from 'primereact/menubar';
import { TabMenu } from 'primereact/tabmenu';


import swal from '@sweetalert/with-react';

import 'primereact/resources/themes/bootstrap4-light-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


function Nav() {

   const [ selectedMenu, setSelectedMenu ] = useState("")

   
   const items = [
      {label: 'Production', icon: 'pi pi-fw pi-chart-bar', command:()=>{ setSelectedMenu("prod")}},
      {label: 'Logistics', icon: 'pi pi-fw pi-map', command:()=>{ setSelectedMenu("log")}},
      {label: 'Ordering', icon: 'pi pi-fw pi-shopping-cart', command:()=>{ setSelectedMenu("order")}},
      {label: 'Customers', icon: 'pi pi-fw pi-users', command:()=>{ setSelectedMenu("cust")}},
      {label: 'Products', icon: 'pi pi-fw pi-tags', command:()=>{ setSelectedMenu("items")}},
      {label: 'Billing', icon: 'pi pi-fw pi-money-bill', command:()=>{ setSelectedMenu("billing")}},
      {label: 'Settings', icon: 'pi pi-fw pi-cog', command:()=>{ setSelectedMenu("settings")}}
   ];



   const noitems = [
      {label: ''},
   ];

   const proditems = [
      {label: 'BPBN'},
      {label: 'BPBS'},
      {label: 'Croix'},
   ];

   const logitems = [
      {label: 'By Route'},
      {label: 'By Customer'},
      {label: 'By Product'},
   ];

   const orderitems = [
      {label: 'Ordering'},
   ];

   const custitems = [
      {label: 'Customers', command:()=>{ window.location="/Customers"; }},
   ];

   const itemitems = [
      {label: 'Products'},
   ];

   const billingitems = [
      {label: 'Billing'},
   ];

   const settingsitems = [
      {label: 'Settings'},
   ];


 

  return (
      <div className = "card">
        <Menubar model={items} />
        <TabMenu model={
           selectedMenu === "prod" ? proditems :
           selectedMenu === "log" ? logitems :
           selectedMenu === "order" ? orderitems :
           selectedMenu === "cust" ? custitems :
           selectedMenu === "items" ? itemitems :
           selectedMenu === "billing" ? billingitems :
           selectedMenu === "settings" ? settingsitems :
           selectedMenu === "" ? noitems :

           ''
           } />
      </div>          
  );
}

export default Nav;
