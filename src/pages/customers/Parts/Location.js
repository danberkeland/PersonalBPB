import React, { useContext, useEffect, useState } from 'react';

import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';

import { CustomerContext } from '../../../dataContexts/CustomerContext'

import { setValue, fixValue, setDropDownValue, getZoneGroup } from '../../../helpers/customerHelpers'



const Location = ({ selectedCustomer, setSelectedCustomer }) => {

  const [ zoneGroup, setZoneGroup ] = useState([])

  const { customers } = useContext(CustomerContext)
  

  useEffect(() => {
    let zoneGroup = getZoneGroup(customers)
    setZoneGroup(zoneGroup)
  },[customers])

  
  return (
    <React.Fragment>
    
        <h2><i className="pi pi-map"></i> Location</h2>   
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="zoneName">Zone</label><br />     
          </span>
          <Dropdown id="zoneName" optionLabel="zoneName" options={zoneGroup} 
            onChange={e => setSelectedCustomer(setDropDownValue(e,selectedCustomer))}
            placeholder={selectedCustomer ? selectedCustomer.zoneName : "Select a Zone"}/>
        </div><br />   
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="addr1">Address</label><br />     
          </span>

          <InputText id="addr1" placeholder={selectedCustomer.addr1} 
            onKeyUp={e => e.code==="Enter" && setSelectedCustomer(setValue(e, selectedCustomer))} 
            onBlur={e => setSelectedCustomer(fixValue(e, selectedCustomer))}/>

        </div><br />   
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="addr2">Address</label><br />     
          </span>

          <InputText id="addr2" placeholder={selectedCustomer.addr2} 
            onKeyUp={e => e.code==="Enter" && setSelectedCustomer(setValue(e, selectedCustomer))} 
            onBlur={e => setSelectedCustomer(fixValue(e, selectedCustomer))}/>

        </div><br />
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="city">City</label><br />     
          </span>

          <InputText id="city" placeholder={selectedCustomer.city} 
            onKeyUp={e => e.code==="Enter" && setSelectedCustomer(setValue(e, selectedCustomer))} 
            onBlur={e => setSelectedCustomer(fixValue(e, selectedCustomer))}/>

        </div><br />  
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="zip">Zip</label><br />     
          </span>

          <InputText id="zip" placeholder={selectedCustomer.zip} 
            onKeyUp={e => e.code==="Enter" && setSelectedCustomer(setValue(e, selectedCustomer))} 
            onBlur={e => setSelectedCustomer(fixValue(e, selectedCustomer))}/>

        </div><br />   
    </React.Fragment>         
  );
}

export default Location;
