/**
 * Creates a triangle given three points.
 * @constructor
 * @param scene - The scene
 * @param {number} x1 - The x coord of the first point
 * @param {number} y1 - The y coord of the first point
 * @param {number} z1 - The z coord of the first point
 * @param {number} x2 - The x coord of the second point
 * @param {number} y2 - The y coord of the second point
 * @param {number} z2 - The z coord of the second point
 * @param {number} x3 - The x coord of the third point
 * @param {number} y3 - The y coord of the third point
 * @param {number} z3 - The z coord of the third point
 */
function MyTriangle(scene, x1,y1,z1,x2,y2,z2,x3,y3,z3){
    CGFobject.call(this,scene);

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;

    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;

    this.initBuffers();
}

/**
 * Stances that MyTriangle has the properties of a CGFobject.
*/
MyTriangle.prototype = Object.create(CGFobject.prototype);

/**
 * Creates a MyTriangle.
 */
MyTriangle.prototype.constructor = MyTriangle;

/**
 * Initiates the buffers on the object MyTriangle.
 * Creates a triangle, his normals and his texture coordinates
 */
MyTriangle.prototype.initBuffers = function() {

    this.vertices = [
        this.x1,this.y1,this.z1,
        this.x2,this.y2,this.z2,
        this.x3,this.y3,this.z3
    ];

    this.indices = [0,1,2];

	var A = vec3.fromValues(this.x1-this.x2, this.y1-this.y2, this.z1-this.z2);
	var B = vec3.fromValues(this.x1-this.x3, this.y1-this.y3, this.z1-this.z3);
	var N = vec3.create();
	vec3.cross(N, A, B);

	this.normals = [
		N[0], N[1], N[2],
		N[0], N[1], N[2],
		N[0], N[1], N[2],
    ];

	// Fix texCoords
	this.texCoords = [
		0, 0,
		1, 0,
		1, 1
	]

    this.primitiveType=this.scene.gl.TRIANGLES;

	this.initGLBuffers();
}