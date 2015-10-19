/**
 * Creates a MySceneGraph, reading a file and opening it.
 * @constructor
 * @param {string} filename - The LSX file that's meant to be parsed.
 * @param scene - The scene
 */
function MySceneGraph(filename, scene) {
    this.loadedOk = null ;
    
    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;
    
    
    
    // File reading 
    this.reader = new CGFXMLreader();
    
    /*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
    
    this.reader.open('scenes/' + filename, this);
}

/*
 * Callback to be executed after successful reading.
 */
MySceneGraph.prototype.onXMLReady = function() 
{
    console.log("LSX Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;
    
    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseInitials(rootElement);
    error = this.parseIllumination(rootElement);
    console.log("Illumination loaded");
    error = this.parseLights(rootElement);
    console.log("Lights loaded");
    error = this.parseTextures(rootElement);
    console.log("Textures loaded");
    error = this.parseMaterials(rootElement);
    console.log("Materials loaded");
    error = this.parseLeaves(rootElement);
    console.log("Leaves loaded");
    error = this.parseNodeList(rootElement);
    console.log("Nodes loaded");
    
    if (error != null ) {
        this.onXMLError(error);
        return;
    }
    
    this.loadedOk = true;
    
    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
}
;

/**
 * Parses the initials tag from the LSX, setting the frustum, initial rotations, scale and reference.
 * @param rootElement - The document element.
 */
MySceneGraph.prototype.parseInitials = function(rootElement) {
    //TODO add console.logs
    var elems = rootElement.getElementsByTagName('INITIALS');
    if (elems == null ) {
        return "initials element is missing in INITIALS.";
    }
    
    if (elems.length != 1) {
        return "either zero or more than one 'INITIALS' element found.";
    }
    
    var initials = elems[0];
    
    var frustum = initials.getElementsByTagName('frustum');
    if (frustum == null )
        return "frustum element missing in INITIALS";
    this.frustum = [];
    this.frustum[0] = this.reader.getFloat(frustum[0], 'near', true);
    this.frustum[1] = this.reader.getFloat(frustum[0], 'far', true);
    
    var translate = initials.getElementsByTagName('translation');
    if (translate == null )
        return "translate element missing in INITIALS";
    this.translate = this.parseTranslation(translate[0]);
    
    var rotation = initials.getElementsByTagName('rotation');
    if (rotation.length != 3)
        return "rotation element in INITIALS not correct. Number of elements 'rotation' must be three.";
    this.rotation = [];
    var rotation1 = this.parseRotation(rotation[0]);
    this.rotation[0] = rotation1;
    var rotation2 = this.parseRotation(rotation[1]);
    this.rotation[1] = rotation2;
    var rotation3 = this.parseRotation(rotation[2]);
    this.rotation[2] = rotation3;
    
    var scale = initials.getElementsByTagName('scale');
    if (scale == null )
        return "translate element missing in INITIALS";
    this.scale = this.parseScale(scale[0]);
    
    var reference = initials.getElementsByTagName('reference');
    if (reference == null )
        return "reference element missing in INITIALS";
    this.reference = this.reader.getFloat(reference[0], 'length', true);
    if(this.reference < 0)
        return "reference value in 'INITIALS' must be at least 0.";

};

/**
 * Parses the illumination tag from the LSX, setting the ambient and background light.
 * @param rootElement - The document element.
 */
MySceneGraph.prototype.parseIllumination = function(rootElement) {
    var illumination = rootElement.getElementsByTagName('ILLUMINATION');
    if (illumination == null )
        return "ILLUMINATION element is missing.";
    if (illumination.length != 1)
        return "either zero or more than one 'ILLUMINATION' element found.";
    
    if (illumination[0].children.length != 2)
        "number of elements in 'ILLUMINATION' different from two.";
    
    
    this.ambientLight = this.parseRGBA(illumination[0], 'ambient', 'ILLUMINATION');
    this.backgroundLight = this.parseRGBA(illumination[0], 'background', 'ILLUMINATION');

}
;

/**
 * Parses the textures tag from the LSX, setting the textures from every node, given their s and t amplification factor.
 * @param rootElement - The document element.
 */
MySceneGraph.prototype.parseTextures = function(rootElement) {
    var texturesElement = rootElement.getElementsByTagName('TEXTURES');
    if (texturesElement == null )
        return this.onXMLError("TEXTURES element is missing.");
    if (texturesElement.length != 1)
        return "either zero or more than one 'TEXTURES' element found.";
    
    var textureNode = texturesElement[0].getElementsByTagName('TEXTURE');
    var numberTextures = textureNode.length;
    if (numberTextures < 1)
        return "number of 'TEXTURE' elements in 'TEXTURES' must be at least 1.";
    
    this.textures = [];
    
    
    for (var i = 0; i < numberTextures; i++) {
        var id = this.reader.getString(textureNode[i], 'id', true);
        
        var file = textureNode[i].getElementsByTagName('file');
        if (file == null )
            return "'file' element missing in TEXTURE id = " + id;
        var path = this.reader.getString(file[0], 'path', true);
        
        var amplifFactor = textureNode[i].getElementsByTagName('amplif_factor');
        if (amplifFactor == null )
            return "'amplif_factor' element missing in TEXTURE id = " + id + ".";
        var s = this.reader.getString(amplifFactor[0], 's', true);
        var t = this.reader.getString(amplifFactor[0], 't', true);
        this.textures[id] = new MyTexture(this.scene,id,path,s,t);
    }

}
;

/**
 * Parses the materials tag from the LSX, setting the materials from every node, given their specular, diffuse, ambient and emission component.
 * @param rootElement - The document element.
 */
MySceneGraph.prototype.parseMaterials = function(rootElement) {
    var materialsElement = rootElement.getElementsByTagName('MATERIALS');
    if (materialsElement == null )
        return onXMLError("MATERIALS element is missing.");
    if (materialsElement.length != 1)
        return "either zero or more than one 'MATERIALS' element found.";
    var materialNode = materialsElement[0].getElementsByTagName('MATERIAL');
    var numberMaterials = materialNode.length;
    if (numberMaterials < 1)
        return this.onXMLError("number of 'MATERIAL' elements in 'MATERIALS' must be at least 1.");
    
    this.materials = [];
    
    for (var i = 0; i < numberMaterials; i++) {
        var id = this.reader.getString(materialNode[i], 'id', true);
        
        var shininessElem = materialNode[i].getElementsByTagName('shininess');
        if (shininessElem == null )
            return this.onXMLError("'shininess' element missing in MATERIAL id = " + id + ".");
        var shininess = this.reader.getFloat(shininessElem[0], 'value', true);
        
        
        var specular = this.parseRGBA(materialNode[i], 'specular', 'MATERIAL');
        var diffuse = this.parseRGBA(materialNode[i], 'diffuse', 'MATERIAL');
        var ambient = this.parseRGBA(materialNode[i], 'ambient', 'MATERIAL');
        var emission = this.parseRGBA(materialNode[i], 'emission', 'MATERIAL');
        
        var newMaterial = new MyMaterial(this.scene,id);
        newMaterial.setShininess(shininess);
        newMaterial.setSpecular(specular[0], specular[1], specular[2], specular[3]);
        newMaterial.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
        newMaterial.setEmission(emission[0], emission[1], emission[2], emission[3]);
        
        this.materials[id] = newMaterial;
    }
}
;

/**
 * Parses the lights tag from the LSX, setting all of the lights present in the scene, given their position and ambient, diffuse and specular component.
 * @param rootElement - The document element.
 */
MySceneGraph.prototype.parseLights = function(rootElement) {
    var lightElement = rootElement.getElementsByTagName('LIGHTS');
    if (lightElement == null )
        return "LIGHTS element is missing.";
    if (lightElement.length != 1)
        return "either zero or more than one 'LIGHTS' element found.";
    
    var lightNode = lightElement[0].getElementsByTagName('LIGHT');
    var numberLights = lightNode.length;
    if (numberLights < 1)
        return "number of 'LIGHT' elements in 'LIGHTS' must be at least 1.";
    
    this.lights = [];
    for (var i = 0; i < numberLights; i++) {
        var id = lightNode[i].id;
        
        var enableElem = lightNode[i].getElementsByTagName("enable");
        if (enableElem == null )
            return "'enable' element inside LIGHT id = " + id + " missing.";
        var enable = this.reader.getBoolean(enableElem[0], 'value', true);
        
        var position = this.parseLightPosition(lightNode[i], 'position', 'LIGHT');
        var ambient = this.parseRGBA(lightNode[i], 'ambient', 'LIGHT');
        var diffuse = this.parseRGBA(lightNode[i], 'diffuse', 'LIGHT');
        var specular = this.parseRGBA(lightNode[i], 'specular', 'LIGHT');
        
        this.lights[i] = new MyLight(this.scene,i,id);        
        if (enable)
            this.lights[i].enable();
        else
            this.lights[i].disable();
        
        this.lights[i].setPosition(position[0], position[1], position[2], position[3]);
        this.lights[i].setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
        this.lights[i].setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
        this.lights[i].setSpecular(specular[0], specular[1], specular[2], specular[3]);
        console.log("Light id="+this.lights[i]+" parsed");
    }
}
;

/**
 * Parses the leaves tag from the LSX, setting all of the existing primitives, in this case, the rectangle, cylinder, sphere and triangle.
 * @param rootElement - The document element.
 * @return leaf - Calls a function to parse the leaf (rectangle, cylinder, sphere or triangle).
 */
MySceneGraph.prototype.parseLeaves = function(rootElement) {
    var leavesElement = rootElement.getElementsByTagName('LEAVES');
    if (leavesElement == null )
        return "LEAVES element is missing.";
    if (leavesElement.length != 1)
        return "either zero or more than one 'LEAVES' element found.";
    
    var leafNode = leavesElement[0].getElementsByTagName('LEAF');
    var numberLeaves = leafNode.length;
    if (numberLeaves < 1)
        return "number of 'LEAF' elements in 'LEAVES' must be at least 1.";
    
    this.leaves = [];
    
    for (var i = 0; i < numberLeaves; i++) {
        var id = leafNode[i].id;
        var type = this.reader.getString(leafNode[i], 'type', true);
        switch (type) {
        case 'rectangle':
            this.leaves[id] = this.parseRectangle(leafNode[i]);
            break;
        case 'cylinder':
            this.leaves[id] = this.parseCylinder(leafNode[i]);
            break;
        case 'sphere':
            this.leaves[id] = this.parseSphere(leafNode[i]);
            break;
        case 'triangle':
            this.leaves[id] = this.parseTriangle(leafNode[i]);
            break;
        default:
            return "invalid 'type' element in 'LEAF' id= " + id + ".";
        }
        console.log("'LEAF' id=" + id + " loaded.");
    }
}
;

/**
 * Parses the nodes tag from the LSX, setting a list with nodes, starting on the root.
 * @param rootElement - The document element.
 */
MySceneGraph.prototype.parseNodeList = function(rootElement) {
    var nodesElement = rootElement.getElementsByTagName('NODES');
    if (nodesElement == null )
        return "'NODES' element  is missing.";
    if (nodesElement.length != 1)
        return "either zero or more than one 'NODES' element found.";
    
    var rootNode = nodesElement[0].getElementsByTagName('ROOT');
    if (rootNode == null )
        return ( "'ROOT' element in 'NODES' missing.") ;
    this.rootID = this.reader.getString(rootNode[0], 'id', true);
    
    var nodeList = nodesElement[0].getElementsByTagName('NODE');
    if (nodeList.length < 1)
        return this.onXMLError("There needs to be at least 1 'NODE' element inside 'NODES'.");
    
    this.nodes = [];
    
    for (var i = 0; i < nodeList.length; i++) {
        this.nodes[nodeList[i].id] = this.parseNode(nodeList[i]);
    }
    
    if (this.nodes[this.rootID] == null )
        return "'ROOT' id =" + rootNodeID + " doesn't exist as 'NODE' element.";
}
;

/**
 * Parses a single node and their descendants.
 * @param {MyNode} node - The current parsing node
 * @return {MyNode} MyNode - The next node to be parsed
 */
MySceneGraph.prototype.parseNode = function(node) {
    if (this.leaves[node.id] != null )
        return this.onXMLError("'NODE' id =" + node.id + " already exists as a 'LEAF'.");
    
    var material = this.parseNodeMaterial(node);
    var texture = this.parseNodeTexture(node);
    var i = 2;
    var transformations = [];
    while (node.children[i].tagName != 'DESCENDANTS' && i < node.children.length) {
        transformations[i - 2] = this.parseTransformation(node.children[i]);
        i++;
    }
    
    var descendantsElement = node.getElementsByTagName('DESCENDANTS');
    if (descendantsElement == null )
        return this.onXMLError("'DESCENDANTS' element inside 'NODE' id =" + node.id + " missing.");
    var descendElem = descendantsElement[0].getElementsByTagName('DESCENDANT');
    if (descendElem.length < 1)
        return this.onXMLError("Error in 'NODE' id =" + node.id + ". Number of 'DESCENDANT' inside 'DESCENDANTS' needs to be at least 1.");
    
    var descendants = [];
    for (var j = 0; j < descendElem.length; j++) {
        descendants[j] = descendElem[j].id;
    }
    
    return new MyNode(this.scene,node.id,material,texture,transformations,descendants);
}
;

/**
 * Parses the material the node has.
 * @param {MyNode} node - The current parsing node
 * @return material - The material already parsed
 */
MySceneGraph.prototype.parseNodeMaterial = function(node) {
    var materialElement = node.getElementsByTagName('MATERIAL');
    if (materialElement == null )
        return this.onXMLError("'MATERIAL' element missing in 'NODE' id= " + node.id);
    
    switch (materialElement[0].id) {
    case "null":
        return null ;
        break;
    default:
        var material = this.materials[materialElement[0].id];
        if (material == null )
            return this.onXMLError("'MATERIAL' id =" + materialElement[0].id + "referenced in 'NODE' id= " + node.id + " doesn't exist in 'MATERIALS'");
        return material;
        break;
    }
}
;

/**
 * Parses the texture the node has.
 * @param {MyNode} node - The current parsing node
 * @return texture - The texture already parsed
 */
MySceneGraph.prototype.parseNodeTexture = function(node) {
    var textureElement = node.getElementsByTagName('TEXTURE');
    if (textureElement == null )
        return this.onXMLError("'TEXTURE' element missing in 'NODE' id= " + node.id);
    
    switch (textureElement[0].id) {
    case "clear":
        return "clear";
        break;
    case "null":
        return null ;
        break;
    default:
        var texture = this.textures[textureElement[0].id];
        if (texture == null )
            return this.onXMLError("'TEXTURE' id =" + textureElement.id + "referenced in 'NODE' id= " + node.id + " doesn't exist in 'TEXTURES'");
        return texture;
        break;
    }
}
;

/**
 * Parses the leaf rectangle.
 * @param {MyNode} node - The current parsing node
 * @return MyRectangle
 */
MySceneGraph.prototype.parseRectangle = function(node) {
    var args = this.reader.getString(node, 'args', true);
    var coords = args.split(" ");
    if (coords.length != 4)
        return this.onXMLError("number of arguments different of 4 in element args in 'LEAF' id= " + node.id);
    return new MyRectangle(this.scene,parseFloat(coords[0]),parseFloat(coords[1]),parseFloat(coords[2]),parseFloat(coords[3]));
}
;

/**
 * Parses the leaf triangle.
 * @param {MyNode} node - The current parsing node
 * @return MyTriangle
 */
MySceneGraph.prototype.parseTriangle = function(node) {
    var args = this.reader.getString(node, 'args', true);
    var coords = args.split(" ");
    if (coords.length != 9)
        return this.onXMLError("number of arguments different of 9 in element args in 'LEAF' id= " + node.id);
    return new MyTriangle(this.scene,parseFloat(coords[0]),parseFloat(coords[1]),parseFloat(coords[2]),parseFloat(coords[3]),parseFloat(coords[4]),parseFloat(coords[5]),parseFloat(coords[6]),parseFloat(coords[7]),parseFloat(coords[8]));
}
;

/**
 * Parses the leaf cylinder.
 * @param {MyNode} node - The current parsing node
 * @return MyCylinder
 */
MySceneGraph.prototype.parseCylinder = function(node) {
    var args = this.reader.getString(node, 'args', true);
    var coords = args.split(" ");
    if (coords.length != 5)
        return this.onXMLError("number of arguments different of 5 in element args in 'LEAF' id= " + node.id);
    return new MyCylinder(this.scene,parseFloat(coords[0]),parseFloat(coords[1]),parseFloat(coords[2]),parseInt(coords[3]),parseInt(coords[4]));
}
;

/**
 * Parses the leaf cylinder.
 * @param {MyNode} node - The current parsing node
 * @return MySphere
 */
MySceneGraph.prototype.parseSphere = function(node) {
    var args = this.reader.getString(node, 'args', true);
    var coords = args.split(" ");
    if (coords.length != 3)
        return this.onXMLError("number of arguments different of 3 in element args in 'LEAF' id= " + node.id);
    return new MySphere(this.scene,parseFloat(coords[0]),parseInt(coords[1]),parseInt(coords[2]));
}
;

/**
 * Parses a transformation.
 * @param transformation - The transformation to be applied, which can be a rotation, translation or scale.
 */
MySceneGraph.prototype.parseTransformation = function(transformation) {
    switch (transformation.tagName) {
    case 'TRANSLATION':
        return this.parseTranslation(transformation);
    case 'ROTATION':
        return this.parseRotation(transformation);
    case 'SCALE':
        return this.parseScale(transformation);
    default:
        return this.onXMLError('Tag ' + transformation.tagName + 'not accepted in here');
        break;
    }
}
;

/**
 * Parses a translation.
 * @param {MyNode} node - The current parsing node
 * @return MyTranslation
 */
MySceneGraph.prototype.parseTranslation = function(node) {
    var x = this.reader.getFloat(node, 'x', true);
    var y = this.reader.getFloat(node, 'y', true);
    var z = this.reader.getFloat(node, 'z', true);
    return new MyTranslation(this.scene,x,y,z);
}
;

/**
 * Parses a rotation.
 * @param {MyNode} node - The current parsing node
 * @return MyRotation
 */
MySceneGraph.prototype.parseRotation = function(node) {
    var axis = this.reader.getString(node, 'axis', true);
    var angle = this.reader.getFloat(node, 'angle', true);
    return new MyRotation(this.scene,axis,angle);
}
;

/**
 * Parses a scaling.
 * @param {MyNode} node - The current parsing node
 * @return MyScale
 */
MySceneGraph.prototype.parseScale = function(node) {
    var sx = this.reader.getFloat(node, 'sx', true);
    var sy = this.reader.getFloat(node, 'sy', true);
    var sz = this.reader.getFloat(node, 'sz', true);
    return new MyScale(this.scene,sx,sy,sz);
}
;

/**
 * Parses the position on all of the lights.
 * @param {MyNode} node - The current parsing node
 * @param element - The tag
 * @param {string} nodeName - The name of the node
 */
MySceneGraph.prototype.parseLightPosition = function(node, element, nodeName) {
    var element = node.getElementsByTagName(element);
    if (element == null )
        return this.onXMLError("'" + element + "' element missing in " + nodeName + " id = " + node.id);
    var position = [];
    
    position[0] = this.reader.getFloat(element[0], 'x', true);
    position[1] = this.reader.getFloat(element[0], 'y', true);    
    position[2] = this.reader.getFloat(element[0], 'z', true);    
    position[3] = this.reader.getFloat(element[0], 'w', true);
    
    return position;
}
;

/**
 * Parses the RGB component.
 * @param {MyNode} node - The current parsing node
 * @param element - The tag
 * @param {string} nodeName - The name of the node
 */
MySceneGraph.prototype.parseRGBA = function(node, element, nodeName) {
    var element = node.getElementsByTagName(element);
    if (element == null )
        return this.onXMLError("'" + element + "' element missing in " + nodeName + " id = " + node.id);
    var rgba = [];
    
    rgba[0] = this.reader.getFloat(element[0], 'r', true);
    if (rgba[0] > 1 || rgba[0] < 0)
        return this.onXMLError("'r' attribute in '" + element + "' must be between 0 and 1.");
    
    rgba[1] = this.reader.getFloat(element[0], 'g', true);
    if (rgba[1] > 1 || rgba[1] < 0)
        return this.onXMLError("'g' attribute in '" + element + "' must be between 0 and 1.");
    
    rgba[2] = this.reader.getFloat(element[0], 'b', true);
    if (rgba[2] > 1 || rgba[2] < 0)
        return this.onXMLError("'b' attribute in '" + element + "' must be between 0 and 1.");
    
    rgba[3] = this.reader.getFloat(element[0], 'a', true);
    if (rgba[3] > 1 || rgba[3] < 0)
        return this.onXMLError("'a' attribute in '" + element + "' must be between 0 and 1.");
    
    return rgba;
}
;

/*
 * Callback to be executed on any read error
 * @param {string} message - The error message to be displayed
 */
MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
}
;
