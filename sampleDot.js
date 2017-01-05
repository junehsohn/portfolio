// Require.js allows us to configure shortcut alias
			require.config({
				// The shim config allows us to configure dependencies for
				// scripts that do not call define() to register a module
				baseUrl: '',
				waitSeconds: 30,
				shim: {
					underscore: {
						exports: '_'
					}
				},
				paths: {
					vec2D: 'node_module/toxiclibsjs/lib/toxi/geom/Vec2D',
					circle: 'node_module/toxiclibsjs/lib/toxi/geom/Circle',
					line2D: 'node_module/toxiclibsjs/lib/toxi/geom/Line2D',
					ray2D: 'node_module/toxiclibsjs/lib/toxi/geom/Ray2D',
					tColor: 'node_module/toxiclibsjs/lib/toxi/geom/TColor',
					createListUsingStrategy: 'node_module/toxiclibsjs/lib/toxi/geom/createListUsingStrategy',
				}
			});

			
				require([
					vec2D, circle, line2D, ray2D, tColor, createListUsingStrategy
				], function ( Vec2D, Circle, Line2D, Ray2D, TColor, createListUsingStrategy ) {
					
					var container = document.getElementById('example-container'),
				        canvas = document.createElement('canvas'),
				        ctx = canvas.getContext('2d'),
				        mouse = new Vec2D(0,0),
				        circle,
				        colorList = createListUsingStrategy('compound', TColor.X11.azure.copy()),
				        color1 = colorList.get(0).toRGBACSS(),
				        color2 = colorList.get(1).toRGBACSS(),
				        color3 = colorList.get(2).toRGBACSS(),
				        color4 = colorList.get(3).toRGBACSS(),
				        color5 = colorList.get(4).toRGBACSS(),
				        drawFrame;

				    canvas.width = window.innerWidth;
				    canvas.height = window.innerHeight - 50;
				    container.appendChild( canvas );

				    circle = new Circle( canvas.width/2, canvas.height/2, canvas.width*0.1);
				    mouse.set( canvas.width, canvas.height ).scaleSelf(0.5);

				    var draw = {
				        circle: function( c ){
				            ctx.beginPath();
				            ctx.arc(c.x, c.y, c.getRadius(), 0, Math.PI * 2 );
				            ctx.closePath();
				        },
				        line: function( line ){
				            ctx.beginPath();
				            ctx.moveTo(line.a.x, line.a.y);
				            ctx.lineTo(line.b.x, line.b.y);
				            ctx.closePath();
				        }
				    };

				    drawFrame = function(){
			        ctx.clearRect(0,0,canvas.width,canvas.height);
			        var line = new Line2D(mouse, circle);
			        ctx.strokeStyle = color1;
			        draw.circle( circle );
			        ctx.stroke();
			        ctx.strokeStyle = color2;
			        draw.line( line );
			        ctx.stroke();
			        draw.circle(new Circle(line.getMidPoint(), line.getLength()/2));
			        ctx.stroke();
			        var isecs = circle.getTangentPoints(mouse);
			        if( isecs ){
			        	isecs.forEach(function( isec ){
				                var ray = new Ray2D(mouse, isec.sub(mouse)),
				                    rayLine = ray.toLine2DWithPointAtDistance(canvas.width);
				                ctx.strokeStyle = color3;
				                draw.line( new Line2D(circle, isec) );
				                ctx.stroke();
				                ctx.strokeStyle = color4;
				                draw.line( rayLine );
				                ctx.stroke();
				                ctx.fillStyle = color5;
				                draw.circle( new Circle(isec, 5) );
				                ctx.fill();
				            });
				        }
				    };


				    canvas.addEventListener('mousemove', function(evt){
				        mouse.set( evt.pageX, evt.pageY );
				        drawFrame();
				    }, false);

				    var onTouchUpdate = function( evt ){
				        if( evt.touches.length > 1 ){
				            evt.preventDefault();
				        }
				        var t = evt.touches[0];
				        mouse.set( t.pageX, t.pageY );
				        drawFrame();
				    };

				    document.addEventListener('touchstart', onTouchUpdate);
				    document.addEventListener('touchmove', onTouchUpdate);
				    drawFrame();


				});
