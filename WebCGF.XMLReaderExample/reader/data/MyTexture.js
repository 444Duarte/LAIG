/**
 * MyTexture
 * @constructor
 */
function MyTexture(scene, id, path, s, t) {
    CGFtexture.call(this, scene,path);

    this.id = id;
    this.s = s;
    this.t = t;
}

MyTexture.prototype = Object.create(CGFtexture.prototype);
MyTexture.prototype.constructor = MyTexture;