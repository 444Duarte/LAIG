
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
	var ilumation = rootElement.getElementsByTagName('ILLUMINATION');
	if (ilumation == null) return "ILLUMINATION element is missing.";

	if (ilumation[0].children.length != 2) return "number of elements in 'ILLUMINATION' different from two.";
	
	var ambient = ilumation[0].getElementsByTagName('ambient');
	if (ambient == null) return "ambient element missing in ILLUMINATION";
	this.ambientLight = [];
	this.ambientLight[0] = this.reader.getFloat(ambient,'r', true);
	if(ambientLight[0] > 255 || ambientLight[0] < 0) return "'r' attribute in 'ambient' must be between 0 and 255.";

	this.ambientLight[1] = this.reader.getFloat(ambient,'g', true);
	if(ambientLight[1] > 255 || ambientLight[1] < 0) return "'r' attribute in 'ambient' must be between 0 and 255.";

	this.ambientLight[2] = this.reader.getFloat(ambient,'b', true);
	if(ambientLight[2] > 255 || ambientLight[2] < 0) return "'r' attribute in 'ambient' must be between 0 and 255.";
	this.ambientLight[3] = this.reader.getFloat(ambient,'a', true);
	if(ambientLight[3] > 1 || ambientLight[3]<0) return "'a' attribute in 'ambient' must be between 0 and 1.";



	var background = ilumation[0].getElementsByTagName('background');
	if (background == null) return "'background' element missing in ILLUMINATION";
	this.backgroundLight = [];

	this.backgroundLight[0] = this.reader.getFloat(background,'r', true);
	if(backgroundLight[0] > 255 || backgroundLight[0] < 0) return "'r' attribute in 'background' must be between 0 and 255.";

	this.backgroundLight[1] = this.reader.getFloat(background,'g', true);
	if(backgroundLight[1] > 255 || backgroundLight[1] < 0) return "'g' attribute in 'background' must be between 0 and 255.";

	this.backgroundLight[2] = this.reader.getFloat(background,'b', true);
	if(backgroundLight[2] > 255 || backgroundLight[2] < 0) return "'b' attribute in 'background' must be between 0 and 255.";

	this.backgroundLight[3] = this.reader.getFloat(background,'a', true);
	if(backgroundLight[3] > 1 || backgroundLight[3]<0) return "'a' attribute in 'background' must be between 0 and 1.";

}

MySceneGraph.prototype.parseTextures= function(rootElement){
	var texturesElement = rootElement.getElementsByTagName('TEXTURES');
	if (texturesElement == null) return "TEXTURES element is missing.";
	var textureNode = texturesElement[0].getElementsByTagName('TEXTURE');
	var numberTextures = textureNode.length;
	if (numberTextures < 1) return "number of 'TEXTURE' elements in 'TEXTURES' must be at least 1.";

	this.textures = [];
	

	for(var i = 0; i < numberTextures; i++){
		var id = this.reader.getString(textureNode[i], 'id',true);

		var file = textureNode[i].getElementsByTagName('path');
		if (file == null) return "'file' element missing in TEXTURE id = " + id;
		var path = this.reader.getString(file[0], 'path', true);

		var amplifFactor = textureNode[i].getElementsByTagName('amplif_factor');
		if (amplifFactor == null) return "'amplif_factor' element missing in TEXTURE id = " + id;
		var s = this.reader.getString(amplifFactor[0], 's', true);
		var t = this.reader.getString(amplifFactor[0], 't', true);
		textures[1] = new MyTexture(this, path, s, t);
	}

}

/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


