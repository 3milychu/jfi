 window.addEventListener("resize", function() {
    location.reload();
 });

function caps(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// some colour variables
var tcBlack = "#130C0E";

// rest of vars
var w = window.innerWidth/1.5,
    h = window.innerHeight,
    maxNodeSize = 1,
    x_browser = 20,
    y_browser = 25,
    root;
 
var vis;
var force = d3.layout.force(); 

vis = d3.select("#vis")
  .append("svg")
  .attr("width", w)
  .attr("height", h);
 
d3.json("https://raw.githubusercontent.com/3milychu/cashtransfers/master/data/data.json", function(json) {

  var format = d3.format("");

    json.forEach(function(d) {
        d.labels = format(d.labels);
    });
 
  json = json;

  json = json.filter(function(d) { 
            return d.cat_recode == 3});

  // create children hierarchy json

var newData = { name :"root", 
      path: "3_root", 
      size: 85000,
      children : [] },
    levels = ["path"];

// For each data row, loop through the expected levels traversing the output tree
json.forEach(function(d){
    // Keep this as a reference to the current level
    var depthCursor = newData.children;
    // Go down one level at a time
    levels.forEach(function(property, depth ){

        // Look to see if a branch has already been created
        var index;
        depthCursor.forEach(function(child,i){
            if ( d[property] == child.name ) index = i;
        });
        // Add a branch if it isn't there
        if ( isNaN(index) ) {

            if(d[property] == 0 | d[property] ==1 | d[property] == 2 | d[property] == 3) {
              depthCursor.push({ name : d[property], path: d[property]+"_root", size: 120000, children : []});
            index = depthCursor.length - 1;
            } else {
              depthCursor.push({ name : d[property], path: d[property]+"_root", size: 80000, children : []});
            index = depthCursor.length - 1;
            }
            
        }
        // Now reference the new child array as we go deeper into the tree
        depthCursor = depthCursor[index].children;
        // This is a leaf, so add the last element to the specified branch
        if ( depth === levels.length - 1 ) depthCursor.push({ paper:d.paper, summ:d.summ, url:d.url, 
          country:d.country, allocation:d.allocation, NOCT:d.NOCT, involved:d.involved, tools:d.tools, 
          relevance:d.relevance, economic:d.economic, psych:d.psych, social:d.social, health:d.health, 
          schooling:d.schooling, means:d.means, research_design:d.research_design, NOCT_recode:d.NOCT_recode,
          employment_effects:d.employment_effects, size:d.size, path:d.path, hover:d.hover});
    });
});

  // 
  console.log(newData);
 
  root = newData;
  root.fixed = true;
  root.x = w /2.2 ;
  root.y = h / 2.1;

        // Build the path
  var defs = vis.insert("svg:defs")
      .data(["end"]);
 
 
  defs.enter().append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");
 
     update();
});

// functions
function update() {
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);
  // Restart the force layout.
  force.nodes(nodes)
        .links(links)
        .gravity(0.005)
    .charge(-1000)
    .linkDistance(20)
    .friction(0.5)
    .linkStrength(function(l, i) {return 1; })
    .size([w, h])
    .on("tick", tick)
        .start();
 
   var path = vis.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });
 
    path.enter().insert("svg:path")
      .attr("class", "link")
      // .attr("marker-end", "url(#end)")
      .style("stroke", "#eee");
 
 
  // Exit any old paths.
  path.exit().remove();

  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id; });
 
 
  // Enter any new nodes.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on("click", click)
      .call(force.drag);
 
  // Append a circle
  nodeEnter.append("svg:circle")
      .attr("r", function(d) { return Math.sqrt(d.size) / 40 || 5.5; })
      .style("fill", "none");

  // Append images
  var images = nodeEnter.append("svg:image")
        .attr("xlink:href",  function(d) { return "assets/"+d.path+".png";})
        .attr("x", function(d) { return -(d.size/2500);})
        .attr("y", function(d) { return -(d.size/2500);})
        .attr("height", function(d) {return d.size / 1000;})
        .attr("width", function(d) {return d.size / 1000;});

  var setEvents = images
  // Append details text
          .on( 'click', function (d) {

            // Details if "Economic"
            if (d.path == 4) {
              d3.select("p").html("Type of NOCT: " + d.NOCT_recode);
              d3.select("h1").html("<span class='h-bold'>‡</span>" + "<div class='one'>economic effects</div>");
              d3.select("h2").html("<div class='paper'>"+d.paper+"</div>"); 
              d3.select("h3").html(d.summ);
            }

            // Details if sheet is "Psych"
            if (d.path == 5) {
              d3.select("p").html("Type of NOCT: " + d.NOCT_recode);
              d3.select("h1").html("<span class='h-bold'>‡</span>"+ "<div class='two'>psychological effects</div>");
              d3.select("h2").html("<div class='paper'>"+d.paper+"</div>"); 
              d3.select("h3").html(d.summ);
            }

            // Details if sheet is "Social"
            if (d.path == 6) {
              d3.select("p").html("Type of NOCT: "+ d.NOCT_recode);
              d3.select("h1").html("<span class='h-bold'>‡</span>"+"<div class='three'>social effects</div>");
              d3.select("h2").html("<div class='paper'>"+d.paper+"</div>"); 
              d3.select("h3").html(d.summ);
            }

            // Details if sheet is "Health"
            if (d.path == 7) {
              d3.select("p").html("Type of NOCT: " + d.NOCT_recode);
              d3.select("h1").html("<span class='h-bold'>‡</span>"+"<div class='four'>health effects</div>");
              d3.select("h2").html("<div class='paper'>"+d.paper+"</div>"); 
              d3.select("h3").html(d.summ);
            }

            // Details if sheet is "Schooling"
            if (d.path == 8) {
              d3.select("p").html("Type of NOCT: " + d.NOCT_recode);
              d3.select("h1").html("<span class='h-bold'>‡</span>"+"<div class='five'>schooling effects</div>");
              d3.select("h2").html("<div class='paper'>"+d.paper+"</div>"); 
              d3.select("h3").html(d.summ);
            }
                
              
           })
          .on( 'mouseenter', function() {
            // select element in current context
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -(d.size/2000);})
              .attr("y", function(d) { return -(d.size/2000);})
              .attr("height", function(d) {return d.size / 1000 + 10;})
              .attr("width", function(d) {return d.size / 1000 + 10;});
          })
          // set back
          .on( 'mouseleave', function() {
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -(d.size/2500);})
              .attr("y", function(d) { return -(d.size/2500);})
              .attr("height", function(d) {return d.size / 1000;})
              .attr("width", function(d) {return d.size / 1000;});
          });

    var rollover = nodeEnter.append("svg:image")
        .attr("class", "nodeimage")
        .attr("xlink:href", function(d) { return "assets/"+d.hover+".png"; })
        .style("height","40")
        .style("z-index","1")
        .attr("x", x_browser -45)
        .attr("y", y_browser -45)


      // make the image grow a little on mouse over and add the text details on click
  var setEvents = rollover
          // Append details text
          .on( 'click', function (d) {


            // Details if "Economic"
            if (d.path == 4) {
              d3.select("p").html("Type of NOCT: " + d.NOCT_recode);
              d3.select("h1").html("<span class='h-bold'>‡</span>" + "<div class='one'>economic effects</div>"
                 +"<img class='effects' src='assets/4_icon.png'>");
              d3.select("h2").html("<div class='paper'>"+d.paper+"</div>"); 
              d3.select("h3").html(d.summ);
            }

            // Details if sheet is "Psych"
            if (d.path == 5) {
              d3.select("p").html("Type of NOCT: " + d.NOCT_recode);
              d3.select("h1").html("<span class='h-bold'>‡</span>"+ "<div class='two'>psychological effects</div>"
                 +"<img class='effects' src='assets/5_icon.png'>");
              d3.select("h2").html("<div class='paper'>"+d.paper+"</div>"); 
              d3.select("h3").html(d.summ);
            }

            // Details if sheet is "Social"
            if (d.path == 6) {
              d3.select("p").html("Type of NOCT: "+ d.NOCT_recode);
              d3.select("h1").html("<span class='h-bold'>‡</span>"+"<div class='three'>social effects</div>"
                +"<img class='effects' src='assets/6_icon.png'>");
              d3.select("h2").html("<div class='paper'>"+d.paper+"</div>"); 
              d3.select("h3").html(d.summ);
            }

            // Details if sheet is "Health"
            if (d.path == 7) {
              d3.select("p").html("Type of NOCT: " + d.NOCT_recode);
              d3.select("h1").html("<span class='h-bold'>‡</span>"+"<div class='four'>health effects</div>"
                 +"<img class='effects' src='assets/7_icon.png'>");
              d3.select("h2").html("<div class='paper'>"+d.paper+"</div>"); 
              d3.select("h3").html(d.summ);
            }

            // Details if sheet is "Schooling"
            if (d.path == 8) {
              d3.select("p").html("Type of NOCT: " + d.NOCT_recode);
              d3.select("h1").html("<span class='h-bold'>‡</span>"+"<div class='five'>schooling effects</div>"
                 +"<img class='effects' src='assets/8_icon.png'>");
              d3.select("h2").html("<div class='paper'>"+d.paper+"</div>"); 
              d3.select("h3").html(d.summ);
            }
                
              
           })

 
  // Exit any old nodes.
  node.exit().remove();
 
 
  // Re-select for update.
  path = vis.selectAll("path.link")
      .style("stroke-width","1px");
  node = vis.selectAll("g.node");
 
