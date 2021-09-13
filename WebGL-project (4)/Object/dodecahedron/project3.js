"use strict";

// Program
var canvas;
var gl;
var numVertices = 108;
var program;

// Buttons
var flag = true;
var direction = true;
var perspec = false;
var shading = false;
var texture = false;

// Sliders
var sliderTX;
var sliderTY;
var sliderTZ;
var sliderScale;

// Arrays
var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

// Matrices
var modelViewMatrix;
var projectionMatrix;

//Camera
var eyeX;
var eyeY;
var eyeZ;
var ctrX;
var ctrY;
var ctrZ;
var upX;
var upY;
var upZ;

// Orthogonal
var left = -1.0;
var right = 1.0;
var bottom = -1.0;
var ytop = 1.0;
var near;
var far;

// Perspective
var fovy = 100.0;
var aspect = 1.0;

// Axis
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

// Cube Angle
var theta = [45.0, 45.0, 45.0];
var rotationSpeed = 0.001;
var controlsRotate;
// Lights
var ambientColor, diffuseColor, specularColor;
var lightX;
var lightY;
var lightZ;

// Lights
var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

// Materials
var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 1.0;

//texture
var texSize = 256;
var numChecks = 6;
var texture1, texture2;
var c;

var image1 = new Uint8Array(4*texSize*texSize);
for ( var i = 0; i < texSize; i++ ) {
    for ( var j = 0; j <texSize; j++ ) {
        var patchx = Math.floor(i/(texSize/numChecks));
        var patchy = Math.floor(j/(texSize/numChecks));
        if(patchx%2 ^ patchy%2) c = 255;
        else c = 0;
        //c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0))
        image1[4*i*texSize+4*j] = c;
        image1[4*i*texSize+4*j+1] = c;
        image1[4*i*texSize+4*j+2] = c;
        image1[4*i*texSize+4*j+3] = 255;
    }
}
var image2 = new Uint8Array(4*texSize*texSize);

for ( var i = 0; i < texSize; i++ ) {
  for ( var j = 0; j <texSize; j++ ) {
    c = 200-j/2;//127+127*Math.sin(0.1*i*j);
    image2[4*i*texSize+4*j] = c;
    image2[4*i*texSize+4*j+1] = c;
    image2[4*i*texSize+4*j+2] = c;
    image2[4*i*texSize+4*j+3] = 255;
  }
}

const t = 1.6;
const r = 1 / t;

var tvertices = [
    vec4(-1.0, -1.0, -1.0, 1.0),
    vec4(-1.0, -1.0, 1.0, 1.0),
    vec4(-1.0, 1.0, -1.0, 1.0),
    vec4(-1.0, 1.0, 1.0, 1.0),

    vec4(1.0, -1.0, -1.0, 1.0),
    vec4(1.0, -1.0, 1.0, 1.0),
    vec4(1.0, 1.0, -1.0, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0),

    vec4(0.0, -r, -t, 1.0),
    vec4(0.0, -r, t, 1.0),
    vec4(0.0, r, -t, 1.0),
    vec4(0.0, r, t, 1.0),

    vec4(-r, -t, 0.0, 1.0),
    vec4(-r, t, 0.0, 1.0),
    vec4(r, -t, 0.0, 1.0),
    vec4(r, t, 0.0, 1.0),


    vec4(-t, 0.0, -r, 1.0),
    vec4(t, 0.0, -r, 1.0),
    vec4(-t, 0.0, r, 1.0),
    vec4(t, 0.0, r, 1.0)

];

var tvertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0) // magenta	

];

var texCoordsArray = [];

var texCoord = [
  vec2(100, 100),
  vec2(-100, 100),
  vec2(-100, -100),
  vec2(100, -100)
];

function tquad(a, b, c) {
    var t1 = subtract(tvertices[b], tvertices[a]);
    var t2 = subtract(tvertices[c], tvertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);

    pointsArray.push(tvertices[a]);
    colorsArray.push(tvertexColors[a]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[0]);

    pointsArray.push(tvertices[b]);
    colorsArray.push(tvertexColors[a]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[1]);

    pointsArray.push(tvertices[c]);
    colorsArray.push(tvertexColors[a]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[2]);

}

