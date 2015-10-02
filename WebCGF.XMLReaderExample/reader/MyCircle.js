/**
 * MyCircle
 * @constructor
 */
 function MyCircle(scene, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;

 	this.initBuffers();
 };

 MyCircle.prototype = Object.create(CGFobject.prototype);
 MyCircle.prototype.constructor = MyCircle;

 MyCircle.prototype.initBuffers = function() {
 	this.vertices = [];
 	this.normals = [];
	this.indices = [];
	this.texCoords = [];
	var	alpha = 2 * Math.PI/this.slices;

	for (var slice = 0; slice < this.slices; ++slice) {
		this.vertices.push(Math.cos(slice * alpha), Math.sin(slice * alpha), 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(Math.cos(slice * alpha)/2+0.5, 0.5 - Math.sin(slice * alpha)/2);
	}

	for (var slice = 0; slice < (this.slices - 2); ++slice) {
		this.indices.push( 0, slice + 1, slice + 2);
	}
		
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };