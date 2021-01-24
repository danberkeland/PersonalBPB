import { CreateStandingArray } from './createCalendarEvents'

let StandingInput = [
    ["Day","ItemCode","Quantity","CustNum","PO","routeOverride","route","ItemName","CustomerName"],
    ["2","CR001","5","178","na","na","AM Pastry","Plain Croissant (Baked)","French Hospital"],
    ["3","CR002","5","178","na","na","AM Pastry","Chocolate Croissant (Baked)","French Hospital"],
    ["1","FR004","30","87","na","na","Pick up SLO","Dutch Torpedo","Sando's Deli"],
    ["3","FR004","30","87","na","na","Pick up SLO","Dutch Torpedo","Sando's Deli"]];


let StandingChosen = "French Hospital";
let expectedStandingArray = [1,2];



test('returns array in proper format', () => {   
    expect(CreateStandingArray(StandingInput, StandingChosen)).toEqual(expect.arrayContaining(expectedStandingArray))
});

test('returns a blank array if no standing order for customer is available', () => {
    expect(CreateStandingArray(StandingInput, 'Novo')).toEqual(expect.arrayContaining([]))
})

test('deals with the error when to standing order array is loaded', () => {
    expect(CreateStandingArray(null, StandingChosen)).toThrow()
})