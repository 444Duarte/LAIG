/**
 * MyMaterial
 * @constructor
 */
function MyMaterial(scene, id) {
    CGFappearance.call(this);

    this.id = id;
}

MyMaterial.prototype = Object.create(CGFappearance.prototype);
MyMaterial.prototype.constructor = MyMaterial;