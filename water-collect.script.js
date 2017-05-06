function updateGraph(data_array){
  g = new Dygraph(
      document.getElementById("dygraph"),
      data_array,
      {
        labels: [ "Date", "Field1", "Field2", "MeterId", "Field4", "Field5", "Field6", "Usage","Rate","Field9","Field10", ],
        series: {
          "Rate": { axis: 'y1', showInRangeSelector: true, fillAlpha: 0.9, plotter: barChartPlotter  },
          "Usage": { axis: 'y2', fillAlpha: 0.1 },
        },
        legend: "always",
        labelsSeparateLines: true,
        connectSeparatedPoints: true,
        fillGraph: true,
        colors: [
          "blue",
          "green"
        ],
        ylabel: "Usage",
        y2label: "Total",
        visibility: [false, false, false, false, false, false, true, true, false, false,],
        showRangeSelector: true,
      }
  );
};

function completeUpdatingDataCsv(results)
{
  console.log("CSV:", results.data);
  vArray = results.data;

  var previousUsage=0;
  var reformattedArray = vArray.map(function(arrayItem) {
    arrayItem[0] = new Date(arrayItem[0]);
    arrayItem[1] = parseInt(arrayItem[1]);
    arrayItem[2] = parseInt(arrayItem[2]);
    arrayItem[3] = parseInt(arrayItem[3]);
    arrayItem[4] = parseInt(arrayItem[4]);
    arrayItem[5] = parseInt(arrayItem[5]);
    arrayItem[6] = parseInt(arrayItem[6]);
    arrayItem[7] = parseInt(arrayItem[7]);
    arrayItem[8] = parseInt(arrayItem[8]);
    arrayItem[9] = parseInt(arrayItem[9]);
    arrayItem[10] = parseInt(arrayItem[10]);

    if (previousUsage) {
      arrayItem[8] = arrayItem[7] - previousUsage;
    }
    else {
      arrayItem[8] = 0;
      console.log("Previous:", previousUsage);
    }

    previousUsage = arrayItem[7];
    return arrayItem;
  });

  console.log("Update:", reformattedArray);

  updateGraph(reformattedArray);
};

//Load CSV file and calculate increase between collections
Papa.parse(DATA_CSV, {download: true, skipEmptyLines: true, header: false, complete: completeUpdatingDataCsv});
