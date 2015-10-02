/**
 * MyCilinder
 * @constructor
 */
 function MyCilinder(scene, height, bRad, tRad, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

	this.height = height;
	this.bRad = bRad;
	this.tRad = tRad;

	this.bBase = new MyCircle(scene, slices);
	this.tBase = new MyCircle(scene, slices);
	this.body = new MyCylinderBody(scene, bRad, tRad, stacks, slices);

	this.minS = typeof minS !== 'undefined' ? minS : 0;
	this.maxS = typeof maxS !== 'undefined' ? maxS : 1;
	this.minT = typeof minT !== 'undefined' ? minT : 0;
	this.maxT = typeof maxT !== 'undefined' ? maxT : 1;

 	this.initBuffers();
 };

 MyCilinder.prototype = Object.create(CGFobject.prototype);
 MyCilinder.prototype.constructor = MyCilinder;

 MyCilinder.prototype.initBuffers = function() {
 
 	/* Bottom base */
	this.scene.pushMatrix();
	this.scene.scale(this.bRad,this.bRad,1);
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.bBase.display();
	this.scene.popMatrix();

	/* Top base */
	this.scene.pushMatrix();
	this.scene.translate(0,0,this.height);
	this.scene.scale(this.tRad, this.tRad,1);
	this.tBase.display();
	this.scene.popMatrix();

	/* Body */
	this.scene.pushMatrix();
	this.scene.scale(1,1,this.height);
	this.body.display();
	this.scene.popMatrix();

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
