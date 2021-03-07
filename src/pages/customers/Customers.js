import React, { useContext, useEffect, useState } from 'react';

import styled from 'styled-components'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputText } from "primereact/inputtext";
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';



import { CustomerContext, CustomerLoad } from '../../dataContexts/CustomerContext'
import { ProductsContext } from '../../dataContexts/ProductsContext'
import { OrdersContext } from '../../dataContexts/OrdersContext';
import { StandingContext } from '../../dataContexts/StandingContext';
import { HoldingContext } from '../../dataContexts/HoldingContext';

import { sortAtoZDataByIndex } from '../../helpers/sortDataHelpers'

const clonedeep = require('lodash.clonedeep')


const terms = [
  {name: '15', value: '15'},
  {name: '30', value: '30'},
  {name: '0', value: '0'}
]

const invoicing = [
  {name: 'daily', value: 'daily'},
  {name: 'weekly', value: 'weekly'},
  {name: 'monthly', value: 'monthly'}
]





function Customers() {

  const [ selectedCustomer, setSelectedCustomer ] = useState(null)
  const [ zoneGroup, setZoneGroup ] = useState([])

  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext)
  const { setProdLoaded } = useContext(ProductsContext)
  let { setHoldLoaded } = useContext(HoldingContext)
  let { setOrdersLoaded } = useContext(OrdersContext)
  let { setStandLoaded } = useContext(StandingContext)

  
  const options = ['Yes', 'No'];

  const handleSelection = e => {
    setSelectedCustomer(e.value)
  }

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

  useEffect(() => {
  
    if (!customers){
        setCustLoaded(false)
    }
    setProdLoaded(true)
    setHoldLoaded(true)
    setOrdersLoaded(true)
    setStandLoaded(true)
  },[])

  const MainWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr .66fr .66fr .66fr;
    height: 100vh;
    `


  const ListWrapper = styled.div`
    font-family: 'Montserrat', sans-serif;
    margin: auto;
    width: 100%;
    height: 100vh;
    background: #ffffff;
    `

    const DescripWrapper = styled.div`
      font-family: 'Montserrat', sans-serif;
      display: flex;
      flex-direction: column;
      justify-items: start;
      align-content: flex-start;
      width: 100%;
      background: #ffffff;
    `

    const GroupBox = styled.div`
      display: flex;
      flex-direction: column;
      align-content: flex-start;
      border: 1px solid lightgrey;
      width: 95%;
      margin: 5px 10px;
      padding: 5px 20px;
      `

    const ButtonBox = styled.div`
      display: flex;
      flex-direction: column;
      align-content: flex-start;
      width: 80%;
      margin: 5px 10px;
      padding: 5px 20px;
      `

    
    const YesNoBox = styled.div`
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      padding: 5px;
      `

  
  return (
    <React.Fragment>
       {!custLoaded ? <CustomerLoad /> : ''}
      <MainWrapper>
        <ListWrapper>
         
          
         <ScrollPanel style={{ width: '100%', height: '100vh' }}>
          <DataTable value={customers} className="p-datatable-striped" 
            selection={selectedCustomer} onSelectionChange={handleSelection} selectionMode="single" dataKey="id">
            <Column field="custName" header="Customer" sortable filter filterPlaceholder="Search by name"></Column>
            <Column field="nickName" header="Nickname" sortable filter filterPlaceholder="Search by nickname"></Column>
          </DataTable>
          </ScrollPanel>
          
          
      </ListWrapper> 
        {selectedCustomer && 
        <React.Fragment>

          <DescripWrapper>

            <GroupBox id="Name">
              <h2><i className="pi pi-user"></i> Customer Name</h2>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="custName"> Username</label><br />
                </span> 
                <InputText id="custName" placeholder={selectedCustomer.custName} />
              </div><br />

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="nickName"> Nickname</label><br />
                </span>
                <InputText id="nickName" placeholder={selectedCustomer.nickName} />
              </div><br />

            </GroupBox>
      
            <GroupBox id="Location">
              <h2><i className="pi pi-user"></i> Location</h2>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="zoneName">Zone</label><br />     
                </span>
                <Dropdown id="zoneName" optionLabel="zoneName" options={zoneGroup} 
                  placeholder={selectedCustomer ? selectedCustomer.zoneName : "Select a Zone"}/>
              </div><br />

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="addr1">Address</label><br />     
                </span>
                <InputText id="addr1" placeholder={selectedCustomer.addr1} />
              </div><br />

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="addr2">Address</label><br />     
                </span>
                <InputText id="addr2" placeholder={selectedCustomer.addr2} />
              </div><br />

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="city">City</label><br />     
                </span>
                <InputText id="city" placeholder={selectedCustomer.city} />
              </div><br />

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="zip">Zip</label><br />     
                </span>
                <InputText id="zip" placeholder={selectedCustomer.zip} />
              </div><br />

            </GroupBox>

          </DescripWrapper>

          <DescripWrapper>

          <GroupBox id="Contact">
              <h2><i className="pi pi-user"></i> Contact</h2>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="firstName"> First Name</label><br />  
                </span>
                <InputText id="firstName" placeholder={selectedCustomer.firstName} />
              </div><br />
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="lastName"> Last Name</label><br />  
                </span>
                <InputText id="lastName" placeholder={selectedCustomer.lastName} />
              </div><br />
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="email"> Email</label><br />
                </span>
                <InputText id="email" placeholder={selectedCustomer.email} />
              </div><br />
    
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="phone"> Phone</label><br />    
                </span>
                <InputMask mask="999-999-9999" id="phone" placeholder={selectedCustomer.phone} />
              </div><br />

            </GroupBox>
            


            <GroupBox>
              <h2><i className="pi pi-user"></i> Billing</h2>

              <YesNoBox>
                <label htmlFor="paperInvoice">Paper Invoice</label>
                  <SelectButton value="Yes" id="paperInvoice" options={options}/>
              </YesNoBox>

              <YesNoBox>
                <label htmlFor="emailInvoice">Email Invoice</label>
                  <SelectButton value="Yes" id="emailInvoice" options={options}/>
              </YesNoBox>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="terms">Terms</label>
                </span>
                <Dropdown id="terms" optionLabel="name" options={terms} 
                placeholder={selectedCustomer ? selectedCustomer.terms : "Select Terms"}/>
              </div><br />

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="invoicing">Invoicing</label>
                </span>
                <Dropdown id="invoicing" optionLabel="name" options={invoicing} 
                placeholder={selectedCustomer ? selectedCustomer.invoicing : "Invoicing Preference"}/>
              </div><br />
            </GroupBox>
          </DescripWrapper>
          <DescripWrapper>
            <ButtonBox>
              <Button label="Add a Customer" icon="pi pi-plus" 
                className={"p-button-raised p-button-rounded"} /><br />
              <Button label="Update Customer" icon="pi pi-user-edit" 
                className={"p-button-raised p-button-rounded p-button-success"} /><br /><br />
              <Button label="Tomorrows's Order" icon="pi pi-shopping-cart" 
                className={"p-button-raised p-button-rounded p-button-info"} /><br />
              <Button label="Edit Standing Order" icon="pi pi-calendar" 
                className={"p-button-raised p-button-rounded p-button-info"} /><br />
            </ButtonBox>
          </DescripWrapper>
        </React.Fragment>
        }
      </MainWrapper>
    </React.Fragment>         
  );
}

export default Customers;
