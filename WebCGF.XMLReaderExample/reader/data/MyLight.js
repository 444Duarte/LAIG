function MyLight(scene, an, id) {
    CGFlight.call(this, scene, an);
    this.id = id;
}

MyLight.prototype = Object.create(CGFlight.prototype);
MyLight.prototype.constructor = MyLight;