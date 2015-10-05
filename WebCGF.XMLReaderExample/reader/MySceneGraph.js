
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
	

	var ambient = ilumation[0].getElementsByTagName('ambient');
	if (ambient == null) return "ambient element missing in ILLUMINATION";
	this.ambientLight = [];
	this.ambientLight[0] = this.reader.getFloat(ambient[0],'r', true);
	if(ambientLight[0] > 255 || ambientLight[0] < 0) return "'r' attribute in 'ambient' must be between 0 and 255.";

	this.ambientLight[1] = this.reader.getFloat(ambient[0],'g', true);
	if(ambientLight[1] > 255 || ambientLight[1] < 0) return "'r' attribute in 'ambient' must be between 0 and 255.";

	this.ambientLight[2] = this.reader.getFloat(ambient[0],'b', true);
	if(ambientLight[2] > 255 || ambientLight[2] < 0) return "'r' attribute in 'ambient' must be between 0 and 255.";
	
	this.ambientLight[3] = this.reader.getFloat(ambient[0],'a', true);
	if(ambientLight[3] > 1 || ambientLight[3]<0) return "'a' attribute in 'ambient' must be between 0 and 1.";



	var background = ilumation[0].getElementsByTagName('background');
	if (background == null) return "'background' element missing in ILLUMINATION";
	this.backgroundLight = [];

	this.backgroundLight[0] = this.reader.getFloat(background[0],'r', true);
	if(backgroundLight[0] > 255 || backgroundLight[0] < 0) return "'r' attribute in 'background' must be between 0 and 255.";

	this.backgroundLight[1] = this.reader.getFloat(background[0],'g', true);
	if(backgroundLight[1] > 255 || backgroundLight[1] < 0) return "'g' attribute in 'background' must be between 0 and 255.";

	this.backgroundLight[2] = this.reader.getFloat(background[0],'b', true);
	if(backgroundLight[2] > 255 || backgroundLight[2] < 0) return "'b' attribute in 'background' must be between 0 and 255.";

	this.backgroundLight[3] = this.reader.getFloat(background[0],'a', true);
	if(backgroundLight[3] > 1 || backgroundLight[3]<0) return "'a' attribute in 'background' must be between 0 and 1.";

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



		var specularElem = materialNode[i].getElementsByTagName('specular');
		if (specularElem == null) return "'specular' element missing in MATERIAL id = " + id;
		this.specular = [];

		this.specular[0] = this.reader.getFloat(specularElem[0],'r', true);
		if(specular[0] > 255 || specular[0] < 0) return "'r' attribute in 'specular' must be between 0 and 255.";

		this.specular[1] = this.reader.getFloat(specularElem[0],'g', true);
		if(specular[1] > 255 || specular[1] < 0) return "'g' attribute in 'specular' must be between 0 and 255.";

		this.specular[2] = this.reader.getFloat(specularElem[0],'b', true);
		if(specular[2] > 255 || specular[2] < 0) return "'b' attribute in 'specular' must be between 0 and 255.";

		this.specular[3] = this.reader.getFloat(specularElem[0],'a', true);
		if(specular[3] > 1 || specular[3]<0) return "'a' attribute in 'specular' must be between 0 and 1.";



		var diffuseElem = materialNode[i].getElementsByTagName('diffuse');
		if (diffuseElem == null) return "'diffuse' element missing in MATERIAL id = " + id;
		this.diffuse = [];

		this.diffuse[0] = this.reader.getFloat(diffuseElem[0],'r', true);
		if(diffuse[0] > 255 || diffuse[0] < 0) return "'r' attribute in 'diffuse' must be between 0 and 255.";

		this.diffuse[1] = this.reader.getFloat(diffuseElem[0],'g', true);
		if(diffuse[1] > 255 || diffuse[1] < 0) return "'g' attribute in 'diffuse' must be between 0 and 255.";

		this.diffuse[2] = this.reader.getFloat(diffuseElem[0],'b', true);
		if(diffuse[2] > 255 || diffuse[2] < 0) return "'b' attribute in 'diffuse' must be between 0 and 255.";

		this.diffuse[3] = this.reader.getFloat(diffuseElem[0],'a', true);
		if(diffuse[3] > 1 || diffuse[3]<0) return "'a' attribute in 'diffuse' must be between 0 and 1.";



		var ambientElem = materialNode[i].getElementsByTagName('ambient');
		if (ambientElem == null) return "'ambient' element missing in MATERIAL id = " + id;
		this.ambient = [];

		this.ambient[0] = this.reader.getFloat(ambientElem[0],'r', true);
		if(ambient[0] > 255 || ambient[0] < 0) return "'r' attribute in 'ambient' must be between 0 and 255.";

		this.ambient[1] = this.reader.getFloat(ambientElem[0],'g', true);
		if(ambient[1] > 255 || ambient[1] < 0) return "'g' attribute in 'ambient' must be between 0 and 255.";

		this.ambient[2] = this.reader.getFloat(ambientElem[0],'b', true);
		if(ambient[2] > 255 || ambient[2] < 0) return "'b' attribute in 'ambient' must be between 0 and 255.";

		this.ambient[3] = this.reader.getFloat(ambientElem[0],'a', true);
		if(ambient[3] > 1 || ambient[3]<0) return "'a' attribute in 'ambient' must be between 0 and 1.";



		var emissionElem = materialNode[i].getElementsByTagName('emission');
		if (emissionElem == null) return "'emission' element missing in MATERIAL id = " + id;
		this.emission = [];

		this.emission[0] = this.reader.getFloat(emissionElem[0],'r', true);
		if(emission[0] > 255 || emission[0] < 0) return "'r' attribute in 'emission' must be between 0 and 255.";

		this.emission[1] = this.reader.getFloat(emissionElem[0],'g', true);
		if(emission[1] > 255 || emission[1] < 0) return "'g' attribute in 'emission' must be between 0 and 255.";

		this.emission[2] = this.reader.getFloat(emissionElem[0],'b', true);
		if(emission[2] > 255 || emission[2] < 0) return "'b' attribute in 'emission' must be between 0 and 255.";

		this.emission[3] = this.reader.getFloat(emissionElem[0],'a', true);
		if(emission[3] > 1 || emission[3]<0) return "'a' attribute in 'emission' must be between 0 and 1.";

	
		var newMaterial = new MyMaterial(this, id);
		newMaterial.setShininess(shininess);
		newMaterial.setSpecular(specular[0], specular[1], specular[2], specular[3]);
		newMaterial.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
		newMaterial.setEmission(emission[0], emission[1], emission[2], emission[3]);

		this.materials[id] = newMaterial;
	}
}


MySceneGraph.prototype.parseMaterials= function(rootElement){
	var lightElement = rootElement.getElementsByTagName('LIGHTS');
	if (lightElement == null) return "LIGHTS element is missing.";
	var lightNode = materialsElement[0].getElementsByTagName('LIGHT');
	var numberLights = lightNode.length;
	if (numberLights < 1) return "number of 'LIGHT' elements in 'LIGHTS' must be at least 1.";
	//TODO acabar
}

/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


