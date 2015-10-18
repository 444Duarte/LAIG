/**
 * Creates MyScale
 * @constructor
 * @param scene - The scene
 * @param {number} x - The scale on the x coord
 * @param {number} y - The scale on the y coord
 * @param {number} z - The scale on the z coord
 */
function MyScale(scene, x, y, z) {
 	CGFobject.call(this,scene);

 	this.x = x;
 	this.y = y;
 	this.z = z;
	
 };

/**
 * Stances that MyScale has the properties of a CGFobject.
*/
 MyScale.prototype = Object.create(CGFobject.prototype);

 /**
 * Creates a MyScale.
 */
 MyScale.prototype.constructor = MyScale;

/**
 * Applies the scale to the scene.
 */
 MyScale.prototype.apply = function(){
 	this.scene.scale(this.x,this.y,this.z);
 };
