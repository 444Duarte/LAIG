function MyNode(scene, material, texture, transformations, descendants) {
 	CGFobject.call(this,scene);
	
	this.material=material;
	this.texture=texture;
	this.descendants=descendants;
	this.transformations=transformations;
 };

 MyNode.prototype = Object.create(CGFobject.prototype);
 MyNode.prototype.constructor = MyNode;