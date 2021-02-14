import { useEffect, useState } from 'react'


export const useFetch = url => {
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


export const FilterOrdersDups = data => {
    let groupedData = data.map(item => [(
        item[1]+"_"+
        item[2]+"_"+
        item[3]+"_"+
        item[4]+"_"+
        item[7]),item[0],item[5],item[6],item[8]]
        )

    for (let i=0; i<groupedData.length; ++i ){
        for (let j=i+1; j<groupedData.length; ++j){
            if (groupedData[i][0] === groupedData[j][0]){
                groupedData.splice(j,1);
            }
        }
    }

    let reassembledData = groupedData.map(item => [
        item[1],
        item[0].split("_")[0],
        item[0].split("_")[1],
        item[0].split("_")[2],
        item[0].split("_")[3],
        item[2],
        item[3] === "TRUE" ? true : false,
        item[0].split("_")[4],
        item[4]
    ])
    
    return reassembledData
}


export const FilterDupsByIndex = (data,ind) => {


    for (let i=0; i<data.length; ++i ){
        for (let j=i+1; j<data.length; ++j){
            if (data[i][ind] === data[j][ind]){
                data.splice(j,1);
            }
        }
    }

    return data
}


export const FilterStandHoldDups = data => {
    let groupedData = data.map(item => [(
        item[0]+"_"+
        item[7]+"_"+
        item[8]),item[1],item[2],item[3],item[4],item[5],item[6]]
        )

    for (let i=0; i<groupedData.length; ++i ){
        for (let j=i+1; j<groupedData.length; ++j){
            if (groupedData[i][0] === groupedData[j][0]){
                groupedData.splice(j,1);
            }
        }
    }

    let reassembledData = groupedData.map(item => [
        item[0].split("_")[0],
        item[1],
        item[2],
        item[3],
        item[4],
        item[5],
        item[6],
        item[0].split("_")[1],
        item[0].split("_")[2],
    ])
    
    return reassembledData
}