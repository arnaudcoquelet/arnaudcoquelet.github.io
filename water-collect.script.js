var dygraphs_data;
var g;

var offset = -1;
var one_day = -1;

var legend_display = 'always';
if ($(window).width() < 768) {
  legend_display = 'onmouseover';
}


dygraphs_data = 'http://arnaudcoquelet.github.io/water-meter.csv';
dygraphs_data = 'http://perso.eckoteck.com/water-meter.csv';
draw_graph();


function formatDate(d, short=false) {
  if (short) {
    return moment.unix(d).format('H:mm');
  } else {
    return moment.unix(d).format('YYYY/MM/DD - H:mm:ss');
  }
}

function get_max_min(cur_max, cur_min, val) {
    if (val > cur_max) {
      cur_max = val;
    }
    if (cur_min < 0 && val > 0) {
      cur_min = val;
    }
    if (val > 0 && val < cur_min) {
      cur_min = val;
    }
    return [cur_max, cur_min];
}


function draw_graph() {
  g = new Dygraph(
      document.getElementById("dygraph"),
      dygraphs_data,
      {
        labels: [ "Date", "Field1", "Field2", "MeterId", "Field4", "Field5", "Field6", "Usage","Field8","Field9","Field10", ],
        series: {
          //"Usage": { axis: 'y1'},
          "Usage": { axis: 'y1', showInRangeSelector: true },
          "Field4": { axis: 'y1'},
        },
        legend: legend_display,
        labelsSeparateLines: true,
        connectSeparatedPoints: true,
        fillGraph: true,
        colors: [
          "blue",
        ],
        ylabel: "Usage",
        axes: {
          x: {
            valueFormatter: function(timestamp) {
              return formatDate(timestamp, true);
              //return timestamp;
            },
            axisLabelFormatter: function(timestamp) {
              return formatDate(timestamp, true);
              //return timestamp;
            }
          },
          y: {
          }
        },
        showRangeSelector: true,
        rangeSelectorPlotFillColor: 'green',
      }
  );
  g.ready(function() {
    //averages();
  });
}

function updateGraph() {
  x = g.xAxisRange()[0];

  g.updateOptions({
    file: dygraphs_data,
    dateWindow: [
      x,
      moment().unix()
    ]
  });
  g.ready();
}
