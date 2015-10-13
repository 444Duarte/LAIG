/**
 * MyCilinder
 * @constructor
 */
 function MyCilinder(scene, slices, stacks, minS, maxS, minT, maxT) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
	this.minS = typeof minS !== 'undefined' ? minS : 0;
	this.maxS = typeof maxS !== 'undefined' ? maxS : 1;
	this.minT = typeof minT !== 'undefined' ? minT : 0;
	this.maxT = typeof maxT !== 'undefined' ? maxT : 1;

 	this.initBuffers();
 };

 MyCilinder.prototype = Object.create(CGFobject.prototype);
 MyCilinder.prototype.constructor = MyCilinder;

 MyCilinder.prototype.initBuffers = function() {
 	this.vertices = [];
 	this.normals = [];
	this.indices = [];
	this.texCoords = [];

	// BEGIN faces laterais
	for (var stack = 0; stack < (this.stacks + 1); ++stack) {
 		for (var slice = 0; slice < (this.slices + 1); ++slice) {
	 	    this.vertices.push(Math.cos(slice * 2 * Math.PI / this.slices), Math.sin(slice * 2 * Math.PI / this.slices), stack / this.stacks);
	 	    this.normals.push(Math.cos(slice * 2 * Math.PI / this.slices), Math.sin(slice * 2 * Math.PI / this.slices), stack / this.stacks);
	 		this.texCoords.push(this.minS+ (this.maxS - this.minS)* slice/ this.slices, this.minT+ (this.maxT - this.minT)* (this.stacks - stack)/ this.stacks);
	 	}
	}

 	for (var stack = 0; stack < this.stacks; ++stack) {
 		for (var slice = 0; slice < (this.slices + 1); ++slice) {
            this.indices.push(stack * (this.slices + 1) + slice, stack * (this.slices + 1) + (slice + 1) % (this.slices + 1), (stack + 1) * (this.slices + 1) + (slice + 1) % (this.slices + 1));
            this.indices.push(stack * (this.slices + 1) + slice, (stack + 1) * (this.slices + 1) + (slice + 1) % (this.slices + 1), (stack + 1) * (this.slices + 1) + slice);
 		}
 	}
	// END faces laterais
	
	// BEGIN bases
	/*

	for (var slice = 0; slice < this.slices + 1; ++slice) {
		this.vertices.push(Math.cos(slice * 2 * Math.PI / this.slices), Math.sin(slice * 2 * Math.PI / this.slices), 0);
		this.normals.push(0, 0, -1);
		this.texCoords.push(this.minS+ (this.maxS - this.minS)* slice/ this.slices, this.maxT);
	}

	for (var slice = 0; slice < this.slices + 1; ++slice) {
		this.vertices.push(Math.cos(slice * 2 * Math.PI / this.slices), Math.sin(slice * 2 * Math.PI / this.slices), 1);
		this.normals.push(0, 0, 1);
		this.texCoords.push(this.minS+ (this.maxS - this.minS)* slice/ this.slices, this.minT);
	}

	var baseIndex = (this.stacks + 1) * (this.slices + 1);

	for (var slice = 0; slice < (this.slices - 1); ++slice) {
      	this.indices.push(baseIndex, baseIndex + (this.slices - (slice + 1)), baseIndex + (this.slices - (slice + 2)))
		this.indices.push(baseIndex + (this.slices + 1), baseIndex + (this.slices + 1) + slice, baseIndex + (this.slices + 1) + slice + 1);
	}
	*/
	
	// END bases
	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
