"use strict";
var datastorm = datastorm || {};
datastorm.network = datastorm.network || {};

datastorm.network.vis = (function(){
  var my = {};

  var elements = {};

  var width, height;
  var active = true;

  var config = {};

  var nodes = [], links = [];

  var force = d3.layout.force()
    .charge(-800)
    .linkDistance(50)
    .linkStrength(function(d) {
      return d.strength;
    })
    .gravity(0.01)
    .friction(0.1);

  var ctx = datastorm.canvas.ctx;
  var colorScale = d3.scale.category20b();


  function init() {
    d3.select('canvas')
      .attr('width', config.width)
      .attr('height', config.height);

    force.size([config.width, config.height]);
  }

  function updateNetwork() {
    nodes = _.clone(datastorm.network.sim.getUsers());
    links = _.clone(datastorm.network.sim.getLinks());

    force.nodes(nodes)
      .links(links)
      .start();
  }

  function render() {
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, config.width, config.height);

    ctx.globalAlpha = 0.5;

    // Links
    ctx.strokeStyle = 'rgba(200, 200, 255, 0.5)';
    ctx.lineWidth = 1;

    _.each(links, function(d) {
      datastorm.canvas.drawLine(d.source.x, d.source.y, d.target.x, d.target.y);
    });

    // // Nodes
    ctx.globalAlpha = 0.9;
    _.each(nodes, function(d) {
      ctx.fillStyle = colorScale(d.subject);
      datastorm.canvas.drawCircle(d.x, d.y, 4);
    });
  }


  my.init = function(conf) {
    _.assign(config, conf);
    init();
    setInterval(render, 100);
  };

  my.networkUpdate = function() {
    updateNetwork();
  }

  return my;
}());