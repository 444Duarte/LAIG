
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobalsExample(rootElement);
	error = this.parseInitials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};


MySceneGraph.prototype.parseInitials= function(rootElement){
	//TODO add console.logs
	var elems =  rootElement.getElementsByTagName('INITIALS');
	if (elems == null) {
		return "initials element is missing in INITIALS.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'INITIALS' element found.";
	}

	var initials = elems[0];
	
	var frustum = initials.getElementsByTagName('frustum');
	if(frustum == null)	return "frustum element missing in INITIALS";
	this.frustum = [];
	this.frustum[0] = this.reader.getFloat(frustum[0], 'near', true);
	this.frustum[1] = this.reader.getFloat(frustum[0], 'far', true);

	var translate = initials.getElementsByTagName('translate');
	if(translate == null) return "translate element missing in INITIALS";
	this.translate = [];
	this.translate[0] = this.reader.getFloat(translate[0], 'x', true);
	this.translate[1] = this.reader.getFloat(translate[0], 'y', true);
	this.translate[2] = this.reader.getFloat(translate[0], 'z', true);

	var rotation = initials.getElementsByTagName('rotation');
	if (rotation.length != 3) return "rotation elements in INITIALS not correct. Number of elements 'rotation' must be three.";
	this.rotation = [];
	var rotation1 = [];
	rotation1[0] = this.reader.getString(rotation[0], 'axis', true);
	rotation1[1] = this.reader.getFloat(rotation[0], 'angle', true);
	this.rotation[0] = rotation1;
	var rotation2 = [];
	rotation2[0] = this.reader.getString(rotation[1], 'axis', true);
	rotation2[1] = this.reader.getFloat(rotation[1], 'angle', true);
	this.rotation[1] = rotation2;
	var rotation3 = [];
	rotation3[0] = this.reader.getString(rotation[2], 'axis', true);
	rotation3[1] = this.reader.getFloat(rotation[2], 'angle', true);
	this.rotation[2] = rotation3;	
	
	var reference = this.initials.getElementsByTagName('reference');
	if (reference == null) return "reference element missing in INITIALS";
	this.reference = this.reader.getFloat(reference[0],'length', true);	

};
	

MySceneGraph.prototype.parseIlumination= function(rootElement){
	//TODO add console.logs
	var ilumation = rootElement.getElementsByTagName('ILLUMINATION');
	if (ilumation == null) return "ILLUMINATION element is missing.";

	if (ilumation[0].children.length != 2) return "number of elements in 'ILLUMINATION' different from two.";
	

	this.ambientLight = parseRGBA(ilumation[0], 'ambient','ILLUMINATION');
	this.backgroundLight = parseRGBA(ilumation[0], 'background','ILLUMINATION');

}

MySceneGraph.prototype.parseTextures= function(rootElement){
	//TODO add console.logs
	var texturesElement = rootElement.getElementsByTagName('TEXTURES');
	if (texturesElement == null) return "TEXTURES element is missing.";
	var textureNode = texturesElement[0].getElementsByTagName('TEXTURE');
	var numberTextures = textureNode.length;
	if (numberTextures < 1) return "number of 'TEXTURE' elements in 'TEXTURES' must be at least 1.";

	this.textures = [];
	

	for(var i = 0; i < numberTextures; i++){
		//TODO verificar se isto é necessário fazer ou se basta aceder ao atributo 'id' usando 'textureNode[i].id'
		var id = this.reader.getString(textureNode[i], 'id',true);

		var file = textureNode[i].getElementsByTagName('path');
		if (file == null) return "'file' element missing in TEXTURE id = " + id;
		var path = this.reader.getString(file[0], 'path', true);

		var amplifFactor = textureNode[i].getElementsByTagName('amplif_factor');
		if (amplifFactor == null) return "'amplif_factor' element missing in TEXTURE id = " + id;
		var s = this.reader.getString(amplifFactor[0], 's', true);
		var t = this.reader.getString(amplifFactor[0], 't', true);
		textures[id] = new MyTexture(this, id, path, s, t);
		textures[id].enable();
	}

}

MySceneGraph.prototype.parseMaterials= function(rootElement){
	var materialsElement = rootElement.getElementsByTagName('MATERIALS');
	if (materialsElement == null) return "MATERIALS element is missing.";
	var materialNode = materialsElement[0].getElementsByTagName('MATERIAL');
	var numberMaterials = materialNode.length;
	if (numberMaterials < 1) return "number of 'MATERIAL' elements in 'MATERIALS' must be at least 1.";

	this.materials = [];

	for(var i = 0; i < numberMaterials; i++){
		//TODO verificar se isto é necessário fazer ou se basta aceder ao atributo 'id' usando 'materialNode[i].id'
		var id = this.reader.getString(materialNode[i], 'id',true);
		
		var shininessElem = materialNode[i].getElementsByTagName('shininess');
		if (shininessElem == null) return "'shininess' element missing in MATERIAL id = " + id;
		var shininess = this.reader.getFloat(shininessElem[0], 'value', true);


		var specular = parseRGBA(materialNode[i], 'specular', 'MATERIAL');
		var diffuse = parseRGBA(materialNode[i], 'diffuse', 'MATERIAL');
		var ambient = parseRGBA(materialNode[i], 'ambient', 'MATERIAL');
		var emission = parseRGBA(materialNode[i], 'emission', 'MATERIAL');
	
		var newMaterial = new MyMaterial(this, id);
		newMaterial.setShininess(shininess);
		newMaterial.setSpecular(specular[0], specular[1], specular[2], specular[3]);
		newMaterial.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
		newMaterial.setEmission(emission[0], emission[1], emission[2], emission[3]);

		this.materials[id] = newMaterial;
	}
}


