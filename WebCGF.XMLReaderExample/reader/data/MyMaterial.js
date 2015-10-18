/**
 * MyMaterial
 * @constructor
 */
function MyMaterial(scene, id) {
    CGFappearance.call(this, scene);

    this.id = id;
}

/**
 * Stances that MyMaterial has the properties of a CGFappearance.
*/
MyMaterial.prototype = Object.create(CGFappearance.prototype);

/**
 * Creates a MyMaterial.
 */
MyMaterial.prototype.constructor = MyMaterial;