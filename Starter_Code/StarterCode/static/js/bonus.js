// Color palette for Gauge Chart
var arrColorsG = ["maroon", "red", "orange", "yellow", " green", "blue", "teal", "purple", "navy", "white"];

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata= data.metadata;
    var resultsarray= metadata.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0]
    var panel = d3.select("#sample-metadata");
    //used to clear exisiting metadata
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
};

//build a gauge chart
function buildGaugeChart(sample) {
  console.log("sample", sample);
  d3.json("samples.json").then(data =>{
    var objs = data.metadata;
    var matchedSampleObj = objs.filter(sampleData => sampleData["id"] === parseInt(sample));
    gaugeChart(matchedSampleObj[0]);
 });   
};

function gaugeChart(data) {
  console.log("gaugeChart", data);
  if(data.wfreq === null){
    data.wfreq = 0;
  };
  let degree = parseInt(data.wfreq) * (180/10);

  // math for meter
  let degrees = 180 - degree;
  let radius = .5;
  let radians = degrees * Math.PI / 180;
  let x = radius * Math.cos(radians);
  let y = radius * Math.sin(radians);

  let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
  let path = mainPath.concat(pathX, space, pathY, pathEnd);
  
  let trace = [{ type: 'scatter',
    x: [0], y:[0],
      marker: {size: 5, color:'dark gray'},
      showlegend: false,
      name: 'WASH FREQ',
      text: data.wfreq,
      hoverinfo: 'text+name'},
      {values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
      textinfo: 'text',
      textposition:'inside',
      textfont:{
        size : 12,
      },
      marker: {colors:[...arrColorsG]},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
       hoverinfo: 'text',
       hole: .375,
       type: 'pie',
       showlegend: false
    }];

  let layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: 'navy',
        line: {
          color: 'navy'
        }
    }],
    title: 'Washing Frequency',
    height: 600,
    width: 600,
    xaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
  };

  Plotly.newPlot('gauge', trace, layout, {responsive: true});
};

// build charts using d3.json to get the sample data 
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0];
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
  
   // build a bubble chart
    var LayoutBubble = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID", color: "navy", style: "bold"},
      yaxis: { title: "Sample Values", color: "navy", style: "bold"},
      hovermode: "closest",
    };
  
    var DataBubble = [ 
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
        },
      },
    ];
  
    Plotly.newPlot("bubble", DataBubble, LayoutBubble);
   
  // build a bar chart
    var bar_data = [
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        type:"bar",
        orientation:"h",
      },
    ];
  
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 25, l: 125 }
    };
  
    Plotly.newPlot("bar", bar_data, barLayout);
  });
};

// user to select number from dropdown
function init() {
    var selector = d3.select("#selDataset");
  d3.json("samples.json").then((data) => { var sampleNames = data.names; sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Use the first sample from the list to build the initial plots
  const firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
    buildGaugeChart(firstSample)
  });
};

// obtain new data each time new subject is selected 
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  buildGaugeChart(newSample);
};

// Initialize the dashboard
init();