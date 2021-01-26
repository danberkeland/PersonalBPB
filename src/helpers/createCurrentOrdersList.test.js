import { CreateCartList, CreateStandingList } from './createCurrentOrdersList'



// Create Standing Data

let StandingInput = [
    ["Day","ItemCode","Quantity","CustNum","PO","routeOverride","route","ItemName","CustomerName"],
    ["7","CR001","5","178","na","na","AM Pastry","Plain Croissant (Baked)","15 degree C"],
    ["7","CR002","5","178","na","na","AM Pastry","Chocolate Croissant (Baked)","15 degree C"],
    ["7","FR004","30","87","na","na","Pick up SLO","Dutch Torpedo","Sando's Deli"],
    ["6","FR004","30","87","na","na","Pick up SLO","Dutch Torpedo","Sando's Deli"]];


let Chosen = "15 degree C";
let BPBDate = "01/23/2021"
let standingDate = "7"


// Create Cart Date Data

let CartInput = [["01/23/2021","CR006","1","170","na","na","AM North","Morning Bun (Baked)","15 degree C"],
    ["01/23/2021","CR001","1","170","na","na","AM North","Plain Croissant (Baked)","15 degree C"],
    ["01/23/2021","CR005","4","52","na","na","AM Pastry","Almond Croissant (Baked)","Ascendo Cafe"],
    ["01/24/2021","CR001","4","52","na","na","AM Pastry","Plain Croissant (Baked)","Ascendo Cafe"]];



    
describe('Create Cart List', () => {
    test('returns properly formatted Cart List', () => {
        expect(CreateCartList(CartInput, BPBDate, Chosen))
        .toEqual(expect.arrayContaining(
            [["1", "Morning Bun (Baked)", "15 degree C"], ["1", "Plain Croissant (Baked)", "15 degree C"]]))
    });
});

describe('Create Standing List', () => {
    test('returns properly formatted Standing List', () => {
        expect(CreateStandingList(StandingInput, standingDate, Chosen))
        .toEqual(expect.arrayContaining(
            [["5", "Plain Croissant (Baked)", "15 degree C"], ["5", "Chocolate Croissant (Baked)", "15 degree C"]]))
    });
});
  