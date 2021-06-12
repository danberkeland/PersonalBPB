export const allOrdersFilter = (ord, loc) => {
  return (
    ord.packGroup === "rustic breads" ||
    (ord.packGroup === "retail" && ord.where.includes(loc)) ||
    (ord.routeDepart === "Carlton" &&
      ord.packGroup === "baked pastries" &&
      ord.doughType !== "Croissant") ||
    ord.doughType === "Ciabatta"
  );
};

export const DayOneFilter = (ord, loc) => {
  return (
    ord.where.includes("Carlton") &&
    (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
    ((ord.routeStart >= 8 && ord.routeDepart === "Prado") ||
      ord.routeDepart === "Carlton" ||
      ord.route === "Pick up Carlton" ||
      ord.route === "Pick up SLO")
  );
};

export const DayTwoFilter = (ord, loc) => {
  return (
    ord.where.includes("Carlton") &&
    (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
    ord.routeStart < 8 &&
    ord.routeDepart === "Prado"
  );
};

export const pocketFilter = (ord, loc) => {
  return ord.doughType === "French";
};

export const whatToMakeFilter = (ord, loc) => {
  return (
    ord.where.includes("Carlton") &&
    (ord.packGroup === "rustic breads" || ord.packGroup === "retail")
  );
};

export const baker1PocketFilter = (ord, loc) => {
  return ord.doughType === "Baguette";
};
