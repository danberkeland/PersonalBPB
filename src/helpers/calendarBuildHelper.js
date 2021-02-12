export const ChangeBPBDatetoJSDate = (date) => {
    let BPBDateParts = date.split('/')
    let JSDate = BPBDateParts[2]+"-"+BPBDateParts[0]+"-"+BPBDateParts[1]
    return JSDate;
}


export const CreateStandingArray = (standing, chosen) => {

    if (!standing) {
        alert("No Standing Order Loaded ...")
        return "No Standing Order Loaded ..."
    }

    let standingArray = standing ? standing.filter(order => order[8] === chosen) : [];
    standingArray = standingArray.map(order => Number(order[0])-1)
    let uniqueStanding = new Set(standingArray);
    return [...uniqueStanding]
}


export const CreateCartDateArray = (orders, chosen) => {

    if (!orders) {
        alert("No Orders Loaded ...")
        return "No Orders Loaded ..."
    }

    let cartDateArray = orders ? orders.filter(order => order[2] === chosen) : [];
    cartDateArray = cartDateArray.map(order => ChangeBPBDatetoJSDate(order[7]))
    let uniqueCart = new Set(cartDateArray);
    return [...uniqueCart]
}


export const CreateBlankCartDateArray = (orders, chosen)=> {

    let cartDateBlankArray = orders ? orders.filter(order => order[2] === chosen) : [];
    cartDateBlankArray = cartDateBlankArray.map(order => ({'ddate':order[7], 'qqty': Number(order[0])}));
    let holder = {}
    cartDateBlankArray.forEach(d => holder.hasOwnProperty(d.ddate) ? holder[d.ddate] = holder[d.ddate] + d.qqty :
        holder[d.ddate] = d.qqty);

    let BlankDateArray = [];
    for (var prop in holder) {
        let i = prop.split('/')
        let prop2 = i[2]+"-"+i[0]+"-"+i[1]
        BlankDateArray.push([prop2,holder[prop]])
    }

    BlankDateArray = BlankDateArray.filter(ob3 => ob3[1] === 0)
    BlankDateArray = BlankDateArray.map(ob4 => ob4[0])

    return BlankDateArray

}