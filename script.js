
let w = 1200;
let h = 800;
let padding = 70;

const request = new XMLHttpRequest();
request.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
request.send();
request.onload = function() {
  let data = JSON.parse(request.responseText);

  let times = data.map((d) => d.Time);
  let years = data.map((d) => d.Year);
  
  const svg = d3.select(".scatterplotGraph")
                .append("svg")
                .attr("width", w + "px")
                .attr("height", h + "px")
                .style("background-color", "white")
                .style("border-radius", "5px")
  
  let minYear = (d3.min(years, (d) => d))
  let maxYear = (d3.max(years, (d) => d))
  
  const xScale = d3.scaleTime()
                   .domain([minYear - 1, maxYear])
                   .range([padding, w - padding])
                  
  const xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.format(".0f"))

  svg.append("g")
     .attr("transform","translate(0," + ( h - padding ) + ")")
     .attr("id","x-axis")
     .call(xAxis)
  
  let minutes = d3.timeParse("%M:%S")
  let minTime = minutes((d3.min(times, (d) => d)))
  let maxTime = minutes((d3.max(times, (d) => d)))
  
  const yScale = d3.scaleTime()
                   .domain([maxTime, minTime])
                   .range([h - padding, padding])
  
  const yAxis = d3.axisLeft(yScale)
                  .tickFormat(d3.timeFormat("%M:%S"))

  svg.append("g")
     .attr("transform","translate(" + padding + ",0" + ")")
     .attr("id", "y-axis")
     .call(yAxis)
  
  let key = ["No doping allegations", "Doping allegations"]
  let colors = d3.scaleOrdinal()
                 .domain(key)
                 .range(d3.schemeSet1)
 
  let toolTip = d3.select("body")
                  .append("div")
                  .style("position", "absolute")
                  .attr("id", "tooltip")
                  .style("background-color", "#ddd")
                  .style("opacity", 0)
                  .style("border-radius", "5px")
                  .style("border", "solid 1px black")
                  .style("padding", "5.5px")
                  .style("font-family", "monospace")
  
  let mouseover = (event, d) => {
  let pos = d3.pointer(event);
  toolTip
    .html(
      d["Name"] + ": " + d["Nationality"] + "<br>" + "Year: " + d["Year"] + " Time: " + d["Time"] + "<br><br>" + d["Doping"])
    .style("opacity", 0.8)
    .attr("data-year", d["Year"])
    .style("left", event.pageX + 20 + "px")
    .style("top", event.pageY - 50 + "px");
};
  
  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 8.5)
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(minutes(d.Time)))
    .attr("data-xvalue", (d,i) => d.Year)
    .attr("data-yvalue", (d,i) => minutes(d.Time))
    .style("fill", function(d,i) {
      if (d["Doping"] === "") {
        return ("rgb(228, 26, 28)")
      } else {
        return("rgb(55, 126, 184)")
      }
    })
    .on("mouseover", mouseover)
    .on("mouseleave", () => {
    return toolTip.style("opacity", 0);
  });

  svg.append("text")
     .attr("id","legend")
     .attr("x", w-padding*4.5)
     .attr("y", 150)
  
  svg.selectAll("legenddots")
     .data(key)
     .enter()
     .append("rect")
     .attr("x",w-padding*2)
     .attr("y",(d,i)=>175+i*(20+5))
     .attr("width",20)
     .attr("height",20)
     .style("fill", (d) => colors(d))
  
  svg.selectAll("legendlabels")
     .data(key)
     .enter()
     .append("text")
     .attr("x",w-padding*4.5)
     .attr("y",(d,i)=>185+i*(20+5))
     .attr("width",20)
     .attr("height",20)
     .style("fill", (d) => colors(d))
     .attr("text-anchor","left")
     .style("alignment-baseline", "middle")
     .text((d)=>d)
}
