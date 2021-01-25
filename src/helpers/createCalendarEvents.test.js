import { CreateStandingArray, CreateCartDateArray, ChangeBPBDatetoJSDate } from './createCalendarEvents'

import { mockCartInput, mockStandingInput } from './mockAPIdata/mockAPIdata';

describe('Change BPB Date to JS Date', () => {
    test('converts date format from presentational ("01/20/2020") to functional ("2020-01-20")', () => {
        expect(ChangeBPBDatetoJSDate("01/20/2020")).toEqual(expect.stringContaining("2020-01-20"))
    })
})


window.alert = jest.fn(); // Eliminates an irrelevant message that kept showing up in test report


let StandingInput = mockStandingInput();
let StandingChosen = "French Hospital";
let expectedStandingArray = [1,2];


describe('Create Standing Array', () => {
    test('returns array in proper format (i.e. "[1,2]")', () => {   
        expect(CreateStandingArray(StandingInput, StandingChosen)).toEqual(expect.arrayContaining(expectedStandingArray))
    });
    test('returns a blank array if no standing order for customer is available', () => {
        expect(CreateStandingArray(StandingInput, 'Novo')).toEqual(expect.arrayContaining([]))
    });
    test('deals with the error when to standing order array is loaded', () => {
        expect(CreateStandingArray(null, StandingChosen)).toEqual("No Standing Order Loaded ...")
    });
});


let CartInput = mockCartInput()
let CartChosen = "Ascendo Cafe";
let expectedCartArray = ["2021-01-23","2021-01-24"];


describe('Create Cart Date Array', () => {
    test('returns array in proper format (i.e. "["2021-01-23","2021-01-24"]")', () => {  
        expect(CreateCartDateArray(CartInput, CartChosen)).toEqual(expect.arrayContaining(expectedCartArray));
    });
    
    test('returns a blank array if no standing order for customer is available', () => {
        expect(CreateCartDateArray(CartInput, 'Novo')).toEqual(expect.arrayContaining([]))
    });
    
    test('deals with the error when to standing order array is loaded', () => {
        expect(CreateCartDateArray(null, CartChosen)).toEqual("No Orders Loaded ...");
        window.alert.mockClear();  // Eliminates an irrelevant message that kept showing up in test report
    });
});