export const convertDatetoBPBDate = (ISODate) => {
   
    let splitDate = ISODate.split('-');
    let day = splitDate[1];
    let mo = splitDate[2];
    let year = splitDate[0];
    return day+"/"+mo+"/"+year;
    
}

export const convertDatetoBPBDateMinusYear = (ISODate) => {
   
    let splitDate = ISODate.split('-');
    let day = splitDate[1];
    let mo = splitDate[2];
    return day+"/"+mo;
    
}

export const convertDatetoStandingDate = (entry) => {
    let jsDate= new Date(entry)
    return (((jsDate.getDay()+1)%7)+1).toString()
}


export const todayPlus = () => {
    let today = new Date()
    let todaySend = today.toISOString().split('T')[0]
    console.log(todaySend)

    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate()+1)
    let tomorrowSend = tomorrow.toISOString().split('T')[0]

    let twoDay = new Date()
    twoDay.setDate(twoDay.getDate()+2)
    let twoDaySend = twoDay.toISOString().split('T')[0]

    return [todaySend, tomorrowSend, twoDaySend ]
}

export const daysOfTheWeek = () => {
    let timeDelta = 0
    let today = new Date()
    let dayOfWeek = Number(today.getDay())
    for (let i=0; i<7; i++){
        if (dayOfWeek === i){
            timeDelta = 7-i;
        }
    }
    let Sun = new Date()
    Sun.setDate(today.getDate() + timeDelta)
    let SunSend = Sun.toISOString().split('T')[0]

    let Mon = new Date()
    Mon.setDate(today.getDate() + (timeDelta+1)%7)
    let MonSend = Mon.toISOString().split('T')[0]

    let Tues = new Date()
    Tues.setDate(today.getDate() + (timeDelta+2)%7)
    let TuesSend = Tues.toISOString().split('T')[0]

    let Wed = new Date()
    Wed.setDate(today.getDate() + (timeDelta+3)%7)
    console.log(Wed)
    let WedSend = Wed.toISOString().split('T')[0]

    let Thurs = new Date()
    Thurs.setDate(today.getDate() + (timeDelta+4)%7)
    let ThursSend = Thurs.toISOString().split('T')[0]

    let Fri = new Date()
    Fri.setDate(today.getDate() + (timeDelta+5)%7)
    let FriSend = Fri.toISOString().split('T')[0]

    let Sat = new Date()
    Sat.setDate(today.getDate() + (timeDelta+6)%7)
    let SatSend = Sat.toISOString().split('T')[0]


    return [SunSend,MonSend,TuesSend,WedSend,ThursSend,FriSend,SatSend]


    
}

export const tomorrow = () => {
    let today = new Date()
    today.setMinutes(today.getMinutes()-today.getTimezoneOffset()) 
    let tomorrow = new Date()
    tomorrow.setDate(today.getDate()+1)

    return tomorrow.toISOString().split('T')[0]
}



