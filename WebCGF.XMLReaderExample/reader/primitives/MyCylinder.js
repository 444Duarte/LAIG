function MyCylinder(scene, bRad, tRad, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

	this.bRad = bRad;
	this.tRad = tRad;

 	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
    var angulo = 2*Math.PI/this.slices;
	var radius = (this.tRad - this.bRad) / this.stacks;

	this.vertices=[];
 	this.normals=[];

 	for(stack = 0; stack < this.stacks+1;++stack){
 		for(slice = 0; slice < this.slices;++slice){
 			// normais
 			this.vertices.push((this.bRad + (radius * stack))*Math.cos(slice*angulo),(this.bRad + (radius * stack))*Math.sin(slice*angulo),stack/this.stacks);
 			this.normals.push(Math.cos(slice*angulo),Math.sin(slice*angulo),0);
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