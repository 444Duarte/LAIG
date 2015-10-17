
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
	var elems =  rootElement.getElementsByTagName('INITIALS');
	if (elems == null) {
		return "initials element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'INITIALS' element found.";
	}

	var initials = elems[0];
	
	var frustum = initials.getElementsByTagName('frustum');
	if(frustum == null)	return "frustum element missing";
	this.frustum = [];
	this.frustum[0] = this.reader.getFloat(frustum, 'near', true);
	this.frustum[1] = this.reader.getFloat(frustum, 'far', true);

	var translate = initials.getElementsByTagName('translate');
	if(translate == null) return "translate element missing";
	this.translate = [];
	this.translate[0] = this.reader.getFloat(translate, 'x', true);
	this.translate[1] = this.reader.getFloat(translate, 'y', true);
	this.translate[2] = this.reader.getFloat(translate, 'z', true);

	var rotation = initials.getElementsByTagName('rotation');
	if (rotation.length != 3) return "initial rotations not correct";
	this.rotation = [];
	var rotationX = [];
	rotationX[0] = this.reader.getString(rotation[0], 'axis', true);
	rotationX[1] = this.reader.getFloat(rotation[0], 'angle', true);
	this.rotation[0] = rotationX;
	var rotationY = [];
	rotationY[0] = this.reader.getString(rotation[1], 'axis', true);
	rotationY[1] = this.reader.getFloat(rotation[1], 'angle', true);
	this.rotation[1] = rotationY;
	var rotationZ = [];
	rotationZ[0] = this.reader.getString(rotation[2], 'axis', true);
	rotationZ[1] = this.reader.getFloat(rotation[2], 'angle', true);
	this.rotation[2] = rotationZ;

	var scale = initials.getElementsByTagName('scale');
	this.scale = [];
	this.scale[0] = this.reader.getFloat(scale, 'sx', true);
	this.scale[1] = this.reader.getFloat(scale, 'sy', true);
	this.scale[2] = this.reader.getFloat(scale, 'sz', true);
	

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
	}

}

MySceneGraph.prototype.parseMaterials= function(rootElement){
	var materialsElement = rootElement.getElementsByTagName('MATERIALS');
	if (materialsElement == null) return "MATERIALS element is missing.";
	var materialNode = materialsElement[0].getElementsByTagName('MATERIAL');
	var numberMaterials = materialNode.length;
	if (numberTextures < 1) return "number of 'MATERIAL' elements in 'MATERIALS' must be at least 1.";

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


