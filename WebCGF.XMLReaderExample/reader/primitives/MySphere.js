/**
 * Constructor MySphere
 * @constructor
 * @param scene - The scene
 * @param {number} radius - radius of the sphere
 * @param {number} slices - parts along radius
 * @param {number} stacks - parts per section
 */
 function MySphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.radius = radius;
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

/**
 * Stances that MySphere has the properties of a CGFobject.
*/
 MySphere.prototype = Object.create(CGFobject.prototype);

 /**
 * Creates a MySphere.
 */
 MySphere.prototype.constructor = MySphere;

/**
 * Initiates the buffers on the object MySphere.
 * Creates a sphere, his normals and his texture coordinates.
 */
 MySphere.prototype.initBuffers = function() {
 	this.vertices = [];
 	this.normals = [];
	this.indices = [];
	this.texCoords = [];
    var alpha = (2*Math.PI)/this.slices;
    var beta = (Math.PI)/this.stacks;



	for (var stack = 0; stack < this.stacks + 1; ++stack) {
		for (var slice = 0; slice <= this.slices; ++slice) {
			this.vertices.push(this.radius * Math.sin(stack * alpha) * Math.cos(slice * beta), this.radius * Math.sin(stack * alpha) * Math.sin(slice * beta), this.radius * Math.cos(stack * alpha));
			this.normals.push(Math.sin(stack * alpha) * Math.cos(slice * beta), Math.sin(stack * alpha) * Math.sin(slice * beta), Math.cos(stack * alpha));
			this.texCoords.push(slice/this.slices, stack/this.stacks);
		}
	}

 	for (var stack = 0; stack < this.stacks; ++stack) {
		for (var slice = 0; slice < this.slices; ++slice) {
			this.indices.push(stack * (this.slices + 1) + slice, (stack + 1) * (this.slices + 1) + slice, (stack + 1) * (this.slices + 1) + slice + 1);
			this.indices.push(stack * (this.slices + 1) + slice, (stack + 1) * (this.slices + 1) + slice + 1, stack * (this.slices + 1) + slice + 1);
		}
	}
	
	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

/**
 * Scales the texCoords according to the s and t amplification factor.
 */
 MySphere.prototype.scaleTexCoords = function(ampS, ampT) {
	this.updateTexCoordsGLBuffers();
};