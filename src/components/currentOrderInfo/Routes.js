import React, { useContext, useEffect, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import swal from '@sweetalert/with-react';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { CustomerContext } from '../../dataContexts/CustomerContext';
import { OrdersContext } from '../../dataContexts/OrdersContext';
import { StandingContext } from '../../dataContexts/StandingContext';

import { createRouteList, FindNewRoute } from '../../helpers/sortDataHelpers'
import { convertDatetoBPBDate, convertDatetoStandingDate } from '../../helpers/dateTimeHelpers'
import { CheckIfRouteisEnabled } from '../../helpers/OrderingHelpers'

const clonedeep = require('lodash.clonedeep')

const Routes = ({page}) => {

    const { customers, routeIsOn } = useContext(CustomerContext)
    const { orders, setOrders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    const { chosen, delivDate, route, setRoute } = useContext(CurrentDataContext)

    const [ routes, setRoutes ] = useState()

    
    useEffect(()=> {
        let routeList = createRouteList(customers)
        setRoutes(routeList)
    },[customers, setRoutes])


    
    useEffect(() => {
        let newRoute = FindNewRoute(chosen, delivDate, orders, customers)
        setRoute(newRoute)      
    },[chosen, delivDate, customers, setRoute, orders])
    


    const handleChange = e => {

        let newRoute = e.target.value
         // BUILD PRESENT LIST
        // Build Orders List based on delivDate and Chosen
        let BPBDate = convertDatetoBPBDate(delivDate)
        let filteredOrders = clonedeep(orders)
        let buildCartList = filteredOrders ? filteredOrders.filter(order => order[7] === BPBDate && order[2] === chosen) : [];
        
        // Build Standing List based on delivDate and Chosen
        let standingDate = convertDatetoStandingDate(delivDate);  
        let filteredStanding = clonedeep(standing)
        let standingList = filteredStanding ? filteredStanding.filter(standing => standing[0] === standingDate && standing[8] === chosen) : [];
        let convertedOrderList = standingList.map(order => [    order[2],
                                                                order[7],
                                                                order[8],
                                                                'na',
                                                                order[6],
                                                                order[2], 
                                                                order[3] !== "9999" ? true : false,
                                                                convertDatetoBPBDate(delivDate)])
        
        // Compare Order List to Stand List and give Order List precedence in final list                                                        
        let orderList = buildCartList.concat(convertedOrderList)
        for (let i=0; i<orderList.length; ++i ){
            for (let j=i+1; j<orderList.length; ++j){
                if (orderList[i][1] === orderList[j][1]){
                    orderList.splice(j,1);
                }
            }
        }


        // set route if route has changed
        if (orderList.length>0) {
            orderList.map(item => item[4] = newRoute)
        } else {
            swal ({
                text: "Need to enter a product first",
                icon: "warning",
                buttons: false,
                timer: 2000
              })
            return
        }

        let recent = clonedeep(orders)
        let newOrderList = orderList.concat(recent)
            for (let i=0; i<newOrderList.length; ++i ){
                for (let j=i+1; j<newOrderList.length; ++j){
                    if (  newOrderList[i][1] === newOrderList[j][1] &&
                          newOrderList[i][2] === newOrderList[j][2] &&
                          newOrderList[i][7] === newOrderList[j][7]){
                        newOrderList.splice(j,1);
                    }
                }
              }
          
        if (newOrderList){
          setOrders(newOrderList)

        setRoute(newRoute);
        }
    }

    return (
        <React.Fragment>
            <label>Routes:</label>
            <select id="routes" name="routes" value={route} onChange={handleChange} 
            disabled={routeIsOn ? false : true}>
            {routes ? routes.map(ro =>  <option id="routes" key={uuidv4()} name={ro}>{ro}</option>) : ''}
            </select>
        </React.Fragment>
    );
};

export default Routes