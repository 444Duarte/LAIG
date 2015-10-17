function MyNode(scene, material, texture, transformations, descendants) {
 	CGFobject.call(this,scene);
	
	this.material=material;
	this.texture=texture;

	this.descendants=descendants;
	this.transformations=transformations;
 };

MyNode.prototype = Object.create(CGFobject.prototype);
MyNode.prototype.constructor = MyNode;

MyNode.prototype.display = function(parentTexture, parentMaterial) {

 	var currentTexture;
 	var currentMaterial;

 	this.scene.pushMatrix();

 	switch(this.texture)
 	{
 		case 'clear':
 		currentTexture = null;
 		break;

 		case 'null':
 		currentTexture = parentTexture;
 		break;

 		default:
 		currentTexture = this.texture;
 		break;

 	}

 	switch(this.material)
 	{
 		case 'null':
 		currentMaterial = parentMaterial;
 		break;

 		default:
 		currentMaterial = this.material;
 		break;

 	}


 	for(var i = 0; i < transformations.length; i++)
 	{
 		this.transformations[i].apply();
 	}
 	for(var i = 0; i < descendants.length; i++)
 	{
 		if (this.scene.nodes[this.descendants[i]] == null)
 		{
 			if (this.scene.leaves[this.descendants[i]] == null)
 			{
 				this.graph.onXMLerror("'DESCENDANT' id="+this.descendants[i]+" isn't referenced as a 'NODE' or 'LEAF'.\n" );
 			}
 			currentMaterial.apply();
 			if (currentTexture != null) currentTexture.bind();
 			this.scene.leaves[this.descendants[i]].display();
 			if(currentTexture != null) currentTexture.unbind();
 			
 		}
 		else
 			this.scene.nodes[this.descendants[i]].display(currentTexture ,currentMaterial);
 	}
 	this.scene.popMatrix();
};