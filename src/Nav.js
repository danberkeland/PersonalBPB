import React, { useState } from 'react';

import { Menubar } from 'primereact/menubar';
import { TabMenu } from 'primereact/tabmenu';
import { AmplifySignOut } from '@aws-amplify/ui-react'


import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import styled from 'styled-components'

const BackGround = styled.div`
      display: flex;
      width: 100%;
      background-color: white;
   `

const TopBar = styled.div`
      display: grid;
      grid-template-columns: 10fr 1fr;
      background-color: white;
   `

function Nav() {

   
   const [ selectedMenu, setSelectedMenu ] = useState("")

   
   const items = [
      {label: 'Production', icon: 'pi pi-fw pi-chart-bar', command:()=>{ setSelectedMenu("prod")}},
      {label: 'Logistics', icon: 'pi pi-fw pi-map', command:()=>{ setSelectedMenu("log")}},
      {label: 'Ordering', icon: 'pi pi-fw pi-shopping-cart', command:()=>{ window.location="/Ordering"; }},
      {label: 'Customers', icon: 'pi pi-fw pi-users', command:()=>{ window.location="/Customers"; }},
      {label: 'Products', icon: 'pi pi-fw pi-tags', command:()=>{ window.location="/Products"; }},
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
      {label: 'By Route', command:()=>{ window.location="/logistics/byRoute"; }},
      {label: 'By Filter', command:()=>{ window.location="/logistics/byProduct"; }},
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
      {label: 'Edit Zones', command:()=>{ window.location="/settings/editZones"; }},
      {label: 'Edit Routes', command:()=>{ window.location="/settings/editRoutes"; }}
   ];


 

  return (
      <div className = "card">
         <TopBar>
         <Menubar model={items} />
         <AmplifySignOut /> 
         </TopBar>
         <BackGround>
         <TabMenu model={
           selectedMenu === "prod" ? proditems :
           selectedMenu === "log" ? logitems :
           selectedMenu === "order" ? orderitems :
           selectedMenu === "cust" ? custitems :
           selectedMenu === "items" ? itemitems :
           selectedMenu === "billing" ? billingitems :
           selectedMenu === "settings" ? settingsitems :
           selectedMenu === "" ? noitems : ''
           } /> 
         </BackGround>
         
      </div>          
  );
}

export default Nav;
