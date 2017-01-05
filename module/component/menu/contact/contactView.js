
define(['jquery','backbone','handlebars','mainRef','mainApp','contactModel','dotLine' ,'text!contactTemplate'], 
function ($, Backbone, Handlebars, MainRef, App, ContactModel, DotLine , ContactTemplate) {
	'use strict';

	var ContactView = Backbone.View.extend({
		el:'.section-container',
		bgColor:'#f9fefe',
		templateId:'#contact-menu-template',
		parseHTML:null,
		resizeTimer:null,
		resetTimer:null,
		resetTimerDly:5000,
		template:null,
		polygon:DotLine,
		events:{
		},
		initialize:function(){
			var that = this;
			that.template = Handlebars.compile($(ContactTemplate).html());
		},
		destroy: function(){
			//this.model.destroy();
			var that = this;
			clearTimeout(that.resizeTimer);
			clearInterval(that.resetTimer);
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
				that.$el.html(that.template(that.model.toJSON()));
				that.show();
	        	that.parseHTML = that.$el.html();
			}
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
				$d = $.Deferred();

			that.polygon.stopAni();
			that.destroy();
			$('.email').transition({opacity:0},300,'easeOutCubic');
			$('.location').transition({opacity:0},300,'easeOutCubic');
			$('.contact-canvas-container').transition({opacity:0},600, function(){
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
				$d = $.Deferred();


			that.polygon.startAni();
			$('.email').delay(1600).transition({opacity:1},1800,'easeOutCubic');
			$('.location').delay(2600).transition({opacity:1},1800,'easeOutCubic');
			$('.contact-canvas-container').delay(800).transition({opacity:1},1800);
			that.resetTimer = setInterval(function(){
				if($('#contactCanvas')[0]) that.polygon.init( $('#contactCanvas')[0] );

			}, that.resetTimerDly);

			$d.resolve(that);
			return $d;
		},
		_align:function(){
			var that = this,
				winWid = $(window).width(), 
				winHei = $(window).height();

			$('#contactCanvas').attr({'width':winWid, 'height':winHei});
			if($('#contactCanvas')[0]) that.polygon.init( $('#contactCanvas')[0] );
		}
	});

	return ContactView;
});



