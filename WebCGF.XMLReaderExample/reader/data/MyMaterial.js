/**
 * MyMaterial
 * @constructor
 */
function MyMaterial(scene, id) {
    CGFappearance.call(this, scene);

    this.id = id;
}

MyMaterial.prototype = Object.create(CGFappearance.prototype);
MyMaterial.prototype.constructor = MyMaterial;