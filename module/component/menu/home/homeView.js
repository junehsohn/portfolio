
define(['jquery','backbone','handlebars','mainRef','mainApp','polygon','navCollection','navModel','text!homeTemplate'], 
function ($, Backbone, Handlebars, MainRef, App, Polygon, NavCollection, NavModel, HomeTemplate) {
	'use strict';

	var HomeView = Backbone.View.extend({
		el:'.section-container',
		bgColor:'#232121',
		// bgColor:'#e78a05',
		templateId:'#section-menu-template',
		parseHTML:null,
		resizeTimer:null,
		mesh:{
			width: 0.16,
			height: 1.2,
			depth: 8,
			segments: 3,
			slices: 4,
			xRange: 1.48,
			yRange: 0.3,
			zRange: 1.0,
			ambient: '#777777',
			diffuse: '#888888',
			speed: 0.0003
		},
		light:{
			ambient: '#a2a0a7',
			diffuse: '#bbbdc4',
		},
		template:null,
		polygon:null,
		events:{
			'click .menu-text-wrapper>a':'_onNavigateURL'
		},
		initialize:function(){
			var that = this;
			that.template = Handlebars.compile($(HomeTemplate).html());
			this.listenTo( this.collection, 'change:href', function(__model, __changeData, __opt){
				$('.menu-list:eq(1) a').attr('href',__changeData);
			} );
		},
		destroy: function(){
			//this.model.destroy();
			var that = this;
			clearTimeout(that.resizeTimer);
			$(window).on('resize', that.resize.bind(that));
			that.off();
			that.remove();
			delete that.$el;
			delete that.el;

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
				that.$el.html(that.template(that.collection.toJSON()));
				that.show();
	        	that.parseHTML = that.$el.html();
			}
			
	        $d = that._startAni();
	        return $d;

		},
		show:function(){
			this._beforeSetup();
			this._drawPolygon();
	        this.resize();
		},
		hide:function(){
			var that = this,
				$d = $.Deferred(),
				posX,
				$pBar = this.$el.find('.polygon-bar'),
				$menuList = this.$el.find('.menu-text');

			if( $pBar[0] && $menuList[0] && that.polygon ){
				that.polygon.stopAnimate();
				$pBar.stop().delay(200).transition({scaleX:0.0,scaleY:2,opacity:0.9},800,'easeInOutCubic', function(){
					$menuList.css('display','none');
					that.$el.children().remove();
					$d.resolve(that);
				});
				
				$menuList.each(function(__idx){
					posX = (__idx%2==0)?'80':'-80';
					$(this).stop().delay(__idx*100).transition({rotateZ:-60,rotateY:-90, opacity:0, x:posX},400,'easeInCubic');
				});
			}

			return $d;
		},
		resize:function(){
			var that = this;

			that.resizeTimer = setTimeout(function(){
				var w = $(window).width(), h = $(window).height();
				that._align();
				if(h>w){
					that.polygon._mesh.width = 0.12;
				}else{
					that.polygon._mesh.width = 0.16;
				}
				that.polygon.createMesh({mesh:that.mesh});
				
			},300);
			
		},
		_beforeSetup:function(){
			var posX, $pBar = this.$el.find('.polygon-bar');
			$pBar.stop().css({scaleX:0.0,scaleY:2,opacity:0.9});

			this.$el.find('.menu-text').each(function(__idx){
				posX = (__idx%2==0)?'80':'-80';
				$(this).stop().css({opacity:0});
				$(this).css({x:posX, rotateZ:-65,rotateY:90, display:'block'});
			});
		},
		_drawPolygon:function(){
			this.polygon = MainRef.app.viewManager.setGlobalPolygon( {container:this.$el.find('.polygon-bar')[0], output:this.$el.find('.poly-vertical')[0]} );
			if(this.polygon._mesh.width != this.mesh.width || this.polygon._mesh.height != this.mesh.height) this.polygon.createMesh({mesh:this.mesh});
			if(this.polygon._light.ambient != this.light.ambient || this.polygon._light.diffuse != this.light.diffuse) this.polygon.createLights({light:this.light});
			this.polygon.updateRender();

		},
		_startAni:function(){
			var that = this,
				$d = $.Deferred(),
				$pBar = this.$el.find('.polygon-bar'),
				$menuList = this.$el.find('.menu-text'),
				onCompFnc = null;

			that.polygon.animate();
			$pBar.stop().css({scaleX:0.0,scaleY:2,opacity:0.9}).delay(300).transition({scaleX:1,scaleY:1.2},2400,'easeOutBack');

			$menuList.each(function(__idx){
				if( __idx==2 ){
					onCompFnc = function(){
						$d.resolve(that);
					}
				}
				$(this).stop().delay(1400+(__idx*300)).transition({rotateZ:-20,rotateY:0, opacity:1, x:0},1800,'easeOutCubic', onCompFnc);
			});

			return $d;
		},
		_align:function(){
			var $menuList = this.$el.find('.menu-list'),
				winWid = $(window).width(),
				listWid = $menuList.eq(0).width(),
				listHei = $menuList.eq(0).height(),
				per = (winWid<600)?0.4:0.6,
				len = $menuList.length,
				gap = ($(window).height()-(len*listHei))/(len+1),
				tmpLeft, tmpTop;

			$menuList.each(function(__idx){
				tmpTop = gap*(__idx+1)+(listHei*(__idx));
				tmpLeft = ((winWid-listWid)*0.5);
				if(__idx%2==0){
					tmpLeft -= listWid*per;
				}else{
					tmpLeft += listWid*per;
				}

				if(__idx==0) tmpTop+=listHei*0.3;
				if(__idx==2) tmpTop-=listHei*0.3;
				$(this).css({'top':(tmpTop)+'px', 'left':tmpLeft+'px'});
			});
			
		}, 
		_onNavigateURL:function(__e){
			__e.preventDefault();
			MainRef.app.router.navigate( $(__e.target).parent().attr('href'), {trigger: true} );
			return false;
		}
	});

	return HomeView;
});