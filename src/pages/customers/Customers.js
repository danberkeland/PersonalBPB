import React, { useContext, useEffect, useState } from 'react';

import styled from 'styled-components'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputText } from "primereact/inputtext";
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';

import { CustomerContext, CustomerLoad } from '../../dataContexts/CustomerContext'
import { ProductsContext } from '../../dataContexts/ProductsContext'
import { OrdersContext } from '../../dataContexts/OrdersContext';
import { StandingContext } from '../../dataContexts/StandingContext';
import { HoldingContext } from '../../dataContexts/HoldingContext';


const cities = [
  {name: 'New York', code: 'NY'},
  {name: 'Rome', code: 'RM'},
  {name: 'London', code: 'LDN'},
  {name: 'Istanbul', code: 'IST'},
  {name: 'Paris', code: 'PRS'}
];


function Customers() {

  const [ selectedCustomer, setSelectedCustomer ] = useState(null)

  const { customers, custLoaded, setCustLoaded } = useContext(CustomerContext)
  const { setProdLoaded } = useContext(ProductsContext)
  let { setHoldLoaded } = useContext(HoldingContext)
  let { setOrdersLoaded } = useContext(OrdersContext)
  let { setStandLoaded } = useContext(StandingContext)

  

  const handleSelection = e => {
    setSelectedCustomer(e.value)
    console.log(e.value)
  }


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
    grid-template-columns: 1fr 2fr;
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
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-items: start;
      align-content: flex-start;
      row-gap: 50px;
      width: 100%;
      background: #ffffff;
    `

    const GroupBox = styled.div`
      border: 1px solid grey;
      width: 80%;
      height: auto;
      margin: 5px 10px;
      padding: 10px;
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
              </div>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="nickName"> Nickname</label><br />
                </span>
                <InputText id="nickName" placeholder={selectedCustomer.nickName} />
              </div>

            </GroupBox>
      


            <GroupBox id="Contact">
              <h2><i className="pi pi-user"></i> Contact</h2>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="firstName"> First Name</label><br />  
                </span>
                <InputText id="firstName" placeholder={selectedCustomer.firstName} />
              </div>
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="lastName"> Last Name</label><br />  
                </span>
                <InputText id="lastName" placeholder={selectedCustomer.lastName} />
              </div>
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="email"> Email</label><br />
                </span>
                <InputText id="email" placeholder={selectedCustomer.email} />
              </div>
    
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="phone"> Phone</label><br />    
                </span>
                <InputMask mask="999-999-9999" id="phone" placeholder={selectedCustomer.phone} />
              </div>

            </GroupBox>



            <GroupBox id="Location">
              <h2><i className="pi pi-user"></i> Location</h2>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="zoneName">Zone</label><br />     
                </span>
                <Dropdown optionLabel="name" options={cities} placeholder="Select a Zone"/>
              </div>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="addr1">Address</label><br />     
                </span>
                <InputText id="addr1" placeholder={selectedCustomer.addr1} />
              </div>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="addr2">Address</label><br />     
                </span>
                <InputText id="addr2" placeholder={selectedCustomer.addr2} />
              </div>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="city">City</label><br />     
                </span>
                <InputText id="city" placeholder={selectedCustomer.city} />
              </div>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="zip">Zip</label><br />     
                </span>
                <InputText id="zip" placeholder={selectedCustomer.zip} />
              </div>

            </GroupBox>



            <GroupBox>
              <h2><i className="pi pi-user"></i> Billing</h2>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
            
                </span>
                <InputText placeholder={selectedCustomer.toBePrinted} />
              </div>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
           
                </span>
                <InputText placeholder={selectedCustomer.toBeEmailed} />
              </div>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
            
                </span>
                <InputText placeholder={selectedCustomer.Terms} />
              </div>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
            
                </span>
                <InputText placeholder={selectedCustomer.Invoicing} />
              </div>
            </GroupBox>
          </DescripWrapper>
        </React.Fragment>
        }
      </MainWrapper>
    </React.Fragment>         
  );
}

export default Customers;
