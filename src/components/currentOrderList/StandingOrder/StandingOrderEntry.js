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

    const { standing } = useContext(StandingContext);
    const { chosen } = useContext(CurrentDataContext);

    useEffect(() => {
        let buildStandArray = []
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

                    <input type="text" key={order[0]+"sun"} size="3" maxLength="3" placeholder={order[1]} ></input>
                    <input type="text" key={order[0]+"mon"} size="3" maxLength="3" placeholder={order[2]} ></input>
                    <input type="text" key={order[0]+"tues"} size="3" maxLength="3" placeholder={order[3]} ></input>
                    <input type="text" key={order[0]+"wed"} size="3" maxLength="3" placeholder={order[4]} ></input>
                    <input type="text" key={order[0]+"thurs"} size="3" maxLength="3" placeholder={order[5]} ></input>
                    <input type="text" key={order[0]+"fri"} size="3" maxLength="3" placeholder={order[6]} ></input>
                    <input type="text" key={order[0]+"sat"} size="3" maxLength="3" placeholder={order[7]} ></input>
    
                    <button>X</button>
                </React.Fragment>)) : ''}
           
           
        </React.Fragment>
        
    )
};

export default StandingOrderEntry