/**
 * Creates MyNode
 * @constructor
 * @param scene - The scene
 * @param {MyMaterial} material - the material the node has
 * @param {MyTexture} texture - the texture the node has
 * @param {MyTransformation} transformations - the transformations the node suffers
 * @param {MyNode} descendants - the descendants the node has
 */
function MyNode(scene,id, material, texture, transformations, descendants) {
 	CGFobject.call(this,scene);
	this.id= id;
	this.material=material;
	this.texture=texture;

	this.descendants=descendants;
	this.transformations=transformations;
 };

/**
 * Stances that MyNode has the properties of a CGFobject.
*/
MyNode.prototype = Object.create(CGFobject.prototype);

 /**
 * Creates a MyNode.
 */
MyNode.prototype.constructor = MyNode;

/**
 * Displays a given node, applying transformations, materials and textures.
 * @param {MyTexture} parent texture - The texture the parent node has
 * @param {MyTexture} parent texture - The material the parent node has
 */
MyNode.prototype.display = function(parentTexture, parentMaterial) {

 	var currentTexture;
 	var currentMaterial;

 	this.scene.pushMatrix();

 	switch(this.texture)
 	{
 		case 'clear':
 		currentTexture = null;
 		break;

 		case null:
 		currentTexture = parentTexture;
 		break;

 		default:
 		currentTexture = this.texture;
 		break;

 	}

 	switch(this.material)
 	{
 		case null:
 		currentMaterial = parentMaterial;
 		break;

 		default:
 		currentMaterial = this.material;
 		break;

 	}


 	for(var i = 0; i < this.transformations.length; i++)
 	{
 		this.transformations[i].apply();
 	}
 	for(var i = 0; i < this.descendants.length; i++)
 	{
 		if (this.scene.nodes[this.descendants[i]] == null)
 		{
 			if (this.scene.leaves[this.descendants[i]] == null)
 			{
 				console.error("'DESCENDANT' id="+this.descendants[i]+" in 'NODE' id="+this.id+" isn't referenced as a 'NODE' or 'LEAF'.\n" );
 				return false;
 			}
 			if (currentMaterial != null) currentMaterial.apply();
 			if (currentTexture != null) 
 				{
 					this.scene.leaves[this.descendants[i]].scaleTexCoords(currentTexture.s, currentTexture.t);
 					currentTexture.bind();
 				}
 			this.scene.leaves[this.descendants[i]].display();
 			if (currentTexture != null) currentTexture.unbind();
 			
 		}
 		else
 			this.scene.nodes[this.descendants[i]].display(currentTexture ,currentMaterial);
 	}
 	this.scene.popMatrix();
};