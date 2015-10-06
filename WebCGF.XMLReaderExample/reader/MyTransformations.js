function MyTransformations(scene) {
 	CGFobject.call(this,scene);
	
 };

 MyTransformations.prototype = Object.create(CGFobject.prototype);
 MyTransformations.prototype.constructor = MyTransformations;

 MyTransformations.prototype.Rotation = function(axis, degree){

 	var deg2rad = degree * Math.PI / 180;
 	var vecEixo[];

 	switch(axis)
 	{
 		case: 'x'
 		{
 			
 		}
 	}
 	


 	this.scene.rotate(deg2rad, )
 };