MySceneGraph.prototype.parseLights= function(rootElement){
	var lightElement = rootElement.getElementsByTagName('LIGHTS');
	if (lightElement == null) return "LIGHTS element is missing.";
	var lightNode = materialsElement[0].getElementsByTagName('LIGHT');
	var numberLights = lightNode.length;
	if (numberLights < 1) return "number of 'LIGHT' elements in 'LIGHTS' must be at least 1.";
	this.lights = [];
	for(var i = 0; i <numberLights; i++){
		var id = lightNode[i].id;
		var enable = this.reader.getBoolean(lightNode[i], 'enable', true);
		var position = parseLightPosition(lightNode[i], 'position', 'LIGHT');
		var ambient = parseRGBA(lightNode[i], 'ambient', 'LIGHT');
		var diffuse = parseRGBA(lightNode[i], 'diffuse', 'LIGHT');
		var specular = parseRGBA(lightNode[i], 'specular', 'LIGHT');

		this.lights[id] = new newCGFlight( this, lightNode[i].id );
		if(enable)
			this.lights[id].enable();
		else
			this.lights[id].disable();
		
		this.lights[id].setPosition(position[0], position[1], position[2], position[3]);
		this.lights[id].setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
		this.lights[id].setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
		this.lights[id].setSpecular(specular[0], specular[1], specular[2], specular[3]);		
	}


}

MySceneGraph.prototype.parseLeaves= function(rootElement){
	var leavesElement = rootElement.getElementsByTagName('LEAVES');
	if (leavesElement == null) return "LEAVES element is missing.";
	var leafNode = leavesElement[0].getElementsByTagName('LEAF');
	var numberLeaves = leafNode.length;
	if (numberLeaves < 1) return "number of 'LEAF' elements in 'LEAVES' must be at least 1.";

	this.leaves = [];

	for(var i = 0; i < numberLeaves; i++){
		var id = leafNode[i].id;
		var type = this.reader.getString(leafNode[i], 'type', true);
		switch(type){
			case 'rectangle':
				this.leaves[id] = parseRectangle(leafNode[i]);
				break;
			case 'cylinder':
				this.leaves[id] = parseCylinder(leafNode[i]);
				break;
			case 'sphere':
				this.leaves[id] = parseSphere(leafNode[i]);
				break;
			case 'triangle':
				this.leaves[id] = parseTriangle(leafNode[i]);
				break;
			default:
				return "invalid 'type' element in 'LEAF' id= " + id;
		}
	}
}

MySceneGraph.prototype.parseNodeList= function(rootElement){
	var nodesElement = rootElement.getElementsByTagName('NODES');
	if (nodesElement == null) return "'NODES' element  is missing.";

	var rootNode = nodesElement[0].getElementsByTagName('ROOT');
	if (rootNode == null) return "'ROOT' element in 'NODES' missing";	
	var rootId = this.reader.getString(rootNode[0], 'id', true);

	var nodeList = nodesElement[0].getElementsByTagName('NODE');
	if (nodeList.length < 1) return "There needs to be at least 1 'NODE' element inside 'NODES'";	

	for(var i = 0; i < nodesList.length; i++ ){
		parseNode(nodeList[i]);
	} 
}

MySceneGraph.prototype.parseNode= function(node){
	var material = parseNodeMaterial(node);
	var texture = parseTexture(node);
	var i = 2;
	var transformations=[];
	while(node.children[i].tagName != 'DESCENDANTS' && i < node.children.length){
		transformations[i-2] = parseTransformation(node.children[i]);
		i++;
	}
	//TODO acabar
}

MySceneGraph.prototype.parseNodeMaterial= function(node){
	var materialElement = node.getElementsByTagName('MATERIAL');
	if (materialElement == null) return "'MATERIAL' element missing in 'NODE' id= " + node.id;

	switch(materialElement[0].id){
		case "null":
			return null;
			break;
		default:
			var material = this.materials[materialElement[0].id];
			if (material == null) return "'MATERIAL' id =" + materialElement.id + "referenced in 'NODE' id= " + node.id + " doesn't exist in 'MATERIALS'";
			return material;	
			break;
	}
}
MySceneGraph.prototype.parseNodeTexture= function(node){
	var textureElement = node.getElementsByTagName('TEXTURE');
	if (textureElement == null) return "'TEXTURE' element missing in 'NODE' id= " + node.id;

	switch(textureElement[0].id){
		case "clear":
			return "clear";
			break;
		case "null":
			return "null";
			break;
		default:
			var texture = this.textures[textureElement[0].id];
			if (texture == null) return "'TEXTURE' id =" + textureElement.id + "referenced in 'NODE' id= " + node.id + " doesn't exist in 'TEXTURES'";
			return texture;	
			break;
	}
}

