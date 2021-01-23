export const convertDatetoBPBDate = (ISODate) => {
   
    let splitDate = ISODate.split('-');
    let day = splitDate[1];
    let mo = splitDate[2];
    let year = splitDate[0];
    return day+"/"+mo+"/"+year;
    
}

export const convertDatetoStandingDate = (entry) => {
    let jsDate= new Date(entry)
    return ((jsDate.getDay()+1)%7).toString()
}

export const tomorrow = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate()+1)
    return tomorrow.toISOString().split('T')[0]
}

