function MyScale(scene) {
 	CGFobject.call(this,scene);
	
 };

 MyScale.prototype = Object.create(MyTransformation.prototype);
 MyScale.prototype.constructor = MyScale;

 MyScale.prototype.apply = function(){
 	this.scene.scale(x,y,z);
 };
