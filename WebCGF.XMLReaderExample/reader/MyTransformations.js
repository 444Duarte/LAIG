function MyTransformation(scene) {
 	CGFobject.call(this,scene);
	
 };

 MyTransformation.prototype = Object.create(CGFobject.prototype);
 MyTransformation.prototype.constructor = MyTransformation;

 MyTransformation.prototype.apply = function();

 MyTransformation.prototype.rotation = function(axis, degree){

 	var deg2rad = degree * Math.PI / 180;
 	var vecEixo[];

 	switch(axis)
 	{
 		case 'x':
 			vecEixo.push(1,0,0);
 			break;
 		case 'y':
 			vecEixo.push(0,1,0);
 			break;
 		case 'z':
 			vecEixo.push(0,0,1);
 			break;
 		default:
 			this.scene.console.log("BUG\n");
 			break;
 	}

 	this.scene.rotate(deg2rad, vecEixo[0], vecEixo[1], vecEixo[2]);
 };