function MyNode(scene, material, texture, descendants) {
 	CGFobject.call(this,scene);
	
	this.material=material;
	this.texture=texture;
	this.descendants=descendants;
 };

 MyNode.prototype = Object.create(CGFobject.prototype);
 MyNode.prototype.constructor = MyNode;