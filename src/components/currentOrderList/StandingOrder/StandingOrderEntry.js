import React, { useEffect, useContext, useState } from 'react';

import swal from '@sweetalert/with-react';

import { v4 as uuidv4 } from 'uuid';

import { OrdersContext } from '../../../dataContexts/OrdersContext';
import { StandingContext } from '../../../dataContexts/StandingContext';
import { CurrentDataContext } from '../../../dataContexts/CurrentDataContext';

import { convertDatetoBPBDate, convertDatetoStandingDate } from '../../../helpers/dateTimeHelpers';

const clonedeep = require('lodash.clonedeep')

const StandingOrderEntry = () => {

    const [ standArray, setStandArray ] = useState()

    const { standing, setStanding } = useContext(StandingContext);
    const { chosen, delivDate, setModifications } = useContext(CurrentDataContext);

    useEffect(() => {
        let buildStandArray = []

        // check for standing, if no, check for holding, if no return

        // item for item in standing
        let pullStand = clonedeep(standing)
        for (let pull of pullStand){
            // search index of item in buildArray
            if (pull[8] === chosen){
                let ind = buildStandArray.findIndex(stand => stand[0] === pull[7])
                if (ind>=0){
                    buildStandArray[ind][Number(pull[0])] = pull[2]
                } else {
                    let newStand = [pull[7],"0","0","0","0","0","0","0"]
                    newStand[Number(pull[0])] = pull[2]
                    buildStandArray.push(newStand)
                    
                }
            }
        }    
        setStandArray(buildStandArray)
    },[chosen, standing])


    const handleRemove = e => {
        setModifications(true)
        let newQty = "0"
        let indexToFind = e.target.name
        let foundStandIndex = standArray.findIndex(line => line[0] === indexToFind)
        let StandListToModify = clonedeep(standArray)
        for (let i = 1; i<8; ++i){
            StandListToModify[foundStandIndex][i] = "0";
        }

        // create deepcopy of orders
        let updatedStanding = clonedeep(standing)
        
        for (let i = 1; i<8; ++i){
            let ind = updatedStanding.findIndex(stand => stand[0] === i.toString() && stand[7] === indexToFind && stand[8] === chosen)
            if (ind>=0){
                updatedStanding[ind][2] = 0;
            }
        }
        console.log(updatedStanding)
        setStanding(updatedStanding)


        
    }

    const handleQtyModify = e => {
        if(isNaN(e.target.value)){
            e.target.value = ''
            swal ({
                text: "Only Numbers Please",
                icon: "warning",
                buttons: false,
                timer: 2000
              })
        }

        setModifications(true)
        let newQty = e.target.value
        let indexToFind = e.target.name
        let foundStandIndex = standArray.findIndex(line => line[0] === indexToFind)
        let StandListToModify = clonedeep(standArray)
        let intTarg = e.target.id
        intTarg = intTarg.split('_')
        StandListToModify[foundStandIndex][intTarg[1]] = newQty;

        let updatedStanding = clonedeep(standing)
        let ind = updatedStanding.findIndex(stand => stand[0] === intTarg[1] 
            && stand[7] === indexToFind && stand[8] === chosen)
        console.log(ind)
        console.log(updatedStanding[ind])
        updatedStanding[ind][2] = newQty

        
        setStanding(updatedStanding)
      
          
    }
    


    return (
        <React.Fragment> 
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

                    <input type="text" key={order[0]+"sun"} size="3" maxLength="3" id={order[0]+"_1"} name={order[0]}
                        placeholder={order[1]} onKeyUp={e => {handleQtyModify(e)}} onBlur={(e) => {e.target.value = ''}}></input>
                    <input type="text" key={order[0]+"mon"} size="3" maxLength="3" id={order[0]+"_2"} name={order[0]}
                        placeholder={order[2]} onKeyUp={e => {handleQtyModify(e)}} onBlur={(e) => {e.target.value = ''}}></input>
                    <input type="text" key={order[0]+"tues"} size="3" maxLength="3" id={order[0]+"_3"} name={order[0]}
                        placeholder={order[3]} onKeyUp={e => {handleQtyModify(e)}} onBlur={(e) => {e.target.value = ''}}></input>
                    <input type="text" key={order[0]+"wed"} size="3" maxLength="3" id={order[0]+"_4"} name={order[0]}
                        placeholder={order[4]} onKeyUp={e => {handleQtyModify(e)}} onBlur={(e) => {e.target.value = ''}}></input>
                    <input type="text" key={order[0]+"thurs"} size="3" maxLength="3" id={order[0]+"_5"} name={order[0]}
                        placeholder={order[5]} onKeyUp={e => {handleQtyModify(e)}} onBlur={(e) => {e.target.value = ''}}></input>
                    <input type="text" key={order[0]+"fri"} size="3" maxLength="3" id={order[0]+"_6"} name={order[0]}
                        placeholder={order[6]} onKeyUp={e => {handleQtyModify(e)}} onBlur={(e) => {e.target.value = ''}}></input>
                    <input type="text" key={order[0]+"sat"} size="3" maxLength="3" id={order[0]+"_7"} name={order[0]}
                        placeholder={order[7]} onKeyUp={e => {handleQtyModify(e)}} onBlur={(e) => {e.target.value = ''}}></input>
    
                    <button className="trashButton" key={order[0]+"rem"} name={order[0]} onClick={e => handleRemove(e)}>🗑️</button>
                </React.Fragment>)) : ''}
           
           
        </React.Fragment>
        
    )
};

export default StandingOrderEntry