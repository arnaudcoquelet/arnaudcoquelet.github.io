var dygraphs_data;
var g;
var timer = 1000*60*1;
var cntdown = 1000*REFRESH_INTER;
var offset = -1;
var one_day = -1;
var update_countdown;

var legend_display = 'always';
if ($(window).width() < 768) {
  legend_display = 'onmouseover';
}


$('#cntdown').text(REFRESH_INTER);

function count_down() {
  if (cntdown <= 0) {
    cntdown = timer;
    updateGraph();
  }
  cntdown = cntdown - 1000;
  $('#cntdown').text(cntdown/1000);
}

dygraphs_data = 'http://arnaudcoquelet.github.io/water-meter.csv';
draw_graph();


function formatDate(d, short=false) {
  if (short) {
    return moment.unix(d).format('H:mm');
  } else {
    return moment.unix(d).format('D MMM YYYY - H:mm:ss');
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

function averages() {
  avg_up = 0;
  avg_down = 0;
  avg_lat = 0;
  down_max_speed = 0;
  down_min_speed = -1;
  up_max_speed = 0;
  up_min_speed = -1;
  lat_max = 0;
  lat_min = -1;
  for (var i=0; i<g.numRows(); i++) {
    up = parseFloat(g.getValue(i,2));
    down = parseFloat(g.getValue(i,3));
    lat = parseFloat(g.getValue(i,1));

    avg_lat  += lat;
    avg_up   += up;
    avg_down += down;

    vals = get_max_min(down_min_speed,down_max_speed, down);
    down_max_speed = vals[0];
    down_min_speed = vals[1];

    vals = get_max_min(up_min_speed,up_max_speed, up);
    up_max_speed = vals[0];
    up_min_speed = vals[1];

    vals = get_max_min(lat_max,lat_min, lat);
    lat_max = vals[0];
    lat_min = vals[1];

  }
  if (SHOW_DOWN_MIN_MAX) {
    $('span[name="down_avg"]').text((avg_down/g.numRows()).toFixed(2)+'Mbit/s ('+down_max_speed+'/'+down_min_speed+'Mbit/s)');
    $('span[name="down_avg"]').attr('title', 'Download (average, max, min)');
  } else {
    $('span[name="down_avg"]').text((avg_down/g.numRows()).toFixed(2)+'Mbit/s');
    $('span[name="down_avg"]').attr('title', 'Download (max: '+down_max_speed+', min: '+down_min_speed+'Mbit/s)');
  }
  if (SHOW_UP_MIN_MAX) {
    $('span[name="up_avg"]').text((avg_up/g.numRows()).toFixed(2)+'Mbit/s ('+up_max_speed+'/'+up_min_speed+'Mbit/s)');
    $('span[name="up_avg"]').attr('title', 'Upload (average, max, min)');
  } else {
    $('span[name="up_avg"]').text((avg_up/g.numRows()).toFixed(2)   +'Mbit/s');
    $('span[name="up_avg"]').attr('title', 'Upload (max: '+up_max_speed+' min: '+up_min_speed+'Mbit/s)');
  }
  if (SHOW_LAT_MIN_MAX) {
    $('span[name="lat_avg"]').text((avg_lat/g.numRows()).toFixed(2)  +'ms ('+lat_min+'/'+lat_max+'s)');
    $('span[name="lat_avg"]').attr('title', 'Latency (average, min, max)');
  } else {
    $('span[name="lat_avg"]').text((avg_lat/g.numRows()).toFixed(2)  +'ms');
    $('span[name="lat_avg"]').attr('title', 'Latency (min: '+lat_min+' max: '+lat_max+'s)');
  }
}

function draw_graph() {
  g = new Dygraph(
      document.getElementById("dygraph"),
      dygraphs_data,
      {
        labels: [ "Date", "Field1", "Field2", "MeterId", "Field4", "Field5", "Field6", "Usage","Field8","Field9","Field10", ],
        series: {
          "Usage": { axis: 'y1'},
          //"Usage": { axis: 'y1', showInRangeSelector: true },
        },
        legend: legend_display,
        labelsSeparateLines: true,
        connectSeparatedPoints: true,
        fillGraph: true,
        colors: [
          "purple",
        ],
        ylabel: "Usage",
        axes: {
          x: {
            valueFormatter: function(timestamp) {
              //return formatDate(timestamp);
              return timestamp;
            },
            axisLabelFormatter: function(timestamp) {
              //return formatDate(timestamp, true);
              return timestamp;
            }
          },
          y: {
            valueRange: [0, MAX_BW+50],
          }
        },
        underlayCallback: function(canvas, area, g) {
          canvas.strokeStyle = 'red';
          var lines = [(MAX_BW*0.8),MAX_BW];
          var range = g.xAxisRange();
          for (var idy = 0; idy < lines.length; idy++) {
            var canvasy = g.toDomYCoord(lines[idy]);
            canvas.beginPath();
            canvas.moveTo(g.toDomXCoord(range[0]), canvasy);
            canvas.lineTo(g.toDomXCoord(range[1]), canvasy);
            canvas.lineWidth = 2;
            canvas.stroke();
            canvas.closePath();
          }
        },
        showRangeSelector: true,
        rangeSelectorPlotFillColor: 'green',
      }
  );
  g.ready(function() {
    averages();
    update_countdown = setInterval(function() { count_down() }, 1000);
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
  g.ready(averages);
}