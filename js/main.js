(function(){

  var wrapper = d3.select('.wrapper');
  width = wrapper.node().clientWidth;
  height = wrapper.node().clientHeight;

  datastorm.network.sim.init({
    width: width,
    height: height
  });
  datastorm.network.vis.init({
    width: width,
    height: height
  });

  datastorm.network.sim.start();

})();