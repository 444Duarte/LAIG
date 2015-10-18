/**
 * Constructor MySphere
 * @constructor
 * @param scene - The scene
 * @param {number} slices - parts along radius
 * @param {number} stacks - parts per section
 */
 function MySphere(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
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

	for (var stack = 0; stack < (this.stacks+1); ++stack) {
	    if(stack == this.stacks){
            this.vertices.push (0,0,1);
            this.normals.push(0,0,1);
            this.texCoords.push(0.5, 0.5);
	    }else {
	        for (var slice = 0; slice < this.slices + 1; ++slice) {
 		    this.vertices.push(Math.cos(slice*alpha)*Math.cos(stack*beta), Math.sin(slice*alpha)*Math.cos(stack*beta), Math.sin(stack*beta));
	 	    this.normals.push(Math.cos(slice*alpha)*Math.cos(stack*beta), Math.sin(slice*alpha)*Math.cos(stack*beta), Math.sin(stack*beta));
	 	    this.texCoords.push(slice/this.slices, stack/this.stacks);
	        }
	 	}
	}

 	for (var stack = 0; stack < this.stacks; ++stack) {
 		if(stack == this.stacks-1){
			for(var slice = 0; slice < this.slices; ++slice){
				this.indices.push(stack * this.slices + slice, stack * this.slices + (slice + 1) % this.slices, this.stacks*this.slices)
			}
 		}else{
			for (var slice = 0; slice < this.slices; ++slice) {
				this.indices.push(stack * this.slices + slice, stack * this.slices + (slice + 1) % this.slices, (stack + 1) * this.slices + (slice + 1) % this.slices);
				this.indices.push(stack * this.slices + slice, (stack + 1) * this.slices + (slice + 1) % this.slices, (stack + 1) * this.slices + slice);
			}
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