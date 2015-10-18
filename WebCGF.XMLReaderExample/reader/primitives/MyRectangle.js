/**
 * Constructor MyRectangle
 * @constructor
 * @param scene - The scene
 * @param {number} x1 - x coord from the first point
 * @param {number} y1 - y coord from the first point
 * @param {number} x2 - x coord from the second point
 * @param {number} y2 - y coord from the second point
 */
function MyRectangle(scene, x1, y1, x2, y2) {
	CGFobject.call(this,scene);

	this.x1=x1;
	this.x2=x2;
	this.y1=y1;
	this.y2=y2;
	this.initBuffers();
};

/**
 * Stances that MyRectangle has the properties of a CGFobject.
*/
MyRectangle.prototype = Object.create(CGFobject.prototype);

/**
 * Creates a MyRectangle.
 */
MyRectangle.prototype.constructor=MyRectangle;

/**
 * Initiates the buffers on the object MyRectangle.
 * Creates a triangle, his normals and his texture coordinates.
 */
MyRectangle.prototype.initBuffers = function () {
	this.vertices = [
            this.x1, this.y2, 0,
            this.x2, this.y2, 0,
            this.x2, this.y1, 0,
            this.x1, this.y1, 0
	];

	this.indices = [
            0, 1, 2, 
			0, 2, 3
    ];

    this.normals = [
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0
    ];

    this.texCoords = [
			0, 1,
			1, 0, 
			1, 1,
			1, 0
    ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
