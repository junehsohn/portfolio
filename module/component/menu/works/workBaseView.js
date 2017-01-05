
define(['jquery','backbone','handlebars', 'tweenMax', 'iscroll','modernizr','mainRef','mainApp','polygon','arcText','workCollection','workModel','text!workTemplate'], 
function ($, Backbone, Handlebars, TweenMax, ISCR, Modernizr, MainRef, App, Polygon, ArcText, WorkCollection, WorkModel, WorkTemplate) {
	'use strict';

	var WorkBaseView = Backbone.View.extend({
		el:'.section-container',
		bgColor:'#c9bad8',
		templateId:'#section-menu-template',
		lastClickTime:0,
		parseHTML:null,
		resizeTimer:null,
		fadeInTimer:null,
		iscrollH:null,
		curIdx:-1,
		isReady:false,
		mesh:{
			width: 1.2,
			height: 0.1,
			depth: 17,
			segments: 14,
			slices: 2,
			xRange: 0.43,
			yRange: 0.83,
			zRange: 1.0,
			ambient: '#b14aa2',
			diffuse: '#a14293',
			speed: 0.0007
		},
		light:{
			ambient: '#b449ad',
			diffuse: '#b14aa2',
		},
		tmpMesh:null,
		tmpLight:null,
		goalMeshAb:null,
		goalMeshDi:null,
		goalLightAb:null,
		goalLightDi:null,
		template:null,
		polygon:null,
		events:{
			'mouseenter .wml-cir-click':'_onList',
			'mouseleave .works-menu-list':'_offList',
			'mousedown .wml-cir-click':'_onClickMenu',
			'touchend .wml-cir-click':'_onClickMenu',
			'click .works-menu-container':'_onTouchStContainer',
			'click .works-menu-list':'_onTouchMenuList'
		},
		initialize:function(){
			var that = this;
			that.template = Handlebars.compile($(WorkTemplate).html());
			Modernizr = window.Modernizr;
		},
		destroy: function(){
			var that = this;
			$(window).off('resize', that.resize.bind(that));
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
			$('.body-container').css({'cursor':'col-resize'});
			if(that.parseHTML){
				that.$el.html(that.parseHTML);
				that.show();
			}else{
				that.$el.html(that.template(that.collection.toJSON()));
				that.show();
	        	that.parseHTML = that.$el.html();
			}
	        $d = this._startAni();
	        return $d;

		},
		show:function(){
			this._beforeSetup();
			this._drawPolygon();
			this._align();
	        this.resize(0);
		},
		hide:function(){
			var that = this,
				$d = $.Deferred(),
				$pBar = this.$el.find('.polygon-bar');

			if( $pBar[0] && that.polygon ){
				that.polygon.stopAnimate();
				$pBar.stop().delay(500).transition({scaleX:1,scaleY:0,opacity:0.9},800,'easeInOutCubic', function(){
					that.$el.children().remove();
					$d.resolve(that);
				});
			}

			that._destroyIscroll();
			$('.works-menu-list').each(function(index){
				$(this).stop();
			});

			$('.work-prog-bar').transition({bottom:-10},400,'easeInOutCubic');
			that._fadeOutAllList();

			return $d;
		},
		resize:function(__dly){
			var that = this,
				wid = $(window).width(),
				hei = $(window).height(),
				dly = (__dly)?__dly:350;

			clearTimeout(this.resizeTimer);
			this.resizeTimer = setTimeout(function(){
				if(that.polygon){
					if(wid<800){
						that.polygon._mesh.yRange = 0.53;
					}

					if(wid>=800 && wid<=1024){
						that.polygon._mesh.yRange = 0.73;
					}

					if(wid>1024){
						that.polygon._mesh.yRange = 0.83;
					}
				}
				that._align();
			}, dly);
			
		},
		_destroyIscroll:function(){
			if(this.iscrollH) {
				this.iscrollH.off('scroll');
				this.iscrollH.destroy();
			}
			this.iscrollH = null;
		},
		_beforeSetup:function(){
			var that = this, posX, $pBar = this.$el.find('.polygon-bar'), $tmpCir;

			$('.iScrollHorizontalScrollbar').remove();
			$pBar.stop().css({scaleX:2.1, scaleY:0, opacity:0.9});
			that.isReady = false;
			that.curIdx = -1;
			that._destroyIscroll();
			$('.works-menu').css({opacity:0});
			$('.works-menu-list').removeClass('act');
			$('.works-menu-list').each(function(__idx){
				$tmpCir = $(this).find('.wml-cir-large');
				$tmpCir.css({scaleX:0, scaleY:0, rotate:-270});
				$(this).find('.wml-cir-large-img-color').css({'backgroundColor':that.collection.get( $(this).attr('data-works-id') ).toJSON().mesh.ambient});
			});

			$('.works-menu-list').each(function(__idx){
				$tmpCir = $(this).find('.wml-cir-large');
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
				onCompFnc = null;

			that.polygon.animate();
			$pBar.stop().delay(150).transition({scaleX:1.1,scaleY:1.2,opacity:0.9},2100,'easeInOutCubic');
			$d = that._fadeInAllList();
			return $d;
		},
		_align:function(){
			var that = this,
				wid = $(window).width(),
				hei = $(window).height(),
				$wmlName,
				$wmlCopy,
				$cirSmall,
				$cirClick, 
				$cirLarge,
				$cirLargeImg,
				stX=(wid/5<100)?100: (wid/5>350)?350:wid/5,
				itemGap=stX,
				constY=parseInt(hei/6),
				tmpX, tmpY, nameTxtWid, copyTxtWid, txtHei,
				largeCirR = parseInt(hei/3), smallCirR=60,
				fontSize, fontSizeCopy;

			if(largeCirR>340){
				largeCirR=340;
			}else if(largeCirR<220){
				largeCirR=220;
			}

			fontSize = fontSizeCopy = parseInt((largeCirR*38)/340);
			if(fontSize<28) fontSize = 28;
			if(fontSizeCopy<28) fontSizeCopy = 28;

			$('.works-menu-list').each(function(__idx){
				tmpX = stX/3+(__idx*itemGap);
				tmpY =  parseInt( (__idx%2==0) ? ((hei-$(this).height())/2)-constY : ((hei-$(this).height())/2)+constY );
				$(this).attr({'data-x':tmpX, 'data-y':tmpY});
				$wmlName = $(this).find('.wml-name');
				$wmlCopy = $(this).find('.wml-copy');
				$cirSmall = $(this).find('.wml-cir-small');
				$cirClick = $(this).find('.wml-cir-click');
				$cirLarge = $(this).find('.wml-cir-large');
				$cirLargeImg = $(this).find('.wml-cir-large-img');

				$wmlCopy.css( {'font-size':36} );
				$wmlName.css( {'font-size':fontSize} );
				$wmlCopy.attr({'data-top':parseInt( ((smallCirR+20)/2) )});

				nameTxtWid = $wmlName.width();
				copyTxtWid = $wmlCopy.width();
				txtHei = $wmlCopy.height();

				$cirLargeImg
				.attr({'data-width':largeCirR, 'data-height':largeCirR, 'width':largeCirR, 'height':largeCirR})
				.css({'width':(largeCirR)+'px', 'height':(largeCirR)+'px'});

				if( $wmlCopy.children().length ){
				}else{
					$wmlCopy.arctext({radius:smallCirR+20, dir:1});
				} 
				$wmlCopy.css({'font-size':fontSizeCopy, y:parseInt( -(340-largeCirR)/4 )});
				$wmlName.css({rotateZ:-10, y:parseInt( (largeCirR-txtHei)/2-(smallCirR) )});

				
				$(this).find('.wml-cir-large').css({ width:largeCirR+'px', height:largeCirR+'px'  });
				$cirSmall.css(
					{ width:smallCirR+'px', height:smallCirR+'px', 
					  left:parseInt((largeCirR-smallCirR)/2)+'px', top:parseInt((largeCirR-smallCirR)/2)+'px', 
					  scaleX:0.4, scaleY:0.4, opacity:1, display:'block' }
				);
				$cirClick.css({ left:parseInt((largeCirR-$cirClick.width())/2)+'px', top:parseInt((largeCirR-$cirClick.width())/2)+'px'});
				$(this).css({x:tmpX, y:tmpY, width:largeCirR, height:largeCirR});

				if( $(this).hasClass('act') ){
					$cirLarge.css({scaleX:1.0, scaleY:1.0, rotate:135});
					$cirSmall.css({scaleX:1.0, scaleY:1.0});
				}else{
					$cirLarge.css({scaleX:0.0, scaleY:0.0, rotate:-270});
					$cirSmall.css({scaleX:0.4, scaleY:0.4});
				}
				

			});
		
			$('ul.works-menu:eq(0)').css('width', (($('.works-menu-list').length*itemGap)+(stX*2))+'px');
			if(that.iscrollH){
				that.iscrollH.refresh();
			}else{
				that._onScroll();
			}

		},
		_onScroll:function(){
			var that = this;
			if($('.works-menu-container')[0]){
				that.iscrollH  = new IScroll(
					'.works-menu-container', 
					{ scrollX: true, scrollY: false, mouseWheel: true, scrollbars:false, fadeScrollbars:false, click: true, tab: true ,probeType: 3, 
					    indicators: [{
							el: $('.polygon-bar')[0],
							resize: true,
							ignoreBoundaries: true,
							speedRatioX: 0.2
						}]
					});
				that.iscrollH.on('scroll', function(){
					var tmpPer = Math.abs(this.x)/(Math.abs($('ul.works-menu').width()-$(window).width()))*100;
					$('.work-prog-bar').css('width', tmpPer+'%');
				});
			}
			
		}, 
		_onList:function(__e){
			// if(!this.isReady) return false;
			if(Modernizr.touch){}else{
				__e.preventDefault();
				var that = this,
					$tmpParent = $(__e.target).closest('.works-menu-list');
					
				if( $tmpParent.hasClass('act') ){}else{
					this._actList($tmpParent.index());
				}		
			}
				

		},
		_offList:function(__e){
			if(Modernizr.touch) return false;
			// if(!this.isReady) return false;
			__e.preventDefault();
			var $tmpParent = $(__e.target).closest('.works-menu-list');
			if( $tmpParent.hasClass('act') ){
				
			}
			this._deactList($tmpParent.index());
			
		},
		_actList:function(__idx){
			if(this.curIdx==__idx){
				return false;
			}

			var that = this,
				meshObj,
				lightObj,
				polyScene,
				polyMesh,
				polyLight,
				i, l, light,
				tmpMesh = that.tmpMesh, tmpLight = that.tmpLight, goalMeshAb = that.goalMeshAb, 
				goalMeshDi = that.goalMeshDi, goalLightAb = that.goalLightAb , goalLightDi = that.goalLightDi,
				hexToRgb = MainRef.app.util.hexToRgb,
				rgbToHex = MainRef.app.util.rgbToHex,
				$tmpParent = $('.works-menu-list').eq(__idx), 
				$cirLarge = $tmpParent.find('.wml-cir-large'), 
				$cirSmall = $tmpParent.find('.wml-cir-small'), 
				$cirSmallTxtInner = $tmpParent.find('.wml-cir-small-text-inner'), 
				$wmlCopy = $tmpParent.find('.wml-copy'), 
				$wmlName = $tmpParent.find('.wml-name'), 
				tmpCopyOpa=(Number($tmpParent.find('.wml-copy').css('opacity'))!=0)?1:0;
			
			that._killTweenLists(__idx);
			that._deactList(that.curIdx);
			that.curIdx = __idx;
			$tmpParent.addClass('act');

			$('.works-menu-list').each(function(__idx){
				if(__idx==that.curIdx){
					$(this).css({'z-index':'1010'});
				}else{
					$(this).css({'z-index':'1001'});
				}
			});

			meshObj = that.collection.get( $tmpParent.attr('data-works-id') ).toJSON().mesh;
			lightObj = that.collection.get( $tmpParent.attr('data-works-id') ).toJSON().light;
			polyScene = that.polygon._scene;
			polyMesh = polyScene.meshes;
			polyLight = polyScene.lights;

			tmpMesh = {ambient:hexToRgb(polyMesh[0].material.ambient.hex), diffuse:hexToRgb(polyMesh[0].material.diffuse.hex)};
			tmpLight = {ambient:hexToRgb(polyLight[0].ambientHex), diffuse:hexToRgb(polyLight[0].diffuseHex)};
			goalMeshAb = hexToRgb(meshObj.ambient);
			goalMeshDi = hexToRgb(meshObj.diffuse);
			goalLightAb = hexToRgb(lightObj.ambient);
			goalLightDi = hexToRgb(lightObj.diffuse);

			$tmpParent.attr({ 'data-mesh-ambient-r':tmpMesh.ambient.r, 'data-mesh-ambient-g':tmpMesh.ambient.g, 'data-mesh-ambient-b':tmpMesh.ambient.b });
			$tmpParent.attr({ 'data-mesh-diffuse-r':tmpMesh.diffuse.r, 'data-mesh-diffuse-g':tmpMesh.diffuse.g, 'data-mesh-diffuse-b':tmpMesh.diffuse.b });
			$tmpParent.attr({ 'data-light-ambient-r':tmpLight.ambient.r, 'data-light-ambient-g':tmpLight.ambient.g, 'data-light-ambient-b':tmpLight.ambient.b });
			$tmpParent.attr({ 'data-light-diffuse-r':tmpLight.diffuse.r, 'data-light-diffuse-g':tmpLight.diffuse.g, 'data-light-diffuse-b':tmpLight.diffuse.b });

			// TweenMax.to( $cirSmall, 0.6, {scaleX:1.0, scaleY:1.0, ease:Cubic.easeInOut} );
			// TweenMax.to( $cirLarge, 0.6, {delay:0.1, scaleX:1.0, scaleY:1.0, rotationZ:135, ease:Sine.easeInOut, onComplete:function(){
			// }} );

			// TweenMax.to( $wmlName, 0.6, {opacity:0, ease:Cubic.easeOut} );
			// TweenMax.to( $cirSmallTxtInner, 0.6, {opacity:1, ease:Cubic.easeInOut, delay:0.3} );
			// TweenMax.to( $wmlCopy, 0.6, {opacity:1, ease:Cubic.easeInOut, delay:0.3} );

			$cirSmall.transition({scaleX:1.0, scaleY:1.0},600);
			$cirLarge.transition({scaleX:1.0, scaleY:1.0, rotate:135},600);
			$cirSmallTxtInner.delay(300).transition({opacity:1},600);
			$wmlCopy.delay(300).transition({opacity:1},600);
			$wmlName.transition({opacity:0},300);
			

			TweenLite.to( $tmpParent, 1.6, 
				{attr:
					{ 
						'data-mesh-ambient-r':goalMeshAb.r, 'data-mesh-ambient-g':goalMeshAb.g, 'data-mesh-ambient-b':goalMeshAb.b ,
						'data-mesh-diffuse-r':goalMeshDi.r, 'data-mesh-diffuse-g':goalMeshDi.g, 'data-mesh-diffuse-b':goalMeshDi.b ,
						'data-light-ambient-r':goalLightAb.r, 'data-light-ambient-g':goalLightAb.g, 'data-light-ambient-b':goalLightAb.b ,
						'data-light-diffuse-r':goalLightDi.r, 'data-light-diffuse-g':goalLightDi.g, 'data-light-diffuse-b':goalLightDi.b ,
					}, 
				ease:Sine.easeIn, 
				onUpdate:function(){
					l = polyMesh.length;
					for (i = 0; i < l; i++) {
						polyMesh[i].material.ambient.set(rgbToHex( $tmpParent.attr('data-mesh-ambient-r'),$tmpParent.attr('data-mesh-ambient-g'),$tmpParent.attr('data-mesh-ambient-b') ));
						polyMesh[i].material.diffuse.set(rgbToHex( $tmpParent.attr('data-mesh-diffuse-r'),$tmpParent.attr('data-mesh-diffuse-g'),$tmpParent.attr('data-mesh-diffuse-b') ));
					}

					l = polyLight.length;
					for (i = 0; i < l; i++) {
						light = polyScene.lights[i];
						light.ambient.set(rgbToHex( $tmpParent.attr('data-light-ambient-r'),$tmpParent.attr('data-light-ambient-g'),$tmpParent.attr('data-light-ambient-b') ));
						light.ambientHex = light.ambient.format();
						light.diffuse.set(rgbToHex( $tmpParent.attr('data-light-diffuse-r'),$tmpParent.attr('data-light-diffuse-g'),$tmpParent.attr('data-light-diffuse-b') ));
		        		light.diffuseHex = light.diffuse.format();
					}
				},onComplete:function(){
					tmpMesh=null;
					tmpLight=null;
					goalMeshAb=null;
					goalMeshDi=null;
					goalLightAb=null;
					goalLightDi=null;
				}} 
			);


		},
		_deactList:function(__idx, __isSet){
			var that = this,
				$tmpParent = $('.works-menu-list').eq(__idx),
				$cirLarge = $tmpParent.find('.wml-cir-large'), 
				$cirSmall = $tmpParent.find('.wml-cir-small'), 
				$cirSmallTxtInner = $tmpParent.find('.wml-cir-small-text-inner'), 
				$wmlCopy = $tmpParent.find('.wml-copy'), 
				$wmlName = $tmpParent.find('.wml-name');

			$('.works-menu-list').removeClass('act');
			that._killTweenLists(__idx);
			that.curIdx = -1;

			if(__isSet){
				$cirLarge.css({scaleX:0.05, scaleY:0.05, rotateZ:0});
				$cirSmall.css({scaleX:0.4, scaleY:0.4});
				$cirSmallTxtInner.stop().css({opacity:0});
				$wmlCopy.stop().css({opacity:0});
				$wmlName.css({opacity:1});
			}else{

				// TweenMax.to( $cirSmall, 0.3, {scaleX:0.4, scaleY:0.4, ease:Cubic.easeOut} );
				// TweenMax.to( $cirLarge, 0.6, {scaleX:0.0, scaleY:0.0, rotationZ:-270, ease:Cubic.easeOut} );
				// TweenMax.to( $wmlName, 0.65, {opacity:1, ease:Cubic.easeOut} );
				// TweenMax.to( $cirSmallTxtInner, 0.2, {opacity:0, ease:Cubic.easeOut, delay:0.0} );
				// TweenMax.to( $wmlCopy, 0.2, {opacity:0, ease:Cubic.easeOut, delay:0.0});


				$cirSmall.transition({scaleX:0.4, scaleY:0.4},300);
				$cirLarge.transition({scaleX:0.0, scaleY:0.0, rotate:-270},400, function(){
				});

				$cirSmallTxtInner.stop().transition({opacity:0},200);
				$wmlCopy.stop().transition({opacity:0},200);
				$wmlName.transition({opacity:1},600);
			}
		},
		_deactAllList:function(){
			var that = this;
			$('.works-menu-list').each(function(index){
				that._deactList(index, false);
			});
		},
		_killTweenLists:function(__idx){
			var that = this,
				$tmpParent = $('.works-menu-list').eq(__idx),
				$cirLarge = $tmpParent.find('.wml-cir-large'), 
				$cirSmall = $tmpParent.find('.wml-cir-small'), 
				$cirSmallTxtInner = $tmpParent.find('.wml-cir-small-text-inner'), 
				$wmlCopy = $tmpParent.find('.wml-copy'), 
				$wmlName = $tmpParent.find('.wml-name');

			// $tmpParent.stop();
			// $cirLarge.stop();
			// $cirSmall.stop();
			// $cirSmallTxtInner.stop();
			// $wmlCopy.stop();
			// $wmlName.stop();

			// TweenLite.killTweensOf($tmpParent);

			// TweenLite.killTweensOf($cirLarge);
			// TweenLite.killTweensOf($cirSmall);
			
			// TweenLite.killTweensOf($cirSmallTxtInner);
			// TweenLite.killTweensOf($wmlCopy);
			// TweenLite.killTweensOf($wmlName);
		},
		_fadeInAllList:function(){
			var that = this, 
				$d = $.Deferred(), 
				$menuList= $('.works-menu-list') , 
				len = $menuList.length, 
				tmpX, 
				tmpY,
				winWid = $(window).width()/2;

			that.resize(0);
			$menuList.each(function(index){
				that._killTweenLists(index);
				tmpX = Number($(this).attr('data-x'));
				tmpY = Number($(this).attr('data-y'));
				$(this).stop().transition({ x:tmpX,y:(index%2==0)?tmpY-0:tmpY+0,opacity:0},0);
			});
			$('.works-menu').css({'opacity':1});

			that.fadeInTimer = setTimeout(function(){

				$menuList.each(function(index){
					tmpX = Number($(this).attr('data-x'));
					tmpY = Number($(this).attr('data-y'));

					if(index==len-1){
						$(this).delay(index*150).css({rotateX:(index%2==0)?-90:90, rotateY:(index%2==0)?60:-60, x:tmpX-winWid/6, y:(index%2==0)?tmpY-50:tmpY+50}).transition({opacity:1, rotateX:0, rotateY:0, x:tmpX, y:tmpY},1800,'easeInOutCubic', function(){
							that.resize(0);
							if(that.iscrollH) that.iscrollH.refresh();
							that.isReady = true;
							$d.resolve(that);
						});
					}else{
						$(this).delay(index*150).css({rotateX:(index%2==0)?-90:90, rotateY:(index%2==0)?60:-60, x:tmpX-winWid/6, y:(index%2==0)?tmpY-50:tmpY+50}).transition({opacity:1, rotateX:0, rotateY:0, x:tmpX, y:tmpY},1800,'easeInOutCubic');
					}
				});

			}, 1200);
			
			return $d;
		},
		_fadeOutAllList:function(){
			var that = this, 
				$d = $.Deferred();
			
			clearTimeout(that.fadeInTimer);
			$('.works-menu').stop().delay(0).transition({opacity:0},450,'easeOutCubic', function(){
				$d.resolve(that);
			});

			return $d;
		},
		_onClickMenu:function(__e){
			// __e.preventDefault();
			// __e.stopPropagation();
			var that = this,
				$tmpParent = $(__e.target).closest('.works-menu-list');

			if( Modernizr.touch && __e.type=='touchend' ){
				if( $tmpParent.hasClass('act') ){
					that._deactList($tmpParent.index(), false);
					MainRef.app.router.navigate( $tmpParent.find('.wml-cir-small-text').attr('href'), {trigger: true, replace:false} );
				}else{
					that._actList($tmpParent.index());
				}

			}else if( !Modernizr.touch && __e.type=='mousedown' ) {
				var current = new Date().getTime();
				var delta = current - this.lastClickTime;
				if (delta < 200) {
				} else {
					if( $tmpParent.hasClass('act') ){
						that._deactList($tmpParent.index(), false);
						MainRef.app.router.navigate( $tmpParent.find('.wml-cir-small-text').attr('href'), {trigger: true, replace:false} );

					}else{
						that._actList($tmpParent.index());
					}
				}
				this.lastClickTime = current;
			}
			
			
			return false;
			
		},
		_onTouchStContainer:function(__e){
			if( !Modernizr.touch ) return false;
			var that = this;
			if( $(__e.target).hasClass('works-menu-container') ){
				// that._deactAllList();
				that._deactList(that.curIdx);
			}else{
			}
		},
		_onTouchMenuList:function(__e){
			if( !Modernizr.touch ) return false;
			var that = this;
			if( $(__e.target).hasClass('wml-cir-click') ){
			}else{
				if($(__e.target).closest('.works-menu-list').hasClass('act')){
				}else{
					// this._deactAllList();
					that._deactList(that.curIdx);
				}
			}

		}
	});

	return WorkBaseView;
});