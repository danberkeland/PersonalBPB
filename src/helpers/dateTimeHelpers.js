export const convertDatetoBPBDate = (ISODate) => {
   
    let splitDate = ISODate.split('-');
    let day = splitDate[1];
    let mo = splitDate[2];
    let year = splitDate[0];
    return day+"/"+mo+"/"+year;
    
}

export const convertDatetoStandingDate = (entry) => {
    let jsDate= new Date(entry)
    return (((jsDate.getDay()+1)%7)+1).toString()
}

export const tomorrow = () => {
    let today = new Date()
    let utc_offset = today.getTimezoneOffset()
    today.setMinutes(today.getMinutes()-utc_offset)
    let tomorrow = new Date()
    tomorrow.setDate(today.getDate()+1)

    return tomorrow.toISOString().split('T')[0]
}

