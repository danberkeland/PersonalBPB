import React, { useState, createContext, useEffect } from 'react';


export const OrdersContext = createContext();


export const OrdersProvider = (props) => {

    const convertJSDatetoBPBDate = (ISODate) => {
        const today = new Date();
        const offset = today.getTimezoneOffset();
        let newDate = new Date(ISODate.getTime()+(offset*60*1000));
        let splitISODate = newDate.toISOString().split('T')[0];
        let splitDate = splitISODate.split('-');
        let day = splitDate[1];
        let mo = splitDate[2];
        let year = splitDate[0];
        return day+"/"+mo+"/"+year;
    }

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)


    const [orders, setOrder] = useState([]);
    const [orderDate, setOrderDate] =useState(convertJSDatetoBPBDate(tomorrow));


    useEffect(() => {
        const apiUrl = "https://3rhpf3rkcg.execute-api.us-east-2.amazonaws.com/done";
        fetch(apiUrl)
        .then(res => res.json())
        .then(data => setOrder(data.body))
    },[]);


    return (
        <OrdersContext.Provider value={[orders, setOrder, orderDate, setOrderDate]}>
            {props.children}
        </OrdersContext.Provider>
    );
}







