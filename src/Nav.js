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
      {label: 'EOD Counts', icon: 'pi pi-fw pi-map', command:()=>{ setSelectedMenu("eod")}},
      {label: 'Dough Calc', icon: 'pi pi-fw pi-map', command:()=>{ window.location="/Dough"; }},
      {label: 'Ordering', icon: 'pi pi-fw pi-shopping-cart', command:()=>{ window.location="/Ordering"; }},
      {label: 'Customers', icon: 'pi pi-fw pi-users', command:()=>{ window.location="/Customers"; }},
      {label: 'Products', icon: 'pi pi-fw pi-tags', command:()=>{ window.location="/Products"; }},
      {label: 'Billing', icon: 'pi pi-fw pi-money-bill', command:()=>{ window.location="/Billing";}},
      {label: 'Settings', icon: 'pi pi-fw pi-cog', command:()=>{ setSelectedMenu("settings")}}
   ];



   const noitems = [
      {label: ''},
   ];

   const proditems = [
      {label: 'BPBN', command:()=>{ setSelectedMenu("BPBN")}},
      {label: 'BPBS', command:()=>{ setSelectedMenu("BPBS")}}, 
      {label: 'Croix', command:()=>{ setSelectedMenu("Croix")}},
   ];

   const BPBNitems = [
      {label: 'BPBN Baker 1', command:()=>{ window.location="/BPBNProd/BPBNBaker1"; }},
      {label: 'BPBN Baker 2', command:()=>{ window.location="/BPBNProd/BPBNBaker2"; }},
      {label: 'BPBN Set Out', command:()=>{ window.location="/BPBNProd/BPBNSetOut"; }},
      {label: 'BPBN Buckets', command:()=>{ window.location="/BPBNProd/Buckets"; }},
      {label: 'BPBN EOD Count', command:()=>{ window.location="/EODCounts/BPBNCounts"; }},
      {label: 'Dough Calculator', command:()=>{ window.location="/doughCalc/doughCalc"; }},

   ]

   const BPBSitems = [
      {label: 'BPBS What To Make'},
      {label: 'BPBS Mix/Pocket'},
      {label: 'Croix To Make'},
      {label: 'BPBS EOD Count'},
      {label: 'Dough Calculator'},

   ]

   const Croixitems = [
      {label: 'What Croix to shape'},
      {label: 'Croix EOD Count'},

   ]

   const logitems = [
      {label: 'By Route', command:()=>{ window.location="/logistics/byRoute"; }},
      {label: 'By Filter', command:()=>{ window.location="/logistics/byProduct"; }},
      {label: 'North Driver Lists', command:()=>{ window.location="/logistics/NorthLists"; }},
      {label: 'AM Pastry Pack', command:()=>{ window.location="/logistics/AMPastry"; }},
      {label: 'Retail Bags', command:()=>{ window.location="/logistics/RetailBags"; }},
   ];

   const eoditems = [
      {label: 'BPBN'},
      {label: 'BPBS'},
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
      {label: 'Edit Routes', command:()=>{ window.location="/settings/editRoutes"; }},
      {label: 'Edit Doughs'}

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
           selectedMenu === "BPBN" ? BPBNitems :
           selectedMenu === "BPBS" ? BPBSitems :
           selectedMenu === "Croix" ? Croixitems :
           selectedMenu === "log" ? logitems :
           selectedMenu === "eod" ? eoditems :
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
