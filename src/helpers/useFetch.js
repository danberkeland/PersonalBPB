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
        item["prodName"]+"_"+
        item["custName"]+"_"+
        item["PONote"]+"_"+
        item["route"]+"_"+
        item["delivDate"]),item["qty"],item["SO"],item["isWhole"],item["timeStamp"]]
        )

    for (let i=0; i<groupedData.length; ++i ){
        for (let j=i+1; j<groupedData.length; ++j){
            while(groupedData[i][0] === groupedData[j][0]){
                groupedData.splice(j,1);
            }
        }
    }

    let reassembledData = groupedData.map(item => ({
        "qty": item[1],
        "prodName": item[0].split("_")[0],
        "custName": item[0].split("_")[1],
        "PONote": item[0].split("_")[2],
        "route": item[0].split("_")[3],
        "SO": item[2],
        "isWhole": item[3] === "TRUE" ? true : false,
        "delivDate": item[0].split("_")[4],
        "timeStamp": item[4]
    }))
    return reassembledData
}


export const FilterDupsByIndex = (data,ind) => {


    for (let i=0; i<data.length; ++i ){
        for (let j=i+1; j<data.length; ++j){
            while (data[i][ind] === data[j][ind]){
                data.splice(j,1);
            }
        }
    }

    return data
}


export const FilterStandHoldDups = data => {
    let groupedData = data.map(item => [(
        item["dayNum"]+"_"+
        item["prodName"]+"_"+
        item["custName"]),"na",item["qty"],"na",item["timeStamp"],"na","na"]
        )

    for (let i=0; i<groupedData.length; ++i ){
        for (let j=i+1; j<groupedData.length; ++j){
            while (groupedData[i][0] === groupedData[j][0]){
                groupedData.splice(j,1);
            }
        }
    }

    let reassembledData = groupedData.map(item => ({
        "dayNum": item[0].split("_")[0],
        "qty": item[2],
        "timeStamp": item[4],
        "prodName": item[0].split("_")[1],
        "custName": item[0].split("_")[2],
    }))
    
    return reassembledData
}