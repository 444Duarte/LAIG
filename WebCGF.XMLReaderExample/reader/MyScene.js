/**
 * MyScene constructor
 * @constructor
 * @param scene - The scene
 */
function MyScene(scene){
	CGFscene.call(this);
};

/**
 * Stances that MyScene has the properties of a CGFscene.
*/
MyScene.prototype = Object.create(CGFscene.prototype);

/**
 * Creates a MyScene.
 */
MyScene.prototype.constructor = MyScene;

/**
 * Creates the axis on the object MyScene and enables all of the required functions to print the objects on the screen, such as the backface culling, enable textures, and the depth test.
 */
MyScene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();
	this.enableTextures(true);

	this.enabledLights = [];

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);


	this.axis=new CGFaxis(this);
};

/**
 * Creates the camera.
 */
MyScene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

/**
 * Creates a default appearance.
 */
MyScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop

/**
 * Handler that is called when the graph is loaded.
 * Switches all of the lights that exist with the ones on the graph.
 * Sets the background and ambient light.
 * Sets the textures, materials, leaves, nodes ad rootID that exist only on the graph.
 */
MyScene.prototype.onGraphLoaded = function () 
{

    this.camera.near = this.graph.frustum[0];
    this.camera.far = this.graph.frustum[1];

    if (this.graph.reference >= 0)
	   this.axis = new CGFaxis(this, this.graph.reference);
	   
	this.gl.clearColor(this.graph.backgroundLight[0],this.graph.backgroundLight[1],this.graph.backgroundLight[2],this.graph.backgroundLight[3]);
	this.setGlobalAmbientLight(this.graph.ambientLight[0],this.graph.ambientLight[1],this.graph.ambientLight[2],this.graph.ambientLight[3]);
	
    for (var i = 0; i < this.graph.lights.length; ++i) {
    	this.lights[i] = this.graph.lights[i];
    	this.lights[i].setVisible(true);
    	console.log("loaded light id="+this.lights[i].id);
    	this.enabledLights[this.lights[i].id] = this.lights[i].enabled;
    }
	
	this.textures = this.graph.textures;
	this.materials = this.graph.materials;
	this.leaves = this.graph.leaves;
	this.nodes = this.graph.nodes;
	this.rootID = this.graph.rootID;
	console.log("Graph Loaded");

	this.interface.onGraphLoaded();
	console.log("Interface loaded");

};

/**
 * Clears image, draws axis, updates the lights and displays all of the nodes.
 */
MyScene.prototype.display = function () {
    // ---- BEGIN Background, camera and axis setup
    this.shader.bind();
    
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    this.axis.display();

    this.setDefaultAppearance();

    console.log("Ended background, camera and axis setup")
    
    // ---- END Background, camera and axis setup

    // it is important that things depending on the proper loading of the graph
    // only get executed after the graph has loaded correctly.
    // This is one possible way to do it
    if (this.graph.loadedOk)
    {
        this.lights[0].update();
        this.nodes[this.rootID].display();
    }; 

    this.shader.unbind();
};

MyScene.prototype.setInterface = function(newInterface) {
	this.interface = newInterface;
}


MyScene.prototype.updateLight= function(lightID, state){
	for (var i=0; i < this.lights.length; i++) {
		if (this.lights[i].id == lightID) {
			if(state) {
				console.log("Enable light="+this.lights[i].id);
				this.lights[i].enable()
			}else{
				console.log("Disable light="+this.lights[i].id);
				this.lights[i].disable();
			}
			return;
		}
	}
};