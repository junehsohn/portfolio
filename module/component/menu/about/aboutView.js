
define(['jquery','backbone','handlebars','mainRef','mainApp','tweenMax','dotCube','text!aboutTemplate'], 
function ($, Backbone, Handlebars, MainRef, App, TweenMax, DotCube, AboutTemplate) {
	'use strict';

	var AboutView = Backbone.View.extend({
		el:'.section-container',
		bgColor:'#699ce8',
		templateId:'#about-menu-template',
		parseHTML:null,
		dotCube:DotCube,
		aniTimer:null,
		resizeTimer:null,
		template:null,
		events:{
		},
		initialize:function(){
			var that = this;
			that.template = Handlebars.compile($(AboutTemplate).html());
		},
		destroy: function(){
			var that = this;
			//this.model.destroy();
			// $(window).on('resize', that.resize.bind(that));
			// that.off();
			// that.remove();
			// delete that.$el;
			// delete that.el;
		},
		remove: function(){
			this.$el.remove();
			Backbone.View.prototype.remove.apply(this, arguments);

		},
		render:function(){
			var that = this, $d;
			$('.body-container').css({'cursor':'default'});
			if(that.parseHTML){
				that.$el.html(that.parseHTML);
				that.show();
			}else{
				that.$el.html(that.template() );
				that.show();
	        	that.parseHTML = that.$el.html();
			}

			$('.intro-text').each(function(__idx){
				$(this).css({'opacity':0});
			});
	        $d = that._startAni();
	        return $d;

		},
		show:function(){
			this._beforeSetup();
			this._drawPolygon();
	        this.resize(0);
		},
		hide:function(){
			var that = this,
				$introContainer = $('.introduce-container'),
				$d = $.Deferred();

			// that.aniTimer.kill();
			clearInterval(that.aniTimer);
			that.aniTimer = null;
			$('.canvas-container').transition({'opacity':0},800,'easeInOutCubic');
			$introContainer.transition({opacity:0},400,'easeInOutCubic', function(){
				$d.resolve(that);
			});

			return $d;
		},
		resize:function(__dly){
			var that = this;

			that.resizeTimer = setTimeout(function(){
				that._align();

			},__dly);
			
		},
		_beforeSetup:function(){
		},
		_drawPolygon:function(){

		},
		_startAni:function(){
			var that = this,
				$introContainer = $('.introduce-container'),
				$d = $.Deferred(),
				stDly = 500;

			$('.canvas-container').delay(200).transition({'opacity':1},1800, function(){
				$d.resolve(that);
			});

			that.dotCube.lastX=0;
			// that.aniTimer = TweenLite.to( that.dotCube, 30 ,{attr:{lastX:180},delay:0.3, 
			// 	onUpdate:function(){
			// 		that.dotCube.draw();
			// 	}, 
			// 	onComplete:function(){
			// 		that.aniTimer.restart();
			// 	} });
			
			that.aniTimer = setInterval(function(){
				that.dotCube.draw();
			},50);


			$('.intro-text:eq(0)').delay(500).transition({'opacity':1},1800);
			$('.intro-text:eq(1)').delay(500).transition({'opacity':1},1800);
			$('.intro-text:eq(2)').delay(500).transition({'opacity':1},1800);

			$('.intro-text:eq(3)').delay(1500).transition({'opacity':1},1800);
			$('.intro-text:eq(4)').delay(1500).transition({'opacity':1},1800);
			$('.intro-text:eq(5)').delay(1500).transition({'opacity':1},1800);
			$('.intro-text:eq(6)').delay(2500).transition({'opacity':1},1800);
			
			return $d;
		},
		_align:function(){
			var that = this,
				winWid = $(window).width(), 
				winHei = $(window).height(),
				$introContainer = $('.introduce-container'),
				$geoCanvas = $('#geoCanvas'),
				$canvasCont = $('.canvas-container'),
				marginLeft = $introContainer.css('marginLeft'),
				tmpUnit = 140;

			if(winWid>=800 && winWid<1280){
				tmpUnit = 80;
			}else if(winWid>=600 && winWid<800){
				tmpUnit = 60;
			}else if(winWid>=400 && winWid<600){
				tmpUnit = 50;
			}else if(winWid<400){
				tmpUnit = 40;
			}

			$introContainer.css({'marginBottom':marginLeft});
			$geoCanvas.attr({'width':($canvasCont.width()), 'height':($canvasCont.height())});
			that.dotCube.setUnit( tmpUnit );
			that.dotCube.init( $geoCanvas[0] );

		}
	});

	return AboutView;
});