function colorDode() {
    tquad(3, 11, 7); // bottom
    tquad(3, 7, 15); // side0
    tquad(3, 15, 13); // side1

    tquad(7, 19, 17); // side3
    tquad(7, 17, 6); // bottom
    tquad(7, 6, 15); // side0


    tquad(17, 4, 8); // side1
    tquad(17, 8, 10); // side3
    tquad(17, 10, 6); // side3

    tquad(8, 0, 16); // side3
    tquad(8, 16, 2); // bottom
    tquad(8, 2, 10); // side0


    tquad(0, 12, 1); // side1
    tquad(0, 1, 18); // side3
    tquad(0, 18, 16); // side3


    tquad(6, 10, 2); // bottom
    tquad(6, 2, 13); // side0
    tquad(6, 13, 15); // side1

    tquad(2, 16, 18); // bottom
    tquad(2, 18, 3); // side0
    tquad(2, 3, 13); // side1

    tquad(18, 1, 9); // bottom
    tquad(18, 9, 11); // side0
    tquad(18, 11, 3); // side1

    tquad(4, 14, 12); // bottom
    tquad(4, 12, 0); // side0
    tquad(4, 0, 8); // side1

    tquad(11, 9, 5); // bottom
    tquad(11, 5, 19); // side0
    tquad(11, 19, 7); // side1

    tquad(19, 5, 14); // bottom
    tquad(19, 14, 4); // side0
    tquad(19, 4, 17); // side1

    tquad(1, 12, 14); // bottom
    tquad(1, 14, 5); // side0
    tquad(1, 5, 9); // side1
}

// Configure Texture
function configureTexture() {
  texture1 = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, texture1 );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image1);
  gl.generateMipmap( gl.TEXTURE_2D );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl. REPEAT); 
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl. REPEAT);

  texture2 = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, texture2 );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
  gl.generateMipmap( gl.TEXTURE_2D );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl. REPEAT); 
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl. REPEAT);
  
}

function init3() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders3(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    colorDode();

    // Color
     var cBuffer = gl.createBuffer();
     gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
     gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
     var vColor = gl.getAttribLocation( program, "vColor" );
     gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // Shape
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Normal
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    // Light
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
	
	//Texture
	var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
	gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vTexCoord );
	
	configureTexture();

	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, texture1 );
	gl.uniform1i(gl.getUniformLocation( program, "texture1"), 0);

	gl.activeTexture( gl.TEXTURE1 );
	gl.bindTexture( gl.TEXTURE_2D, texture2 );
	gl.uniform1i(gl.getUniformLocation( program, "texture2"), 1);

    // Buttons
    document.getElementById("ButtonX").onclick = function() {
        axis = xAxis;
    };
    document.getElementById("ButtonY").onclick = function() {
        axis = yAxis;
    };
    document.getElementById("ButtonZ").onclick = function() {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function() {
        flag = !flag;
    };
    document.getElementById("ButtonP").onclick = function() {
        perspec = !perspec;
    };
    document.getElementById("ButtonC").onclick = function() {
        direction = !direction;
    };
    document.getElementById("ButtonS").onclick = function() {
        shading = !shading;
    };
	document.getElementById("ButtonTex").onclick = function() {
        texture = !texture;
    };

    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

    render3();

    function resizeCanvasToDisplaySize(canvas) {
        // Lookup the size the browser is displaying the canvas in CSS pixels.
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        // Check if the canvas is not the same size.
        const needResize = canvas.width !== displayWidth ||
            canvas.height !== displayHeight;

        if (needResize) {
            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }

        return needResize;
    }
}