function tick() {
 
 
    path.attr("d", function(d) {
 
     var dx = d.target.x - d.source.x,
           dy = d.target.y - d.source.y,
           dr = Math.sqrt(dx * dx + dy * dy);
           return   "M" + d.source.x + "," 
            + d.source.y 
            + "A" + dr + "," 
            + dr + " 0 0,1 " 
            + d.target.x + "," 
            + d.target.y;
  });
    node.attr("transform", nodeTransform);    
  }
}

 
/**
 * Gives the coordinates of the border for keeping the nodes inside a frame
 * http://bl.ocks.org/mbostock/1129492
 */ 
function nodeTransform(d) {
  d.x =  Math.max(maxNodeSize, Math.min(w - (d.imgwidth/2 || 16), d.x));
    d.y =  Math.max(maxNodeSize, Math.min(h - (d.imgheight/2 || 16), d.y));
    return "translate(" + d.x + "," + d.y + ")";
   }
 
/**
 * Toggle children on click.
 */ 
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
 
  update();
}
 
 
/**
 * Returns a list of all nodes under the root.
 */ 
function flatten(root) {
  var nodes = []; 
  var i = 0;
 
  function recurse(node) {
    if (node.children) 
      node.children.forEach(recurse);
    if (!node.id) 
      node.id = ++i;
    nodes.push(node);
  }
 
  recurse(root);
  return nodes;
} 

function collapseAll(d){
    if (d.children){
        d.children.forEach(collapseAll);
        d._children = d.children;
        d.children = null;
    }
    else if (d._childred){
        d._children.forEach(collapseAll);
    }
}

function setParents(d, p){
    d._parent = p;
  if (d.children) {
      d.children.forEach(function(e){ setParents(e,d);});
  } else if (d._children) {
      d._children.forEach(function(e){ setParents(e,d);});
  }
}

