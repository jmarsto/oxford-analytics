import React, { Component } from 'react';

class Sunburst extends Component {
  constructor(props) {
    super(props);
    let words = props.definition.toLowerCase().replace(/'/,'').replace(/[^a-z]/g,' ').split(" ")

    words = words.filter(word => {
      return word != ""
    })

    let sequences = []

    words.forEach(currentWord => {
      let instanceCount = 0
      words.forEach(word => {
        if (word == currentWord) {
          instanceCount++
        }
      })

      let letters = currentWord.split("").join('-')
      sequences.push([letters, instanceCount])

      words = words.filter(word => {
        return word != currentWord
      })

    })

    this.state = {
      sequences: sequences
    };

  }

  componentDidMount() {
    // D3 sourced from https://bl.ocks.org/kerryrodden/7090426 and modified

    // Dimensions of sunburst.
    var width = 750;
    var height = 600;
    var radius = Math.min(width, height) / 2;

    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
    var b = {
      w: 75, h: 30, s: 3, t: 10
    };

    // Mapping of step names to colors.
    var colors = {
      "a": "#c70000",
      "b": "#c73500",
      "c": "#c76a00",
      "d": "#c79200",
      "e": "#c7b600",
      "f": "#a9c700",
      "g": "#7ec700",
      "h": "#70c403",
      "i": "#63ba0d",
      "j": "#41940a",
      "k": "#26ea10",
      "l": "#3bf196",
      "m": "#00c7c7",
      "n": "#0000c7",
      "o": "#3200c7",
      "p": "#4c00c7",
      "q": "#6000c7",
      "r": "#7400c7",
      "s": "#8b00c7",
      "t": "#9f00c7",
      "u": "#8f0062",
      "v": "#ad0076",
      "w": "#db0080",
      "x": "#c70053",
      "y": "#f50045",
      "z": "#c70003",
    };

    // Total size of all segments; we set this later, after loading the data.
    var totalSize = 0;

    var vis = d3.select("#sunburst").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("id", "container")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var partition = d3.layout.partition()
        .size([2 * Math.PI, radius * radius])
        .value(function(d) { return d.size; });

    var arc = d3.svg.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x + d.dx; })
        .innerRadius(function(d) { return Math.sqrt(d.y); })
        .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

      var json = buildHierarchy(this.state.sequences);
      createVisualization(json);

    // Main function to draw and set up the visualization, once we have the data.
    function createVisualization(json) {
      // Basic setup of page elements.
      initializeBreadcrumbTrail();
      drawLegend();
      d3.select("#togglelegend").on("click", toggleLegend);

      // Bounding circle underneath the sunburst, to make it easier to detect
      // when the mouse leaves the parent g.
      vis.append("svg:circle")
          .attr("r", radius)
          .style("opacity", 0);

      // For efficiency, filter nodes to keep only those large enough to see.
      var nodes = partition.nodes(json)
          .filter(function(d) {
          return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
          });

      var path = vis.data([json]).selectAll("path")
          .data(nodes)
          .enter().append("svg:path")
          .attr("display", function(d) { return d.depth ? null : "none"; })
          .attr("d", arc)
          .attr("fill-rule", "evenodd")
          .style("fill", function(d) { return colors[d.name]; })
          .style("opacity", 1)
          .on("mouseover", mouseover);

      // Add the mouseleave handler to the bounding circle.
      d3.select("#container").on("mouseleave", mouseleave);

      // Get total size of the tree = value of root node from partition.
      totalSize = path.node().__data__.value;
     };

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    function mouseover(d) {
      var percentage = (100 * d.value / totalSize).toPrecision(3);
      var percentageString = percentage + "%";
      if (percentage < 0.1) {
        percentageString = "< 0.1%";
      }

      d3.select("#percentage")
          .text(percentageString);

      d3.select("#explanation")
          .style("visibility", "");

      var sequenceArray = getAncestors(d);
      updateBreadcrumbs(sequenceArray, percentageString);

      // Fade all the segments.
      d3.selectAll("path")
          .style("opacity", 0.3);

      // Then highlight only those that are an ancestor of the current segment.
      vis.selectAll("path")
          .filter(function(node) {
                    return (sequenceArray.indexOf(node) >= 0);
                  })
          .style("opacity", 1);
    }

    // Restore everything to full opacity when moving off the visualization.
    function mouseleave(d) {

      // Hide the breadcrumb trail
      d3.select("#trail")
          .style("visibility", "hidden");

      // Deactivate all segments during transition.
      d3.selectAll("path").on("mouseover", null);

      // Transition each segment to full opacity and then reactivate it.
      d3.selectAll("path")
          .transition()
          .duration(1000)
          .style("opacity", 1)
          .each("end", function() {
                  d3.select(this).on("mouseover", mouseover);
                });

      d3.select("#explanation")
          .style("visibility", "hidden");
    }

    // Given a node in a partition layout, return an array of all of its ancestor
    // nodes, highest first, but excluding the root.
    function getAncestors(node) {
      var path = [];
      var current = node;
      while (current.parent) {
        path.unshift(current);
        current = current.parent;
      }
      return path;
    }

