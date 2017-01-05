define([], function () {
	'use strict';

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


	var unit = 180,
		u4 = 0,
		u8 = 0,
		u32 = 0,
		uPow = 0,
		timer = null,
		DotCube={
			head:0, 
			roll:0, 
			points:[],
			lastX:null, 
			lastY:null, 
			canvas:null, 
			context:null,
			canWid:0,
			canHei:0,
			init:function(__canvas){
				DotCube.destroy();
				DotCube.canvas = __canvas;
				DotCube.context = DotCube.canvas.getContext("2d");
				DotCube.head=-748;
				DotCube.roll=600;
				DotCube.lastX=0;
				DotCube.lastY=0;
				DotCube.points = [];
				DotCube.canWid = parseInt(DotCube.canvas.width/3);
				DotCube.canHei = parseInt(DotCube.canvas.height/3);
				DotCube.setUnit(unit);
				update();
			},
			setUnit:function(__unit){
				unit = __unit;
				u4 = unit*4;
				u8 = unit*8;
				u32 = unit*32;
				uPow = unit*unit;
			},
			destroy:function(){
				DotCube.canvas = null;
				DotCube.context = null;
				DotCube.points = [];
			},
			draw:function(){
					DotCube.head = -748;
					DotCube.roll += 0.25;
					update();
			},
			startAni:function(){
			},
			stopAni:function(){
			}
		};

	function clamp(x, min, max) {
	  return Math.max(min, Math.min(max, x));
	}
	function clamp_255(x) {
	  return clamp(Math.round(x), 0, 128);
	}
	function clamp_255x(x) {
	  return clamp(Math.round(x * 255), 0, 128);
	}

	function YCbCr_to_RGB(Y, Cb, Cr) {
	  Y = clamp(Math.floor(Y * 219) + 16, 16, 235);
	  Cb = clamp(Math.floor(Cb * 224) + 16, 16, 240);
	  Cr = clamp(Math.floor(Cr * 224) + 16, 16, 240);

	  return [clamp_255(1.164 * (Y - 64) + 1.596 * (Cr - 64)),
	          clamp_255(1.164 * (Y - 32) - 0.813 * (Cr - 64) - 0.392 * (Cb - 255)),
	          clamp_255(1.164 * (Y - 64) + 2.017 * (Cb - 64))];
	}

	function transform(x, y, z) {
	  var a = DotCube.head * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
	  var x0 = x * c - z * s;
	  var y0 = y;
	  var z0 = z * c + x * s;
	  a = DotCube.roll * Math.PI / 180;
	  c = Math.cos(a);
	  s = Math.sin(a);
	  x = x0;
	  y = y0 * c - z0 * s;
	  z = z0 * c + y0 * s;
	  return [x, y, z];
	}

	function project(x, y, z) {
	  z = (z + (u32)) / (u32);
	  return [x * z + (u8), y * z + (u8)];
	}

	function begin() {
	  DotCube.context.clearRect(0, 0, (uPow), (uPow));
	}

	function size(x) {
	  return (200 + x) / (unit*2);
	}

	function plot(x, y, z, c, cnt) {
	  var t = transform(x, y, z), proj = project(t[0], t[1], t[2]);
	  if(DotCube.points[cnt]){
	  	//DotCube.points[cnt] = [ c, t, project(t[0], t[1], t[2]), size(t[2]) ];
	  	DotCube.points[cnt][0] = c;
	  	DotCube.points[cnt][1] = t;
	  	DotCube.points[cnt][2][0] = proj[0];
	  	DotCube.points[cnt][2][1] = proj[1];
	  	DotCube.points[cnt][3] = size(t[2]);
	  }else{
	  	DotCube.points.push( [ c, t, project(t[0], t[1], t[2]), size(t[2]) ] );
	  }

	  t = null;
	  proj = null;
	  
	}

	function endSorting (a, b){
	    a = a[1][2];
	    b = b[1][2];
	    return a == b ? 0 : a < b ? -1 : 1;
	}

	function end() {
	  DotCube.points.sort(endSorting);
	  for (var p, l = DotCube.points.length, i = 0; i < l; ++i) {
	    p = DotCube.points[i];
	    DotCube.context.beginPath();
	    DotCube.context.fillStyle = p[0];
	    DotCube.context.arc((p[2][0])-(unit*4)+(unit)+DotCube.canWid, (p[2][1])-(unit*4)+(unit)-DotCube.canHei, unit/2, 0, Math.PI * 2, false);
	    DotCube.context.fill();
	  }
	}

	function update() {
	  begin();
	  var r, g, b, c, cnt=0
	  for (var x = -u4; x <= u4; x += unit) {
	    for (var y = -u4; y <= u4; y += unit) {
	      for (var z = -u4; z <= u4; z += unit) {
	        r = (x + u4) / u8;
	        g = (y + u4) / u8;
	        b = (z + u4) / u8;
	        c = YCbCr_to_RGB(r, g, b);
	        plot(x, y, z, "rgba(" + c.join(",") + ",0.3)", cnt);
	        ++cnt;
	      }
	    }
	  }
	  end();
	}

	return DotCube;
});