
define(['jquery','fss'], function ($, FSS) {
	'use strict';

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


	//------------------------------
	// Mesh Properties
	//------------------------------
	var MESH = {
		width: 0.11,
		height: 1.2,
		depth: 10,
		segments: 3,
		slices: 4,
		xRange: 0.88,
		yRange: 0.3,
		zRange: 1.0,
		ambient: '#777777',
		diffuse: '#888888',
		speed: 0.0003
	};

	//------------------------------
	// Light Properties
	//------------------------------
	var LIGHT = {
		count: 2,
		xyScalar: 1,
		zOffset: 100,
		ambient: '#c2c0c7',
		diffuse: '#bbbdc4',
		speed: 0.001,
		gravity: 1200,
		dampening: 0.95,
		minLimit: 10,
		maxLimit: null,
		minDistance: 20,
		maxDistance: 400,
		autopilot: true,
		draw: true,
		bounds: FSS.Vector3.create(),
		step: FSS.Vector3.create(
		  Math.randomInRange(0.2, 1.0),
		  Math.randomInRange(0.2, 1.0),
		  Math.randomInRange(0.2, 1.0)
		)
	};

	//------------------------------
	// Render Properties
	//------------------------------
	var WEBGL = 'webgl';
	var CANVAS = 'canvas';
	var SVG = 'svg';

	//constructor
	function PolygonMeshBar(__opt){
		this._mesh = $.extend({}, MESH, __opt.mesh);
		this._light = $.extend({}, LIGHT, __opt.light);
		this._timer = null;
		this._now;
		this._start = Date.now();
		this._center = FSS.Vector3.create();
		this._attractor = FSS.Vector3.create();

		this._container = __opt.container;
		this._output = __opt.output;

		this._curRenderer = CANVAS;
		this._renderer;
		this._fssMesh;
		this._scene;
		this._geometry;
		this._material;
		this._webglRenderer;
		this._canvasRenderer;
		this._svgRenderer;
		this._doStart = false;

	};

	//private method
	PolygonMeshBar.prototype._createRenderer = function(){
    	if (this._renderer) {
      		this._output.removeChild(this._renderer.element);
    	}

    	// this._canvasRenderer = new FSS.CanvasRenderer();
    	// this._canvasRenderer = new FSS.WebGLRenderer();
    	// this._renderer = this._canvasRenderer;
    	
    	this._svgRenderer = new FSS.SVGRenderer();
    	this._renderer = this._svgRenderer;

    	//this._renderer.setSize(this._container.offsetWidth, this._container.offsetHeight);
    	//this._output.appendChild(this._renderer.element);

    	
	};

	PolygonMeshBar.prototype._createScene = function(){
		this._scene = new FSS.Scene();
	};

	PolygonMeshBar.prototype._update = function(){
		var ox, oy, oz, l, light, v, vertex, offset = this._mesh.depth/2;

	    // Update Bounds
	    FSS.Vector3.copy(this._light.bounds, this._center);
	    FSS.Vector3.multiplyScalar(this._light.bounds, this._light.xyScalar);

	    // Update Attractor
	    FSS.Vector3.setZ(this._attractor, this._light.zOffset);

	    // Overwrite the Attractor position
	    if (this._light.autopilot) {
	      ox = Math.sin(this._light.step[0] * this._now * this._light.speed);
	      oy = Math.cos(this._light.step[1] * this._now * this._light.speed);
	      FSS.Vector3.set(this._attractor,
	        this._light.bounds[0]*ox,
	        this._light.bounds[1]*oy,
	        this._light.zOffset);
	    }

	    // Animate Lights

	    for (l = this._scene.lights.length - 1; l >= 0; l--) {
	      light = this._scene.lights[l];

	      // Reset the z position of the light
	      FSS.Vector3.setZ(light.position, this._light.zOffset);

	      // Calculate the force Luke!
	      var D = Math.clamp(FSS.Vector3.distanceSquared(light.position, this._attractor), this._light.minDistance, this._light.maxDistance);
	      var F = this._light.gravity * light.mass / D;
	      FSS.Vector3.subtractVectors(light.force, this._attractor, light.position);
	      FSS.Vector3.normalise(light.force);
	      FSS.Vector3.multiplyScalar(light.force, F);

	      // Update the light position
	      FSS.Vector3.set(light.acceleration);
	      FSS.Vector3.add(light.acceleration, light.force);
	      FSS.Vector3.add(light.velocity, light.acceleration);
	      FSS.Vector3.multiplyScalar(light.velocity, this._light.dampening);
	      FSS.Vector3.limit(light.velocity, this._light.minLimit, this._light.maxLimit);
	      FSS.Vector3.add(light.position, light.velocity);
	    }


	    // Animate Vertices
	    for (v = this._geometry.vertices.length - 1; v >= 0; v--) {
	      vertex = this._geometry.vertices[v];
	      ox = Math.sin(vertex.time + vertex.step[0] * this._now * this._mesh.speed);
	      oy = Math.cos(vertex.time + vertex.step[1] * this._now * this._mesh.speed);
	      oz = Math.sin(vertex.time + vertex.step[2] * this._now * this._mesh.speed);

	      FSS.Vector3.set(vertex.position,
	        this._mesh.xRange*this._geometry.segmentWidth*ox,
	        this._mesh.yRange*this._geometry.sliceHeight*oy,
	        this._mesh.zRange*offset*oz - offset);
	      FSS.Vector3.add(vertex.position, vertex.anchor);
	    }

	    // Set the Geometry to dirty
	    this._geometry.dirty = true;
	};

	PolygonMeshBar.prototype._render = function(){
		this._renderer.render(this._scene);

    	// Draw Lights
    	if (this._light.draw) {
	      	var l, lx, ly, light;
		    for (l = this._scene.lights.length - 1; l >= 0; l--) {
		        light = this._scene.lights[l];
		        lx = light.position[0];
		        ly = light.position[1];
		        switch(this._curRenderer) {
		          case CANVAS:
		          /*
		            this._renderer.context.lineWidth = 0.5;
		            this._renderer.context.beginPath();
		            this._renderer.context.arc(lx, ly, 10, 0, Math.PIM2);
		            this._renderer.context.strokeStyle = light.ambientHex;
		            this._renderer.context.stroke();
		            this._renderer.context.beginPath();
		            this._renderer.context.arc(lx, ly, 4, 0, Math.PIM2);
		            this._renderer.context.fillStyle = light.diffuseHex;
		            this._renderer.context.fill();
		            */
		          break;

		          case SVG:
		           /*
		            lx += this._renderer.halfWidth;
		            ly = this._renderer.halfHeight - ly;
		            light.core.setAttributeNS(null, 'fill', light.diffuseHex);
		            light.core.setAttributeNS(null, 'cx', lx);
		            light.core.setAttributeNS(null, 'cy', ly);
		            this._renderer.element.appendChild(light.core);
		            light.ring.setAttributeNS(null, 'stroke', light.ambientHex);
		            light.ring.setAttributeNS(null, 'cx', lx);
		            light.ring.setAttributeNS(null, 'cy', ly);
		            this._renderer.element.appendChild(light.ring);
		            */
		          break;
		        }
		   	}
	    }
	};

	PolygonMeshBar.prototype._onResize = function(){
		var that = this;
		this.resize(that._container.offsetWidth, that._container.offsetHeight);
    	this._render();
	};

	PolygonMeshBar.prototype._addEventListeners = function(){
		this._removeEventListeners();
		window.addEventListener('resize', this._onResize.bind(this));
	};

	PolygonMeshBar.prototype._removeEventListeners = function(){
		window.removeEventListener('resize', this._onResize.bind(this));
	};


	//public method
	PolygonMeshBar.prototype.init = function(__doAnimation){
		if(this._doStart) return false;

		var that = this;
		this._createRenderer();
		this._createScene();
		if(this._container===null || this._output===null){
    	}else{
    		this.setupContainer( {container:this._container, output:this._output} );
    	}
	    
	    this.createMesh();
	    this.createLights();

	    this._addEventListeners();

	    this.resize(this._container.offsetWidth, this._container.offsetHeight);
	    this._render();
	    this._doStart = true;

	    if(__doAnimation===false){}else{
	    	//this.animate();
	    	//this._timer = requestAnimationFrame(this.animate.bind(this));
	    }

	};

	PolygonMeshBar.prototype.resize = function(__wid, __hei){
		this._renderer.setSize(__wid, __hei);
    	FSS.Vector3.set(this._center, this._renderer.halfWidth, this._renderer.halfHeight);
    	this.createMesh();
	};


	PolygonMeshBar.prototype.setupContainer = function(__opt){
    	if(__opt.container) this._container = __opt.container;
		if(__opt.output) this._output = __opt.output;
		$(this._output).html('');
    	this._renderer.setSize(this._container.offsetWidth, this._container.offsetHeight);
    	$(this._output).append(this._renderer.element);
	};


	PolygonMeshBar.prototype.createMesh = function(__opt){
		if(__opt && __opt.mesh) {
			this._mesh = $.extend({}, MESH, __opt.mesh);
			MESH = this._mesh;
		}else{
			this._mesh = $.extend({}, MESH);
		}

		if(this._fssMesh) this._scene.remove(this._fssMesh);
	    if(this._renderer) this._renderer.clear();
	    this._geometry = new FSS.Plane(this._mesh.width * this._renderer.width, this._mesh.height * this._renderer.height, this._mesh.segments, this._mesh.slices);
	    this._material = new FSS.Material(this._mesh.ambient, this._mesh.diffuse);
	    this._fssMesh = new FSS.Mesh(this._geometry, this._material);
	    this._scene.add(this._fssMesh);

	    // Augment vertices for animation
	    var v, vertex;
	    for (v = this._geometry.vertices.length - 1; v >= 0; v--) {
	      vertex = this._geometry.vertices[v];
	      vertex.anchor = FSS.Vector3.clone(vertex.position);
	      vertex.step = FSS.Vector3.create(
	        Math.randomInRange(0.2, 1.0),
	        Math.randomInRange(0.2, 1.0),
	        Math.randomInRange(0.2, 1.0)
	      );
	      vertex.time = Math.randomInRange(0, Math.PIM2);
	    }
	};


	PolygonMeshBar.prototype.createLights = function(__opt){
		if(__opt && __opt.light) {
			this._light = $.extend({}, LIGHT, __opt.light);
			LIGHT = this._light
		}else{
			this._light = $.extend({}, LIGHT);
		}

		var l, light;
	    for (l = this._scene.lights.length - 1; l >= 0; l--) {
	      light = this._scene.lights[l];
	      this._scene.remove(light);
	    }
	    this._renderer.clear();
	    for (l = 0; l < this._light.count; l++) {
	      light = new FSS.Light(this._light.ambient, this._light.diffuse);
	      light.ambientHex = light.ambient.format();
	      light.diffuseHex = light.diffuse.format();
	      this._scene.add(light);

	      // Augment light for animation
	      light.mass = Math.randomInRange(0.5, 1);
	      light.velocity = FSS.Vector3.create();
	      light.acceleration = FSS.Vector3.create();
	      light.force = FSS.Vector3.create();
	    }
	};

	PolygonMeshBar.prototype.updateRender = function(){
		this._now = Date.now() - this._start;
    	this._update();
    	this._render();
	};

	PolygonMeshBar.prototype.animate = function(){
		//console.log('PolygonMeshBar animate');
		this.updateRender();
    	this._timer = requestAnimationFrame(this.animate.bind(this));
    	return this._timer;
	};

	PolygonMeshBar.prototype.stopAnimate = function(){
		var t = this._timer;
		cancelAnimationFrame(t);
	};

	PolygonMeshBar.prototype.clear = function(){
		if (this._renderer) {
      		this._output.removeChild(this._renderer.element);
    	}
	};

	PolygonMeshBar.prototype.destroy = function(){
		this.stopAnimate();
		this._removeEventListeners();
		this.clear();
		this._renderer = null;
		this._scene = null;
		this._center = null;
		this._attractor = null;
		this._mesh = null;
		this._light = null;
		this._fssMesh = null;
		this._geometry = null;
		this._material = null;
		this._canvasRenderer = null;
	};

	


	return PolygonMeshBar;
});
