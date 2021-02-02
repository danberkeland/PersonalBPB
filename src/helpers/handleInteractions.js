
export const createModifiedQtyPresentList = (e,presentedList) => {
    if (e.key === "Enter"){
        document.getElementById("orderCommand").focus()
    }
    let newQty = e.target.value
    let indexToFind = e.target.name
    let foundIndex = presentedList.findIndex(line => line[1] === indexToFind)
    let presentedListToModify = [...presentedList]
    presentedListToModify[foundIndex][0] = newQty
    return presentedListToModify  
}

export const createRemovalPresentList = (e,presentedList) => {
    let newQty = 0
    let indexToFind = e.target.id
    let foundIndex = presentedList.findIndex(line => line[1] === indexToFind)
    let presentedListToModify = [...presentedList]
    presentedListToModify[foundIndex][0] = newQty
    return presentedListToModify  
}