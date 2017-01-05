define([], function () {
	'use strict';

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	var DotLine={};
	
	var canvas, context, rect, canvasWidth, canvasHeight;
	var FPS = 30,
	    BALLS = 150,
	    MAX_DIST = 200,
	    MIN_DIST = 200;

	var viewScale = 1;
	var points = [];
	var viewPoint = { x: 0, y: 0};
	var timer = null;

	var distance = function(p, q) {
		    var a = p.x - q.x,
		        b = p.y - q.y;
		    return Math.sqrt(a * a + b * b);
		},
		direction = function(p, q) {
		    var a = q.x - p.x,
		        b = q.y - p.y;
		    return Math.atan2(b, a);
		};



	DotLine.init = function(__canvas){
		var point, i;
		canvas = __canvas;
	    context = canvas.getContext('2d');
	    DotLine.setWidHei();
	    if(points.length<1){
	    	for (i = 0; i < BALLS; i++) {
		        point = new Point(Math.random() * canvasWidth * 0.1 + MIN_DIST, Math.random() * canvasHeight * 0.1 + MIN_DIST, i);
		        points.push(point);
		    }
	    }else{
	    	for (i = 0; i < BALLS; i++) {
		        points[i].setup(Math.random() * canvasWidth * 0.1 + MIN_DIST, Math.random() * canvasHeight * 0.1 + MIN_DIST, i);
		    }
	    }
	    context.save();
	    viewPoint.x = parseInt( (canvasWidth-MAX_DIST*2)*0.5 );
	    viewPoint.y = parseInt( (canvasHeight-MAX_DIST*2)*0.45 );
	    viewScale = 4;
	};

	DotLine.setWidHei = function(){
		if(canvas){
			canvas.width = canvasWidth = window.innerWidth;
	    	canvas.height = canvasHeight = window.innerHeight;
		}
	}

	DotLine.loop = function() {
		if(canvas && context){
			context.clearRect(0, 0, canvasWidth, canvasHeight);
		    context.translate((canvasWidth * viewScale - canvasWidth) * -0.5, (canvasHeight * viewScale - canvasHeight) * -0.5);
		    context.scale(viewScale, viewScale);
		    context.translate(viewPoint.x, viewPoint.y);

		    var i,len = points.length, point;
		    for (i = 0; i < len; i++) {
		        point = points[i];
		        point.update(i);
		        point.draw();
		    }
		    context.restore();
		    context.save();
		}
	    timer = requestAnimationFrame(DotLine.loop);
	};

	DotLine.resetCtx = function(){
		if(context && canvas){
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.beginPath();
		}
	};

	DotLine.startAni = function(){
		// DotLine.resetCtx();
		timer = requestAnimationFrame(DotLine.loop);
	};

	DotLine.stopAni = function(){
		cancelAnimationFrame(timer);
	};


	function Point(x, y, i) {
	    this.x;
	    this.y;
	    this.color;
	    this.r;
	    this.vx;
	    this.t;

	    this.setup(x, y, i);
	}

	Point.prototype = {
		setup:function(x, y, i){
			this.x = this.bx = x;
		    this.y = this.by = y;
		    this.color = 'hsla(' + Math.floor(360 / BALLS * i) + ', 50%, 50%, 0.4)';
		    this.r = Math.random() * 10;
		    this.vx = this.vy = this.ax = this.ay = 0;
		    this.t = FPS / 1000;
		},
	    speed: function(aax, aay, friction) {
	        this.ax += aax;
	        this.ay += aay;
	        this.x += this.vx * this.t + 0.5 * this.ax * this.t * this.t;
	        this.y += this.vy * this.t + 0.5 * this.ay * this.t * this.t;
	        this.vx += this.ax * this.t;
	        this.vy += this.ay * this.t;
	        this.vx *= friction;
	        this.vy *= friction;
	        this.ax = 0;
	        this.ay = 0;
	    },
	    update: function(id) {
	        var i;
	        var len = points.length;
	        for (i = 0; i < len; i++) {
	            if (id !== i) {
	                var dist = distance(this, points[i]);
	                var dire = direction(this, points[i]);
	                var r = Math.abs(dist - MAX_DIST) * 1.5;
	                if (dist > MAX_DIST) {
	                    this.speed(r * Math.cos(dire), r * Math.sin(dire), 0.90);
	                }
	                else if (dist < MAX_DIST) {
	                    this.speed(r * Math.cos(dire + Math.PI), r * Math.sin(dire + Math.PI), 0.90);
	                }
	            }
	        }
	    },
	    draw: function() {
	        context.beginPath();
	        context.fillStyle = this.color;
	        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
	        context.fill();
	    }
	};


	return DotLine;
});