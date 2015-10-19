/**
 * Constructor MyCylinder
 * @constructor
 * @param scene - The scene
 * @param {number} height - height of the cylinder
 * @param {number} bRad - bottom radius
 * @param {number} tRad - top radius
 * @param {number} stacks - parts along height
 * @param {number} slices - parts per section
 */
function MyCylinder(scene, height, bRad, tRad, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
	this.height=height;

	this.bRad = bRad;
	this.tRad = tRad;

 	this.initBuffers();
};

/**
 * Stances that MyCylinder has the properties of a CGFobject.
*/
MyCylinder.prototype = Object.create(CGFobject.prototype);

/**
 * Creates a MyCylinder.
 */
MyCylinder.prototype.constructor = MyCylinder;

/**
 * Initiates the buffers on the object MyCylinder.
 * Creates a cylinder or a cone, their normals and their texture coordinates.
 */
MyCylinder.prototype.initBuffers = function() {
    var phi = 2*Math.PI/this.slices;
	var radius = (this.tRad - this.bRad) / this.stacks;
	var theta = this.height/this.stacks;

	this.vertices=[];
	this.texCoords=[];
 	this.normals=[];

 	for(stack = 0; stack < this.stacks+1;++stack){
 		for(slice = 0; slice < this.slices+1;++slice){
 			var currRadius = (this.tRad - this.bRad)/this.stacks * stack;
 			// normais
 			this.vertices.push((this.bRad + (radius * stack))*Math.cos(slice*phi),(this.bRad + (radius * stack))*Math.sin(slice*phi),stack*theta);
 			this.normals.push(currRadius * Math.cos(theta) * Math.cos(phi), currRadius*Math.cos(theta)*Math.sin(phi), currRadius*Math.sin(theta) );
 			this.texCoords.push(slice/this.slices, 1-stack/this.stacks);
 		}
 	}

 	this.indices=[];

	for (var stack = 0; stack < this.stacks; ++stack) {
 		for (var slice = 0; slice < (this.slices + 1); ++slice) {
            this.indices.push(stack * (this.slices + 1) + slice, stack * (this.slices + 1) + (slice + 1) % (this.slices + 1), (stack + 1) * (this.slices + 1) + (slice + 1) % (this.slices + 1));
            this.indices.push(stack * (this.slices + 1) + slice, (stack + 1) * (this.slices + 1) + (slice + 1) % (this.slices + 1), (stack + 1) * (this.slices + 1) + slice);
 		}
 	}
	
    this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
 };

/**
 * Scales the texCoords according to the s and t amplification factor.
 */
MyCylinder.prototype.scaleTexCoords = function(ampS, ampT) {
	this.updateTexCoordsGLBuffers();
};