// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: vials;
const { lineChart, valuesToPoints, getLine, getSmoothPath } =
  importModule("/lib/Chart");

console.log(args.widgetParameter)

const state = args.widgetParameter || "california"

// todo use my sizing script here
const height = 240;
const width = 450; //620;

const url =
  `https://static01.nyt.com/newsgraphics/2021/coronavirus-tracking/data/pages/us/${state}-covid-cases/data.json`;

const rawData = await new Request(url).loadJSON();
const values = rawData.location.cases;
//calcluate the daily values
const dailyValues = values.map((value, index) => {
  if (index === 0) {
    return value;
  } else {
    return value - values[index - 1];
  }
});
// calculate the 7 day moving average of values
const movingAverage = dailyValues.map((value, index) => {
  if (index < 7) {
    return value;
  } else {
    // calculate the average of the last 7 values
    const last7 = dailyValues.slice(index - 7, index);
    const sum = last7.reduce((a, b) => a + b);
    return sum / 7;
  }
});

const chart = lineChart({
  width,
  height,
});// 
chart.opaque = false;
getLine({
  chart,
  values,
  stroke: Color.white(),
});

getLine({
  chart,
  values: dailyValues,
  stroke: Color.red(),
});
chart.setLineWidth(2)
getLine({
  chart,
  values: movingAverage,
  stroke: Color.orange(),
});

const widget = new ListWidget()
widget.addText(state + " cases:")
for(var i=1; i<4; i++) {
widget.addText("🦠"+dailyValues[dailyValues.length-i])
}
widget.backgroundImage = chart.getImage();

const tod = new Date();
tod.setDate(tod.getDate() + 1);
widget.refreshAfterDate = tod;

if (config.runsInWidget) {
  // Runs inside a widget so add it to the homescreen widget
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}
Script.complete();