var render3 = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let timeOld = 0;


		const animate = function(time) {


        gl.uniform1f(gl.getUniformLocation(program, "shading"), shading);
		gl.uniform1f(gl.getUniformLocation(program, "texture"), texture);

	//eyeX
		eyeX = parseFloat(document.getElementById("eyeX").value).toFixed(1);
        document.getElementById("ValueeyeX").innerHTML = eyeX;
		eyeY = parseFloat(document.getElementById("eyeY").value).toFixed(1);
        document.getElementById("ValueeyeY").innerHTML = eyeY;
		eyeZ = parseFloat(document.getElementById("eyeZ").value).toFixed(1);
        document.getElementById("ValueeyeZ").innerHTML = eyeZ;
		
		ctrX = parseFloat(document.getElementById("ctrX").value).toFixed(1);
        document.getElementById("ValuectrX").innerHTML = ctrX;
		ctrY = parseFloat(document.getElementById("ctrY").value).toFixed(1);
        document.getElementById("ValuectrY").innerHTML = ctrY;
		ctrZ = parseFloat(document.getElementById("ctrZ").value).toFixed(1);
        document.getElementById("ValuectrZ").innerHTML = ctrZ;
		
		upX = parseFloat(document.getElementById("upX").value).toFixed(1);
        document.getElementById("ValueupX").innerHTML = upX;
		upY = parseFloat(document.getElementById("upY").value).toFixed(1);
        document.getElementById("ValueupY").innerHTML = upY;
		upZ = parseFloat(document.getElementById("upZ").value).toFixed(1);
        document.getElementById("ValueupZ").innerHTML = upZ;
		
		var eye = vec3(eyeX, eyeY,eyeZ);
		const at = vec3(ctrX, ctrY, ctrZ);
		const up = vec3(upX, upY,upZ);
		
        // Translade slider
        sliderTX = parseFloat(document.getElementById("SliderTX").value).toFixed(1);
        document.getElementById("ValueTX").innerHTML = sliderTX;
        sliderTY = parseFloat(document.getElementById("SliderTY").value).toFixed(1);
        document.getElementById("ValueTY").innerHTML = sliderTY;
        sliderTZ = parseFloat(document.getElementById("SliderTZ").value).toFixed(1);
        document.getElementById("ValueTZ").innerHTML = sliderTZ;
        sliderScale = parseFloat(document.getElementById("SliderScale").value);
        document.getElementById("ValueScale").innerHTML = sliderScale;
        near = parseFloat(document.getElementById("SliderPN").value);
        document.getElementById("ValuePN").innerHTML = near;
        far = parseFloat(document.getElementById("SliderPF").value);
        document.getElementById("ValuePF").innerHTML = far;
        controlsRotate = parseFloat(document.getElementById("rotc").value).toFixed(2);
        document.getElementById("ValueRot").innerHTML = controlsRotate;
        // Light
        lightX = parseFloat(document.getElementById("LightX").value).toFixed(1);
        document.getElementById("ValueLX").innerHTML = lightX;
        lightY = parseFloat(document.getElementById("LightY").value).toFixed(1);
        document.getElementById("ValueLY").innerHTML = lightY;
        lightZ = parseFloat(document.getElementById("LightZ").value).toFixed(1);
        document.getElementById("ValueLZ").innerHTML = lightZ;
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(vec4(lightX, lightY, lightZ, 0.0)));
        const dAngle = controlsRotate * (time - timeOld);
        if (flag) {
            if (direction)
                theta[axis] += dAngle;
            else
                theta[axis] -= dAngle;
        }

        timeOld = time;

        // Model matrix
        modelViewMatrix = lookAt(eye, at, up);
		  modelViewMatrix = mult(modelViewMatrix, scalem(0.5, 0.5, 0.5));
        modelViewMatrix = mult(modelViewMatrix, scalem(sliderScale, sliderScale, sliderScale));
        modelViewMatrix = mult(modelViewMatrix, translate(sliderTX, sliderTY, sliderTZ));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0]));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0]));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1]));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));

        // Orthogonal or Perspective
        if (perspec)
            projectionMatrix = perspective(fovy, aspect, near, far);
        else
            projectionMatrix = ortho(left, right, bottom, ytop, near, far);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
        requestAnimationFrame(animate);
    };
    animate(0);
}