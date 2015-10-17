function MyTranslation(scene, x, y, z) {
 	CGFobject.call(this,scene);

 	this.x = x;
 	this.y = y;
 	this.z = z;
	
 };

 MyTranslation.prototype = Object.create(CGFobject.prototype);
 MyTranslation.prototype.constructor = MyTranslation;

 MyTranslation.prototype.apply = function(){
 	this.scene.translation(x,y,z);
 };
