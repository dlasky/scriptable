// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;

const lineChart = ({ width, height }) => {
  const ctx = new DrawContext();
  ctx.size = new Size(width, height);
  return ctx;
};

const valuesToPoints = ({ values, width, height }) => {
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const difference = maxValue - minValue;
  const count = values.length;
  const step = width / (count - 1);
  const points = values.map((current, index, all) => {
    const x = step * index;
    const y = height - ((current - minValue) / difference) * height;
    return new Point(x, y);
  });
  return points;
};

const stringToColor = (string) => {
  if (typeof string === "string") {
    return new Color(string);
  }
  return string;
};

const draw = ({ chart, path, stroke, fill }) => {
  if (stroke) {
    chart.setStrokeColor(stringToColor(stroke));
    chart.addPath(path);
    chart.strokePath();
  }
  if (fill) {
    chart.setFillColor(stringToColor(fill));
    chart.addPath(path);
    chart.fillPath();
  }
};

const getLine = ({ chart, values, stroke, fill }) => {
  const { width, height } = chart.size;
  const path = new Path();
  const pts = valuesToPoints({ values, width, height });
  path.move(new Point(0, height));
  pts.map((pt) => {
    path.addLine(pt);
  });
  path.addLine(new Point(width, height));
  draw({ chart, path, stroke, fill });
  return path;
};

const getSmoothLine = ({ chart, values, stroke, fill }) => {
  const { width, height } = chart.size;
  const points = valuesToPoints({ values, width, height });
  const path = new Path();
  path.move(new Point(0, height));
  path.addLine(points[0]);
  for (let i = 0; i < points.length - 1; i++) {
    const xAvg = (points[i].x + points[i + 1].x) / 2;
    const yAvg = (points[i].y + points[i + 1].y) / 2;
    const avg = new Point(xAvg, yAvg);
    const cp1 = new Point((xAvg + points[i].x) / 2, points[i].y);
    const next = new Point(points[i + 1].x, points[i + 1].y);
    const cp2 = new Point((xAvg + points[i + 1].x) / 2, points[i + 1].y);
    path.addQuadCurve(avg, cp1);
    path.addQuadCurve(next, cp2);
  }
  path.addLine(new Point(width, height));
  path.closeSubpath();
  draw({ chart, path, stroke, fill });
  return path;
};

module.exports = { lineChart, valuesToPoints, getLine, getSmoothLine };
