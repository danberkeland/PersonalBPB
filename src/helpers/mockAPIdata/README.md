# Mock API configurations

(VERY IMPORTANT - If API formats ever change in AWS Lambda, need to make EXACT format changes to `mockAPIdata/mockAPIdata.js`)

To ensure that unit testing is accurate, maintain this log with current API configurations.

---------

## Jan 25, 2021

### Orders Context
["01/23/2021","CR006","1","170","na","na","AM North","Morning Bun (Baked)","15 degree C"]

- Orders[0] = "01/23/2021" // *delivery date*
- Orders[1] = "CR006" // *product ID*
- Orders[2] = "1" // *quantity*
- Orders[3] = "170" // *customer ID Number*
- Orders[4] = "na" // *po#/notes*
- Orders[5] = "na" // *ignore*
- Orders[6] = "AM North" // *route name*
- Orders[7] = "Morning Bun (Baked)" // *product name*
- Orders[8] = "15 degree C" // *customer name*

### Standing Context
["2","CR001","5","178","na","na","AM Pastry","Plain Croissant (Baked)","French Hospital"]

- Standing[0] = "2" // *day of week (0-6, Mon-Sun)*
- Standing[1] = "CR001" // *Product ID*
- Standing[2] = "5" // *quantity*
- Standing[3] = "178" // *customer ID*
- Standing[4] = "na" // *ignore*
- Standing[5] = "na" // *ignore*
- Standing[6] = "AM Pastry" // *route*
- Standing[7] = "Plain Croissant (Baked)" // *product name*
- Standing[8] = "French Hospital" // *customer name*


