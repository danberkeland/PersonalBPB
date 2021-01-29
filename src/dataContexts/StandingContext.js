import React, { useState, createContext, useContext, useEffect } from 'react';

require('dotenv').config()

export const StandingContext = createContext();


export const StandingProvider = (props) => {

    const [standing, setStanding] = useState([]);

    return (
        <StandingContext.Provider value={{ standing, setStanding }}>
            {props.children}
        </StandingContext.Provider>
    );   
    
};


const useFetch = url => {
    const [state, setState] = useState({
        loading: true,
        error: false,
        data: [],
    });

    useEffect(() => {
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                return res.json();
            })
            .then(data => setState({loading: false, error: false, data: data.body }))
            .catch(error => setState({ loading: false, error, data: [] }));
    }, [url]);

    return state;
};




export const StandingLoad = () => {

    const { loading, error, data } = useFetch(process.env.REACT_APP_API_STANDING,[]);

    const { setStanding } = useContext(StandingContext)

    useEffect(() => {
        data.sort(function(a,b){return a[2]>b[2] ? 1 : -1;})
        setStanding(data);
    },[data, setStanding]);

    return (
        <React.Fragment>
            { loading && <p>Loading Standing Orders ...</p>}
            { error && <p> error while loading standing orders!</p>}
        </React.Fragment>
    )
    
};

