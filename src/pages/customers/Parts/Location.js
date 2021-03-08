import React, { useContext, useEffect, useState } from 'react';


import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';


import { CustomerContext } from '../../../dataContexts/CustomerContext'

import { sortAtoZDataByIndex } from '../../../helpers/sortDataHelpers'


const clonedeep = require('lodash.clonedeep')



const Location = ({ selectedCustomer, setSelectedCustomer }) => {

  const [ zoneGroup, setZoneGroup ] = useState([])

  const { customers } = useContext(CustomerContext)
  

  useEffect(() => {
    if (customers.length>0){
      let zoneGroup = clonedeep(customers)
      zoneGroup = zoneGroup.map(cust => cust["zoneName"])
      for (let i=0; i<zoneGroup.length; ++i ){
        for (let j=i+1; j<zoneGroup.length; ++j){
          while(zoneGroup[i] === zoneGroup[j]){
              zoneGroup.splice(j,1);
          }
        }
      }
      zoneGroup = zoneGroup.map(zone => ({"zoneName": zone}))
      zoneGroup = sortAtoZDataByIndex(zoneGroup,"zoneName")
      setZoneGroup(zoneGroup)
  }
  },[customers])

   
  const setValue = value => {
    if (value.code==="Enter"){
      console.log(value.target)
      let custToUpdate = clonedeep(selectedCustomer)
      custToUpdate[value.target.id] = value.target.value
      document.getElementById(value.target.id).value=''
      setSelectedCustomer(custToUpdate)
    }
  }

  const setDropDownValue = value => {
    let custToUpdate = clonedeep(selectedCustomer)
    console.log(value)
    let attr = value.target.id
    custToUpdate[attr] = value.value[attr]
    setSelectedCustomer(custToUpdate)
  }

  const fixValue = value => {
    let custToUpdate = clonedeep(selectedCustomer)
    if (value.target.value !==''){
    custToUpdate[value.target.id] = value.target.value
    }
    document.getElementById(value.target.id).value=''
    setSelectedCustomer(custToUpdate)
  }

  
  return (
    <React.Fragment>
    
        <h2><i className="pi pi-map"></i> Location</h2>   
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="zoneName">Zone</label><br />     
          </span>
          <Dropdown id="zoneName" optionLabel="zoneName" options={zoneGroup} onChange={setDropDownValue}
            placeholder={selectedCustomer ? selectedCustomer.zoneName : "Select a Zone"}/>
        </div><br />   
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="addr1">Address</label><br />     
          </span>
          <InputText id="addr1" placeholder={selectedCustomer.addr1} onKeyUp={setValue} onBlur={fixValue}/>
        </div><br />   
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="addr2">Address</label><br />     
          </span>
          <InputText id="addr2" placeholder={selectedCustomer.addr2} onKeyUp={setValue} onBlur={fixValue}/>
        </div><br />
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="city">City</label><br />     
          </span>
          <InputText id="city" placeholder={selectedCustomer.city} onKeyUp={setValue} onBlur={fixValue}/>
        </div><br />  
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="zip">Zip</label><br />     
          </span>
          <InputText id="zip" placeholder={selectedCustomer.zip} onKeyUp={setValue} onBlur={fixValue}/>
        </div><br />   
    </React.Fragment>         
  );
}

export default Location;
