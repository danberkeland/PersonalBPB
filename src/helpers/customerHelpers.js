import { sortAtoZDataByIndex } from '../helpers/sortDataHelpers'

const clonedeep = require('lodash.clonedeep')


export const setValue = (value, selectedCustomer) => {
    if (value.code==="Enter"){
        console.log(value.target)
        let custToUpdate = clonedeep(selectedCustomer)
        custToUpdate[value.target.id] = value.target.value
        document.getElementById(value.target.id).value=''
        return custToUpdate
    }
  }

export const fixValue = (value, selectedCustomer) => {
    let custToUpdate = clonedeep(selectedCustomer)
    if (value.target.value !==''){
        custToUpdate[value.target.id] = value.target.value
    }
    document.getElementById(value.target.id).value=''
    return custToUpdate
    }


export const setDropDownValue = (value, selectedCustomer) => {
    let custToUpdate = clonedeep(selectedCustomer)
    let attr = value.target.id
    custToUpdate[attr] = value.value[attr]
    return custToUpdate  
    }


export const setYesNoValue = (value, selectedCustomer) => {
    let custToUpdate = clonedeep(selectedCustomer)
    let attr = value.target.id
    custToUpdate[attr] = value.value
    return custToUpdate  
    }


export const getZoneGroup = (customers) => {
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
        return zoneGroup
    }
}