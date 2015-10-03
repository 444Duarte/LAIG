
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
	if (reference == null) return 'reference element missing'
	this.reference = this.reader.getFloat(reference,'length', true);	

};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


