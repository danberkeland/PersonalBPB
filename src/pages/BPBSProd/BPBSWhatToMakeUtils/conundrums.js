
//      THE FRENCH PRODUCTION CONUNDRUM
//
//      High St French are made fresh daily but all other french are made
//      one day ahead of time.  By system default, "High French" numbers
//      would appear in Fresh Bake and all other "French" would appear in
//      shelf bake.  This Conundrum solver groups all french in Shelf Bake.



export const handleFrenchConundrum = (freshProds, shelfProds,database) => {
    const [products, customers, routes, standing, orders] = database;
    let highInd = freshProds.findIndex(fresh => fresh.forBake==="High French") 
    let frenchInd = shelfProds.findIndex(fr => fr.forBake==="French")
    let highqty = freshProds[highInd].qty
    console.log("High",highqty)
    console.log("Other", shelfProds[frenchInd].qty)
    console.log("need early",shelfProds[frenchInd].needEarly)
    let current = products[products.findIndex(pr => pr.forBake === "French")].currentStock
    let realNeedEarly = shelfProds[frenchInd].qty - current
    if (realNeedEarly<0){
        realNeedEarly = 0
    }
    console.log("realNeedEarly",realNeedEarly)
    console.log("currentStock",current)
    shelfProds[frenchInd].qty += highqty;
    shelfProds[frenchInd].needEarly += highqty;
    shelfProds[frenchInd].makeTotal += highqty;
    freshProds = freshProds.filter(prod => prod.forBake !== "High French")
    
    
    return [ freshProds, shelfProds ]
}