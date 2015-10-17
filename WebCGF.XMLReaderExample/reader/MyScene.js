function MyScene(scene){

	CGFscene.call(this);

};

MyScene.prototype = Object.create(CGFscene.prototype);
MyScene.prototype.constructor = MyScene;

MyScene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();
	this.enableTextures(true);

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);


	this.axis=new CGFaxis(this);
};

MyScene.prototype.initLights = function () {

    this.shader.bind();

    this.shader.unbind();
};

MyScene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

MyScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
MyScene.prototype.onGraphLoaded = function () 
{

    this.camera.near = this.graph.frustum['near'];
    this.camera.far = this.graph.frustum['far'];

    if (this.graph.reference > 0)
        this.axis = new CGFaxis(this, this.graph.reference);

    this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
    this.setGlobalAmbientLight(this.graph.ambientLight[0],this.graph.ambientLight[1],this.graph.ambientLight[2],this.graph.ambientLight[3]);
    
     for (var i = 0; i < this.graph.lights.length; ++i) {
        this.lights[i] = this.graph.lights[i];
        this.lights[i].setVisible(true);
    }
};

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
    
    // ---- END Background, camera and axis setup

    // it is important that things depending on the proper loading of the graph
    // only get executed after the graph has loaded correctly.
    // This is one possible way to do it
    if (this.graph.loadedOk)
    {
        this.lights[0].update();
    };  

    this.shader.unbind();
};
