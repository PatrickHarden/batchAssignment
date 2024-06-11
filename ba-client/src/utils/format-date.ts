import { format, parse, getHours } from 'date-fns';

// TODO: refactor to have formatDate accept Date object, not string
// default output: '03/02/2023 at 08:00 PM'
export const formatDate = (date: string, dateFormat = "MM/dd/yyyy 'at' hh:mm a") => {
  return format(new Date(date), dateFormat);
};

// default FROM format: "MM/dd/yyyy 'at' hh:mm a"
// default output format: Wed Jul 19 2023 21:00:00 GMT-0400 (Eastern Daylight Time)
export const parseDate = (date: string, dateFormat = "MM/dd/yyyy 'at' hh:mm a") => {
  return parse(date, dateFormat, new Date());
};

// default format outputs '8:00 PM'
export const getTimeFromDate = (date: Date, dateFormat = 'h:mm a') => {
  return format(date, dateFormat);
};

// converts '8:00 PM' to 20
// output is an INTEGER
export const convertToMilitaryTime = (time: string) => {
  const newTime = typeof time === 'string' ? time : time[0];

  const dateTime = parse(newTime, 'h:mm a', new Date());
  return getHours(dateTime);
};

const sevenAM = '7:00 AM';
const eightAM = '8:00 AM';
const nineAM = '9:00 AM';
const tenAM = '10:00 AM';
const elevenAM = '11:00 AM';
const noon = '12:00 PM';
const onePM = '1:00 PM';
const twoPM = '2:00 PM';
const threePM = '3:00 PM';
const fourPM = '4:00 PM';
const fivePM = '5:00 PM';
const sixPM = '6:00 PM';
const sevenPM = '7:00 PM';
const eightPM = '8:00 PM';
const ninePM = '9:00 PM';
const tenPM = '10:00 PM';
const elevenPM = '11:00 PM';
const midnight = '12:00 AM';
const oneAM = '1:00 AM';
const twoAM = '2:00 AM';
const threeAM = '3:00 AM';
const fourAM = '4:00 AM';
const fiveAM = '5:00 AM';
const sixAM = '6:00 AM';

export const timeOptions = [
  {
    title: sevenAM,
    value: sevenAM
  },
  {
    title: eightAM,
    value: eightAM
  },
  {
    title: nineAM,
    value: nineAM
  },
  {
    title: tenAM,
    value: tenAM
  },
  {
    title: elevenAM,
    value: elevenAM
  },
  {
    title: noon,
    value: noon
  },
  {
    title: onePM,
    value: onePM
  },
  {
    title: twoPM,
    value: twoPM
  },
  {
    title: threePM,
    value: threePM
  },
  {
    title: fourPM,
    value: fourPM
  },
  {
    title: fivePM,
    value: fivePM
  },
  {
    title: sixPM,
    value: sixPM
  },
  {
    title: sevenPM,
    value: sevenPM
  },
  {
    title: eightPM,
    value: eightPM
  },
  {
    title: ninePM,
    value: ninePM
  },
  {
    title: tenPM,
    value: tenPM
  },
  {
    title: elevenPM,
    value: elevenPM
  },
  {
    title: midnight,
    value: midnight
  },
  {
    title: oneAM,
    value: oneAM
  },
  {
    title: twoAM,
    value: twoAM
  },
  {
    title: threeAM,
    value: threeAM
  },
  {
    title: fourAM,
    value: fourAM
  },
  {
    title: fiveAM,
    value: fiveAM
  },
  {
    title: sixAM,
    value: sixAM
  }
];