    function initializeBreadcrumbTrail() {
      // Add the svg area.
      var trail = d3.select("#sequence").append("svg:svg")
          .attr("width", width)
          .attr("height", 50)
          .attr("id", "trail");
      // Add the label at the end, for the percentage.
      trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#000");

    }

    // Generate a string that describes the points of a breadcrumb polygon.
    function breadcrumbPoints(d, i) {
      var points = [];
      points.push("0,0");
      points.push(b.w + ",0");
      points.push(b.w + b.t + "," + (b.h / 2));
      points.push(b.w + "," + b.h);
      points.push("0," + b.h);
      if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + (b.h / 2));
      }
      return points.join(" ");
    }

    // Update the breadcrumb trail to show the current sequence and percentage.
    function updateBreadcrumbs(nodeArray, percentageString) {

      // Data join; key function combines name and depth (= position in sequence).
      var g = d3.select("#trail")
          .selectAll("g")
          .data(nodeArray, function(d) { return d.name + d.depth; });
      // Add breadcrumb and label for entering nodes.
      var entering = g.enter().append("svg:g");

      entering.append("svg:polygon")
          .attr("points", breadcrumbPoints)
          .style("fill", function(d) { return colors[d.name]; });

      entering.append("svg:text")
          .attr("x", (b.w + b.t) / 2)
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.name; });

      // Set position for entering and updating nodes.
      g.attr("transform", function(d, i) {
        return "translate(" + i * (b.w + b.s) + ", 0)";
      });

      // Remove exiting nodes.
      g.exit().remove();

      // Now move and update the percentage at the end.
      d3.select("#trail").select("#endlabel")
          .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(percentageString);

      // Make the breadcrumb trail visible, if it's hidden.
      d3.select("#trail")
          .style("visibility", "");

    }

    function drawLegend() {

      // Dimensions of legend item: width, height, spacing, radius of rounded rect.
      var li = {
        w: 75, h: 30, s: 3, r: 3
      };

      var legend = d3.select("#legend").append("svg:svg")
          .attr("width", li.w)
          .attr("height", d3.keys(colors).length * (li.h + li.s));

      var g = legend.selectAll("g")
          .data(d3.entries(colors))
          .enter().append("svg:g")
          .attr("transform", function(d, i) {
                  return "translate(0," + i * (li.h + li.s) + ")";
               });

      g.append("svg:rect")
          .attr("rx", li.r)
          .attr("ry", li.r)
          .attr("width", li.w)
          .attr("height", li.h)
          .style("fill", function(d) { return d.value; });

      g.append("svg:text")
          .attr("x", li.w / 2)
          .attr("y", li.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.key; });
    }

    function toggleLegend() {
      var legend = d3.select("#legend")[0][0];
      if (legend.style.visibility == "hidden") {
        legend.style.visibility = "";
      } else {
        legend.style.visibility = "hidden";
      }
    }

    // Transform sequences into a hierarchical structure suitable
    // for a partition layout. The 0 index is a sequence of step names, from
    // root to leaf, separated by hyphens. The 1 index is a count of how
    // often that sequence occurred.
    function buildHierarchy(sequences) {
      var root = {"name": "root", "children": []};
      for (var i = 0; i < sequences.length; i++) {
        var sequence = sequences[i][0];
        var size = +sequences[i][1];

        var parts = sequence.split("-");
        var currentNode = root;
        if (currentNode.children > 6) {
          var childKeep = currentNode.children
        }
        for (var j = 0; j < parts.length; j++) {
          var children = currentNode["children"];

          var nodeName = parts[j];
          var childNode;
          if (j + 1 < parts.length) {
             // Not yet at the end of the sequence; move down the tree.
           	var foundChild = false;
            if (!children) {
              children = childKeep || []
            }
           	for (var k = 0; k < children.length; k++) {
           	  if (children[k]["name"] == nodeName) {
           	    childNode = children[k];
           	    foundChild = true;
           	    break;
           	  }
           	}
            // If we don't already have a child node for this branch, create it.
           	if (!foundChild) {
           	  childNode = {"name": nodeName, "children": []};
           	  children.push(childNode);

           	}
           	currentNode = childNode;
                } else {
           	// Reached the end of the sequence; create a leaf node.
           	childNode = {"name": nodeName, "size": size};

            if (!children) {
              children = childKeep || []
            }
           	children.push(childNode);
          }
        }
      }
      return root;
    };
  }

  render() {
    return(
      <div className="graph">
        <div id="sunburst" className="sunburst">
          <div id="main">
            <div id="sequence"></div>
            <div id="chart">
              <div id="explanation" style={{visibility: "hidden"}}>
                <span id="percentage"></span><br/>
                of words begin with this sequence of letters
              </div>
            </div>
          </div>
          <div id="sidebar">
            <input type="checkbox" id="togglelegend" name="legend"></input>
            <label htmlFor="legend">Legend</label>
            <br/>
            <div id="legend" style={{visibility: "hidden"}}></div>
          </div>
        </div>
        <h3>Frequencies of Sequences of Letters</h3>
      </div>
    )
  }
}

export default Sunburst
