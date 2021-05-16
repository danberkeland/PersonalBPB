
const { DateTime } = require("luxon");

export const convertDatetoBPBDate = (ISODate) => {
  let splitDate = ISODate.split("-");
  let day = splitDate[1];
  let mo = splitDate[2];
  let year = splitDate[0];
  return day + "/" + mo + "/" + year;
};

export const convertDatetoBPBDateMinusYear = (ISODate) => {
  let splitDate = ISODate.split("-");
  let day = splitDate[1];
  let mo = splitDate[2];
  return day + "/" + mo;
};

export const todayPlus = () => {
  let today = DateTime.now().setZone("America/Los_Angeles");
  let todaySend = today.toString().split("T")[0];

  let tomorrow = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: 1 });
  let tomorrowSend = tomorrow.toString().split("T")[0];

  let twoDay = DateTime.now().setZone("America/Los_Angeles").plus({ days: 2 });
  let twoDaySend = twoDay.toString().split("T")[0];

  let threeDay = DateTime.now().setZone("America/Los_Angeles").plus({ days: 3 });
  let threeDaySend = threeDay.toString().split("T")[0];

  return [todaySend, tomorrowSend, twoDaySend, threeDaySend];
};

export const daysOfTheWeek = () => {
  let timeDelta = 0;
  let dayOfWeek = DateTime.now().setZone("America/Los_Angeles").weekday;
  for (let i = 0; i < 7; i++) {
    if (dayOfWeek === i) {
      timeDelta = 7 - i;
    }
  }
  let Sun = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: timeDelta });
  let SunSend = Sun.toString().split("T")[0];

  let Mon = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 1) % 7 });
  let MonSend = Mon.toString().split("T")[0];

  let Tues = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 2) % 7 });
  let TuesSend = Tues.toString().split("T")[0];

  let Wed = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 3) % 7 });
  let WedSend = Wed.toString().split("T")[0];

  let Thurs = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 4) % 7 });
  let ThursSend = Thurs.toString().split("T")[0];

  let Fri = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 5) % 7 });
  let FriSend = Fri.toString().split("T")[0];

  let Sat = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 6) % 7 });
  let SatSend = Sat.toString().split("T")[0];

  return [SunSend, MonSend, TuesSend, WedSend, ThursSend, FriSend, SatSend];
};



export const daysOfBillingWeek = () => {
  let timeDelta = 0;
  let dayOfWeek = DateTime.now().setZone("America/Los_Angeles").weekday;
  
  for (let i = 0; i < 7; i++) {
    if (dayOfWeek === i) {
      timeDelta = 7 - i;
    }
  }
  let offset=7
  if (dayOfWeek<=0){offset=0}
  let Sun = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (7+timeDelta-offset) });
  let SunSend = Sun.toString().split("T")[0];

  if (dayOfWeek<=1){offset=0}
  let Mon = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 1) % 7)-offset });
  let MonSend = Mon.toString().split("T")[0];

  if (dayOfWeek<=2){offset=0}
  let Tues = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 2) % 7)-offset });
  let TuesSend = Tues.toString().split("T")[0];

  if (dayOfWeek<=3){offset=0}
  let Wed = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 3) % 7)-offset });
  let WedSend = Wed.toString().split("T")[0];

  if (dayOfWeek<=4){offset=0}
  let Thurs = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 4) % 7)-offset });
  let ThursSend = Thurs.toString().split("T")[0];

  if (dayOfWeek<=5){offset=0}
  let Fri = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 5) % 7)-offset });
  let FriSend = Fri.toString().split("T")[0];

  if (dayOfWeek<=6){offset=0}
  let Sat = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 6) % 7)-offset });
  let SatSend = Sat.toString().split("T")[0];

  return [SunSend, MonSend, TuesSend, WedSend, ThursSend, FriSend, SatSend];
};


export const tomorrow = () => {
  let tomorrow = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: 1 });
  tomorrow = tomorrow.toString().split("T")[0];
  return tomorrow;
};



