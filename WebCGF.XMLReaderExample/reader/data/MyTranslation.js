/**
 * Creates MyTranslation
 * @constructor
 * @param {number} x - The translation on the x coord
 * @param {number} y - The translation on the y coord
 * @param {number} z - The translation on the z coord
 */
function MyTranslation(scene, x, y, z) {
 	CGFobject.call(this,scene);

 	this.x = x;
 	this.y = y;
 	this.z = z;
	
 };

/**
 * Stances that MyTranslation has the properties of a CGFobject.
*/
 MyTranslation.prototype = Object.create(CGFobject.prototype);

 /**
 * Creates a MyTranslation.
 */
 MyTranslation.prototype.constructor = MyTranslation;

/**
 * Applies the translation to the scene.
 */
 MyTranslation.prototype.apply = function(){
 	this.scene.translate(this.x,this.y,this.z);
 };