MySceneGraph.prototype.parseRectangle= function(node){
	var args = this.reader.getString(node[0], 'args', true);
	var coords = args.split(" ");
	if (coords.length != 4)
		return "number of arguments different of 4 in element args in 'LEAF' id= " + node.id;
	return new MyRectangle(this, parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]), parseFloat(coords[3]));
}

MySceneGraph.prototype.parseTriangle= function(node){
	var args = this.reader.getString(node[0], 'args', true);
	var coords = args.split(" ");
	if (coords.length != 9)
		return "number of arguments different of 9 in element args in 'LEAF' id= " + node.id;
	return new MyTriangle(this, parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]), parseFloat(coords[3]), parseFloat(coords[4]), parseFloat(coords[5]), parseFloat(coords[6]), parseFloat(coords[7]), parseFloat(coords[8]));
}

MySceneGraph.prototype.parseCylinder= function(node){
	var args = this.reader.getString(node[0], 'args', true);
	var coords = args.split(" ");
	if (coords.length != 5)
		return "number of arguments different of 5 in element args in 'LEAF' id= " + node.id;
	return new MyCylinder(this, parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]), parseInt(coords[3]), parseInt(coords[4]));
}

MySceneGraph.prototype.parseSphere= function(node){
	var args = this.reader.getString(node[0], 'args', true);
	var coords = args.split(" ");
	if (coords.length != 3)
		return "number of arguments different of 3 in element args in 'LEAF' id= " + node.id;
	return new MyCylinder(this, parseFloat(coords[0]), parseInt(coords[1]), parseInt(coords[2]));
}



MySceneGraph.prototype.parseTransformation= function(transformation){
	//TODO Acabar
	switch(transformation.tagName){
		case 'TRANSLATION':
			return parseTranslation(transformation);
		case 'ROTATION':
			return parseRotation(transformation);
		case 'SCALE':
			return parseScale(transformation);
		default:
			//TODO decidir o que fazer aqui.
			break;
	}
}

MySceneGraph.prototype.parseTranslation= function(node){
	var x = this.reader.getFloat(node[0], 'x', true);
	var y = this.reader.getFloat(node[0], 'y', true);
	var z = this.reader.getFloat(node[0], 'z', true);
	//TODO criar translação e retornar
}

MySceneGraph.prototype.parseRotation= function(node){
	var axis = this.reader.getString(node[0], 'axis', true);
	var angle = this.reader.getFloat(node[0], 'angle', true);
	//TODO criar rotação e retornar
}

MySceneGraph.prototype.parseScale= function(node){
	var sx = this.reader.getFloat(node[0], 'sx', true);
	var sy = this.reader.getFloat(node[0], 'sy', true);
	var sz = this.reader.getFloat(node[0], 'sz', true);
	//TODO criar scale e retornar;
}

MySceneGraph.prototype.parseLightPosition= function(node, element,nodeName){
	var element = node.getElementsByTagName(element);
	if (element == null) return "'" + element + "' element missing in " + nodeName + " id = " + node.id;
	var position = [];

	position[0] = this.reader.getFloat(element[0],'x', true);
	if(position[0] > 255 || position[0] < 0) return "'x' attribute in '" + element + "' must be between 0 and 255.";

	position[1] = this.reader.getFloat(element[0],'y', true);
	if(position[1] > 255 || position[1] < 0) return "'y' attribute in '" + element + "' must be between 0 and 255.";

	position[2] = this.reader.getFloat(element[0],'z', true);
	if(position[2] > 255 || position[2] < 0) return "'z' attribute in '" + element + "' must be between 0 and 255.";

	position[3] = this.reader.getFloat(element[0],'w', true);
	if(position[3] > 1 || position[3]<0) return "'w' attribute in '"+ element + "' must be between 0 and 1.";

	return position;
}

MySceneGraph.prototype.parseRGBA= function(node, element, nodeName){
	var element = node.getElementsByTagName(element);
	if (element == null) return "'" + element + "' element missing in " + nodeName + " id = " + node.id;
	var rgba = [];

	rgba[0] = this.reader.getFloat(element[0],'r', true);
	if(rgba[0] > 255 || rgba[0] < 0) return "'r' attribute in '" + element + "' must be between 0 and 255.";

	rgba[1] = this.reader.getFloat(element[0],'g', true);
	if(rgba[1] > 255 || rgba[1] < 0) return "'g' attribute in '" + element + "' must be between 0 and 255.";

	rgba[2] = this.reader.getFloat(element[0],'b', true);
	if(rgba[2] > 255 || rgba[2] < 0) return "'b' attribute in '" + element + "' must be between 0 and 255.";

	rgba[3] = this.reader.getFloat(element[0],'a', true);
	if(rgba[3] > 1 || rgba[3]<0) return "'a' attribute in '"+ element + "' must be between 0 and 1.";

	return rgba;
}


/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


