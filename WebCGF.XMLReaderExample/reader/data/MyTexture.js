/**
 * MyTexture
 * @constructor
 */
function MyTexture(scene, id, path, s, t) {
    CGFappearance.call(this);

    this.id = id;
    this.loadTexture(scene);
    this.s = s;
    this.t = t;
}

MyTexture.prototype = Object.create(CGFappearance.prototype);
MyTexture.prototype.constructor = MyTexture;