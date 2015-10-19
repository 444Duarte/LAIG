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

	var AB = vec3.create();
    var BC = vec3.create();
    var CA = vec3.create();

    vec3.sub(AB, vec3.fromValues(this.x2, this.y2, this.z2), vec3.fromValues(this.x1, this.y1, this.z1));
    vec3.sub(BC, vec3.fromValues(this.x3, this.y3, this.z3), vec3.fromValues(this.x2, this.y2, this.z2));
    vec3.sub(CA, vec3.fromValues(this.x3, this.y3, this.z3), vec3.fromValues(this.x1, this.y1, this.z1));

	var N = vec3.create();
	vec3.cross(N, AB, BC);

    vec3.normalize(N, N);

	this.normals = [
		N[0], N[1], N[2],
		N[0], N[1], N[2],
		N[0], N[1], N[2],
    ];

    var t_temp = (vec3.sqrLen(AB) + vec3.sqrLen(CA) - vec3.sqrLen(BC))/ (2 * vec3.length(AB));
    var s_temp = Math.sqrt(vec3.sqrLen(CA) - t_temp * t_temp);

	this.nonScaledTexCoords = [
        0,0,
        vec3.length(AB),0,
        s_temp, t_temp
    ];

    this.texCoords = this.nonScaledTexCoords.slice(0);

    this.primitiveType=this.scene.gl.TRIANGLES;
    
    this.initGLBuffers();
};

/**
 * Scales the texCoords according to the s and t amplification factor, 2 at a time.
 */
MyTriangle.prototype.scaleTexCoords = function(ampS, ampT) {
    for (var i = 0; i < this.texCoords.length; i = i + 2) {
        this.texCoords[i] = this.nonScaledTexCoords[i] / ampS;
        this.texCoords[i + 1] = this.nonScaledTexCoords[i+1] / ampT;
    }

    this.updateTexCoordsGLBuffers();
};