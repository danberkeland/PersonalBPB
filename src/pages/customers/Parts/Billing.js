import React from 'react';

import styled from 'styled-components'

import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';

const clonedeep = require('lodash.clonedeep')


const terms = [
    {terms: "0",},
    {terms: "15"},
    {terms: "30"}
]

const invoicing = [
    {invoicing: "daily"},
    {invoicing: "weekly"},
    {invoicing: "monthly"}
]

const YesNoBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    padding: 5px;
    `




const Billing = ({ selectedCustomer, setSelectedCustomer }) => {

    const options = ['Y', 'N'];

    const setDropDownValue = value => {
        let custToUpdate = clonedeep(selectedCustomer)
        console.log(value)
        let attr = value.target.id
        custToUpdate[attr] = value.value[attr]
        setSelectedCustomer(custToUpdate)  
    }

  
  return (
    <React.Fragment>
   
        <h2><i className="pi pi-money-bill"></i> Billing</h2>

        <YesNoBox>
            <label htmlFor="paperInvoice">Paper Invoice</label>
            <SelectButton value={selectedCustomer.toBePrinted} id="paperInvoice" options={options}/>
        </YesNoBox>

        <YesNoBox>
            <label htmlFor="emailInvoice">Email Invoice</label>
            <SelectButton value={selectedCustomer.toBeEmailed} id="emailInvoice" options={options}/>
        </YesNoBox>

        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="terms">Terms</label>
            </span>
            <Dropdown id="terms" optionLabel="terms" options={terms} onChange={setDropDownValue}
                placeholder={selectedCustomer ? selectedCustomer.terms : "Select Terms"}/>
        </div><br />

        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="invoicing">Invoicing</label>
            </span>
            <Dropdown id="invoicing" optionLabel="invoicing" options={invoicing} onChange={setDropDownValue}
                placeholder={selectedCustomer ? selectedCustomer.invoicing : "Invoicing Preference"}/>
        </div><br />
           
    </React.Fragment>         
  );
}

export default Billing;
