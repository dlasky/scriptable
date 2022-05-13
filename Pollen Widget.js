// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: tree;

const zip = args.widgetParameter || 12345

const cur = "https://www.pollen.com/api/forecast/current/pollen/"+zip;

const fc = "https://www.pollen.com/api/forecast/outlook/"+zip;

const scale = {
  low: [0, 2.4],
  lowMedium: [2.5, 4.8],
  medium: [4.9, 7.2],
  highMedium: [7.3, 9.6],
  high: [9.7, 12],
};

const scaleColors = {
  low: new Color("#339900"),
  lowMedium: new Color("#99cc33"),
  medium: new Color("#ffcc00"),
  highMedium: new Color("#ff9966"),
  high: new Color("#cc3300"),
};

const getScale = (index) => {
  console.log(index)
  const [sc] = Object.entries(scale).find(
    ([_, range]) => index >= range[0] && index <= range[1]
  );
  return sc;
};

const getColor = (sc) => scaleColors[sc];

const getData = async (url) => {
  const r = new Request(url);
  r.headers = {
    Referer: url,
  };
  const json = await r.loadJSON();
  return json;
};

const data = await getData(cur);
const fcdata = await getData(fc);

const at = new Date();
const df = new DateFormatter();
df.useShortDateStyle();
df.useShortTimeStyle();

const w = new ListWidget();

const content = w.addStack();
content.layoutVertically();
content.spacing = 10;

const title = content.addStack();
const loc = title.addText(data.Location.DisplayLocation);
loc.font = Font.boldSystemFont(14);

title.addSpacer(100);

const fetched = title.addText("data fetched at ");
fetched.font = Font.ultraLightSystemFont(8);
const dt = title.addDate(new Date());
dt.font = Font.ultraLightSystemFont(8);
dt.applyTimeStyle();

const outlook = content.addText(fcdata.Outlook);
outlook.linelimit = 2;
outlook.minimumScaleFactor = 0.25;

const stack = content.addStack();
stack.layoutHorizontally();
stack.topAlignContent();
stack.spacing = 10;

data.Location.periods.forEach((p) => {
  const vstack = stack.addStack();
  vstack.layoutVertically();
  const day = vstack.addText(p.Type);
  day.font = Font.thinSystemFont(8);
  const amount = vstack.addText(p.Index.toFixed(1));
  amount.font = Font.boldSystemFont(20);
  amount.textColor = getColor(getScale(p.Index));
  const type = vstack.addText(p.Triggers.map((t) => t.Name).join(", "));
  type.linelimit = 2;
  type.minimumScaleFactor = 0.5;
});

const s1 = new Color("#42F");
const s2 = new Color("#326");
const l = new LinearGradient();
l.colors = [s1, s2];
l.locations = [0, 1];

w.backgroundGradient = l;

const tod = new Date();
tod.setDate(tod.getDate()+1)
w.refreshAfterDate= tod

w.presentMedium();

Script.complete();
