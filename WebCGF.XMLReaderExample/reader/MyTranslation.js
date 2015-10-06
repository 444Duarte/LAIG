function MyTranslation(scene) {
 	CGFobject.call(this,scene);
	
 };

 MyTranslation.prototype = Object.create(MyTransformation.prototype);
 MyTranslation.prototype.constructor = MyTranslation;

 MyTranslation.prototype.apply = function(){
 	this.scene.translation(x,y,z);
 };
