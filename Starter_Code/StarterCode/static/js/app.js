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
        text:labels.slice(0,10).reverse(),
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
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};


function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
};
  
// Initialize the dashboard
init();