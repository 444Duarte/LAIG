/**
 * Creates MyRotation
 * @constructor
 * @param scene - The scene
 * @param {string} axis - The axis where it rotates
 * @param {number} degree - The angle it rotates
 */
function MyRotation(scene, axis, degree) {
 	CGFobject.call(this,scene);
 	this.axis = axis;
 	this.degree = degree;
	
 };

/**
 * Stances that MyRotation has the properties of a CGFobject.
*/
 MyRotation.prototype = Object.create(CGFobject.prototype);

 /**
 * Creates a MyRotation.
 */
 MyRotation.prototype.constructor = MyRotation;

/**
 * Applies the rotation to the scene.
 */
 MyRotation.prototype.apply = function(){
 	
 	var deg2rad = this.degree * Math.PI / 180;
 	var vecEixo = [];

 	switch(this.axis)
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
 			this.scene.console.log("Eixo errado\n");
 			break;
 	}

 	this.scene.rotate(deg2rad, vecEixo[0], vecEixo[1], vecEixo[2]);

 };
