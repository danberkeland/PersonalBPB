import { CreateStandingArray, CreateCartDateArray, ChangeBPBDatetoJSDate } from './createCalendarEvents'

describe('Change BPB Date to JS Date', () => {
    test('converts date format from BPB to JS', () => {
        expect(ChangeBPBDatetoJSDate("01/20/2020")).toEqual(expect.stringContaining("2020-01-20"))
    })
})


window.alert = jest.fn();

// Create Standing Array

let StandingInput = [
    ["Day","ItemCode","Quantity","CustNum","PO","routeOverride","route","ItemName","CustomerName"],
    ["2","CR001","5","178","na","na","AM Pastry","Plain Croissant (Baked)","French Hospital"],
    ["3","CR002","5","178","na","na","AM Pastry","Chocolate Croissant (Baked)","French Hospital"],
    ["1","FR004","30","87","na","na","Pick up SLO","Dutch Torpedo","Sando's Deli"],
    ["3","FR004","30","87","na","na","Pick up SLO","Dutch Torpedo","Sando's Deli"]];


let StandingChosen = "French Hospital";
let expectedStandingArray = [1,2];

describe('Create Standing Array', () => {
    test('returns array in proper format', () => {   
        expect(CreateStandingArray(StandingInput, StandingChosen)).toEqual(expect.arrayContaining(expectedStandingArray))
    });
    test('returns a blank array if no standing order for customer is available', () => {
        expect(CreateStandingArray(StandingInput, 'Novo')).toEqual(expect.arrayContaining([]))
    });
    test('deals with the error when to standing order array is loaded', () => {
        expect(CreateStandingArray(null, StandingChosen)).toEqual("No Standing Order Loaded ...")
    });
});



// Create Cart Date Array

let CartInput = [["01/23/2021","CR006","1","170","na","na","AM North","Morning Bun (Baked)","15 degree C"],
    ["01/23/2021","CR001","1","170","na","na","AM North","Plain Croissant (Baked)","15 degree C"],
    ["01/23/2021","CR005","4","52","na","na","AM Pastry","Almond Croissant (Baked)","Ascendo Cafe"],
    ["01/24/2021","CR001","4","52","na","na","AM Pastry","Plain Croissant (Baked)","Ascendo Cafe"]];

let CartChosen = "Ascendo Cafe";
let expectedCartArray = ["2021-01-23","2021-01-24"];



describe('Create Cart Date Array', () => {
    test('returns array in proper format', () => {  
        expect(CreateCartDateArray(CartInput, CartChosen)).toEqual(expect.arrayContaining(expectedCartArray));
    });
    
    test('returns a blank array if no standing order for customer is available', () => {
        expect(CreateCartDateArray(CartInput, 'Novo')).toEqual(expect.arrayContaining([]))
    });
    
    test('deals with the error when to standing order array is loaded', () => {
        expect(CreateCartDateArray(null, CartChosen)).toEqual("No Orders Loaded ...");
        window.alert.mockClear();
    });
});