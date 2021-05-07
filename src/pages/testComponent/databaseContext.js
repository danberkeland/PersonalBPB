import React,{ useState } from 'react';
import { useEffect } from 'react/cjs/react.development';

import DatabaseServices from './databaseServices';

let MyContext;
let { Provider } = (MyContext = React.createContext())

function MyProvider({ children }) {
    const [products, setProducts] = useState([]);
    const databaseServices = new DatabaseServices();

    useEffect(() => {
        databaseServices.getProducts().then(data => setProducts(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    return <Provider value={{ products, setProducts }}>{children}</Provider>
}
export{ MyContext, MyProvider}