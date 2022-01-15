import { checkForDelivDate } from "../pages/ordering/Parts/OrderCommandLine";


const { DateTime } = require("luxon");

let tomorrow = DateTime.now()
.setZone("America/Los_Angeles")
.plus({ days: 1 }).toString().split("T")[0];
;

console.log(tomorrow)

describe("Test checkForDelivDate", () => {
    test("Takes an entry and parses out date info", () => {
        const entry1 = "1bag kberg tomorrow"
        const expected1 = tomorrow
        const actualValue1  = checkForDelivDate(entry1)
       
        expect(actualValue1).toEqual(expected1)
    })
    
    test("Returns null when no date info", () => {
        const entry2 = "1bag kberg"
        const actualValue2 = checkForDelivDate(entry2)
    
        expect(actualValue2).toBeNull()
    })

    test("Must return format yyyy-mm-dd", () => {
        const entry1 = "1bag kberg tomorrow"
        const actualValue1  = checkForDelivDate(entry1)
        const entry2 = "2bri sat"
        const actualValue2  = checkForDelivDate(entry2)
       
        expect(actualValue1).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(actualValue2).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
})