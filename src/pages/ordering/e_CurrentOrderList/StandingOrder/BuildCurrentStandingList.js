import React, { useEffect, useContext, useState } from 'react';

import swal from '@sweetalert/with-react';

import { Button } from 'primereact/button';

import { ToggleContext } from '../../../../dataContexts/ToggleContext';
import { StandingContext } from '../../../../dataContexts/StandingContext';
import { HoldingContext } from '../../../../dataContexts/HoldingContext';
import { CurrentDataContext } from '../../../../dataContexts/CurrentDataContext';
import { 
    checkStandHoldStatus, 
    createStandListArray, 
    clearSelectedStandItem, 
    createUpdateWeeklyList,
    setCurrentStandLineToQty,
    createUpdateWeeklyStandList 
    } from '../../../../helpers/StandBuildingHelpers';


import styled from 'styled-components'


const OrderGrid = styled.div`
    width: 100%;
    font-size: 1em;
    border-radius: 10px;
    padding: 20px;
    border: none;
    display: grid;
    grid-template-columns: 5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr .5fr;
    align-self: center;
    row-gap: 10px;
    `
const StandInput = styled.input`
    border: 1px solid gray;
    border-radius: 5px;
    width: 80%;
    `

const entryNotZero = {
    fontSize: "1.1em",
    fontWeight: "bold"
}

const entryZero = {
    fontSize: "1em",
    fontWeight: "normal"
}

const clonedeep = require('lodash.clonedeep')

const BuildCurrentStandingList = () => {

    const [ standArray, setStandArray ] = useState()

    const { standing, setStanding } = useContext(StandingContext);
    const { holding, setHolding } = useContext(HoldingContext);
    const { standList, setStandList, setModifications } = useContext(ToggleContext)
    const { chosen } = useContext(CurrentDataContext);


    useEffect(() => {
        let [Stand, Hold] = checkStandHoldStatus(standing, holding, chosen)
        setStandList(Stand)   
        let buildStandArray = createStandListArray(standing, holding, Stand, Hold, chosen)
        console.log(buildStandArray)
        setStandArray(buildStandArray)
    },[chosen, holding, standing, setStandList])



    const handleRemove = (e) => {
        
        let standListToModify = clearSelectedStandItem(e,standArray)
        setStandArray(standListToModify)
        

        let updatedStandorHold = clonedeep(standList ? standing : holding)   
        let updatedWeeklyList = createUpdateWeeklyList(e, updatedStandorHold, chosen)
        standList ? setStanding(updatedWeeklyList) : setHolding(updatedWeeklyList)        
    }


    const handleQtyModify = (e,qty) => {
        if(isNaN(e.target.value)){
            e.target.value = ''
            swal ({
                text: "Only Numbers Please",
                icon: "warning",
                buttons: false,
                timer: 2000
              })
        }

        let StandListToModify = setCurrentStandLineToQty(e,standArray,qty)
        setStandArray(StandListToModify)
        setModifications(true)

        let updatedStandorHold = clonedeep(standList ? standing : holding)   
        let updatedWeeklyStandList = createUpdateWeeklyStandList(e, updatedStandorHold, chosen)
        standList ? setStanding(updatedWeeklyStandList) : setHolding(updatedWeeklyStandList)            
    }
    


    return (
        <React.Fragment> 
        <OrderGrid>
        <label>PRODUCT</label>
            <label>S</label>
            <label>M</label>
            <label>T</label>
            <label>W</label>
            <label>T</label>
            <label>F</label>
            <label>S</label>
            <label></label>
            {standArray ? standArray.map(order =>
                (<React.Fragment key={order[0]+"frag"}>
                    <label key={order[0]+"prod"}>{order[0]}</label>

                    <StandInput type="text" key={order[0]+"sun"} size="3" style={Number(order[1])>0 ? entryNotZero : entryZero }
                        maxLength="3" id={order[0]+"_1"} name={order[0]} placeholder={order[1]} data-day="1" 
                        onKeyUp={e => {handleQtyModify(e,e.target.value)}} onBlur={(e) => {e.target.value = ''}}>
                    </StandInput>
                    <StandInput type="text" key={order[0]+"mon"} size="3" style={Number(order[2])>0 ? entryNotZero : entryZero }
                        maxLength="3" id={order[0]+"_2"} name={order[0]} placeholder={order[2]} data-day="2" 
                        onKeyUp={e => {handleQtyModify(e,e.target.value)}} onBlur={(e) => {e.target.value = ''}}>
                    </StandInput>
                    <StandInput type="text" key={order[0]+"tues"} size="3" style={Number(order[3])>0 ? entryNotZero : entryZero }
                        maxLength="3" id={order[0]+"_3"} name={order[0]} placeholder={order[3]} data-day="3" 
                        onKeyUp={e => {handleQtyModify(e,e.target.value)}} onBlur={(e) => {e.target.value = ''}}>
                    </StandInput>
                    <StandInput type="text" key={order[0]+"wed"} size="3" style={Number(order[4])>0 ? entryNotZero : entryZero }
                        maxLength="3" id={order[0]+"_4"} name={order[0]} placeholder={order[4]} data-day="4" 
                        onKeyUp={e => {handleQtyModify(e,e.target.value)}} onBlur={(e) => {e.target.value = ''}}>
                    </StandInput>
                    <StandInput type="text" key={order[0]+"thurs"} size="3" style={Number(order[5])>0 ? entryNotZero : entryZero } 
                        maxLength="3" id={order[0]+"_5"} name={order[0]} placeholder={order[5]} data-day="5" 
                        onKeyUp={e => {handleQtyModify(e,e.target.value)}} onBlur={(e) => {e.target.value = ''}}>
                    </StandInput>
                    <StandInput type="text" key={order[0]+"fri"} size="3" style={Number(order[6])>0 ? entryNotZero : entryZero } 
                        maxLength="3" id={order[0]+"_6"} name={order[0]} placeholder={order[6]} data-day="6" 
                        onKeyUp={e => {handleQtyModify(e,e.target.value)}} onBlur={(e) => {e.target.value = ''}}>
                    </StandInput>
                    <StandInput type="text" key={order[0]+"sat"} size="3" style={Number(order[7])>0 ? entryNotZero : entryZero }
                        maxLength="3" id={order[0]+"_7"} name={order[0]} placeholder={order[7]} data-day="7" 
                        onKeyUp={e => {handleQtyModify(e,e.target.value)}} onBlur={(e) => {e.target.value = ''}}>
                    </StandInput>
    
                    <Button icon="pi pi-trash" className="p-button-outlined p-button-rounded p-button-help p-button-sm" 
                        key={order[0]+"rem"} name={order[0]} onClick={e => handleRemove(e,"0")}></Button>
                </React.Fragment>)) : ''}
           
        </OrderGrid>    
        </React.Fragment>
        
    )
};

export default BuildCurrentStandingList