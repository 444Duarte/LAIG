function MyLightsInterface(scene) {
	CGFinterface.call(this);
	this.scene = scene;
};

MyLightsInterface.prototype = Object.create(CGFinterface.prototype);
MyLightsInterface.prototype.constructor = MyLightsInterface;

MyLightsInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);
	this.gui = new dat.GUI();
};

MyLightsInterface.prototype.onGraphLoaded = function(){
    var group = this.gui.addFolder('Lights');
    group.open();
    var lights = this.scene.lightsEnabled;
    
	for(light in lights){
	    var self = this;
	    var controller = group.add(lights,light);
	    controller.onChange(function(enable) {
	    	self.scene.updateLight(this.property, enable);
	    });
	}
}