function MyTransformation(scene) {
 	CGFobject.call(this,scene);
	
 };

 MyTransformation.prototype = Object.create(CGFobject.prototype);
 MyTransformation.prototype.constructor = MyTransformation;

 MyTransformation.prototype.apply = function();