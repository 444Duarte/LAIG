/**
 * Constructor MyCylinder
 * @constructor
 * @param scene - The scene
 * @param {number} bRad - bottom radius
 * @param {number} tRad - top radius
 * @param {number} stacks - parts along height
 * @param {number} slices - parts per section
 */
function MyCylinder(scene, bRad, tRad, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

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
    var angulo = 2*Math.PI/this.slices;
	var radius = (this.tRad - this.bRad) / this.stacks;

	this.vertices=[];
	this.texCoords=[];
 	this.normals=[];

 	for(stack = 0; stack < this.stacks+1;++stack){
 		for(slice = 0; slice < this.slices+1;++slice){
 			// normais
 			this.vertices.push((this.bRad + (radius * stack))*Math.cos(slice*angulo),(this.bRad + (radius * stack))*Math.sin(slice*angulo),stack/this.stacks);
 			this.normals.push(Math.cos(slice*angulo),Math.sin(slice*angulo),0);
 			this.texCoords.push(slice/this.slices, 1-stack/this.stacks);
 		}
 	}

 	this.indices=[];

	for(stack=0; stack < this.stacks;++stack){
		for(slice=0; slice < this.slices;++slice){
			this.indices.push(stack*this.slices+slice,stack*this.slices+((slice+1)%this.slices),(stack+1)*this.slices+(slice+1)%this.slices);
			this.indices.push(stack*this.slices+slice,(stack+1)*this.slices+((slice+1)%this.slices),(stack+1)*this.slices+slice);
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