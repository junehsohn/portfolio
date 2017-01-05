define(['jquery','backbone','handlebars', 'tweenMax', 'iscroll','modernizr','mainRef','mainApp','polygon', 'autoMata','workCollection','workModel','text!commercialDetailTemplate'], 
function ($, Backbone, Handlebars, TweenMax, ISCR, Modernizr, MainRef, App, Polygon, AutoMata, WorkCollection, WorkModel, commercialDetailTemplate) {
	'use strict';

	var CommercialDetailView = Backbone.View.extend({
		el:'.proj-panel-container',
		bgColor:'#000000',
		templateId:'#project-template',
		parentView:null,
		clientPoint:[{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0}],
		clientLineStArr:[0,1,2,2,4,0], 
		clientLineEndArr:[1,4,0,3,2,4], 
		contribPoint:[{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0}],
		contribLineStArr:[0,1,2,3,4,5,1,5,4,2], 
		contribLineEndArr:[1,2,3,4,5,1,3,2,2,0], 
		sumaryPoint:[{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0}],
		sumaryLineStArr:[0,1,2,3,4,5], 
		sumaryLineEndArr:[3,3,4,2,1,1], 
		clientTimeLine:null,
		contribTimeLine:null,
		summaryTimeLine:null,
		contribTimeLineTimer:null,
		summaryTimeLineTimer:null,
		parseHTML:null,
		resizeTimer:null,
		imgRollinTimer:null,
		imgRollinCnt:0,
		imgRollinTotal:0,
		iscrollV:null,
		isReady:false,
		events:{
		},
		mesh:{
			width: 0.25,
			height: 1.25,
			depth: 8,
			segments: 3,
			slices: 5,
			xRange: 0.64,
			yRange: 0.17,
			zRange: 1.0,
			ambient: '#614F16',
			diffuse: '#d0c08c',
			speed: 0.0005
		},
		light:{
			ambient: '#d0c08c',
			diffuse: '#614F16',
		},
		template:null,
		polygon:null,
		initialize:function(){
			var that = this;
			that.isReady = false;
			that.template = Handlebars.compile($(commercialDetailTemplate).html());

		},
		destroy: function(){
			//this.model.destroy();
			var that = this;
			that.isReady = false;
			that._stopRollingImgs();
			clearTimeout(that.contribTimeLineTimer);
			clearTimeout(that.summaryTimeLineTimer);
			$(window).off('resize', that.resize.bind(that));
			if(that.iscrollV){
				that.iscrollV.off('scroll');
				that.iscrollV.destroy();
				that.iscrollV = null;
			}
			if(that.polygon) that.polygon.stopAnimate();
			that._stopClientAni();
			that._stopContribAni();
			that._stopSummaryAni();
			that.off();
			// that.undelegateEvents();
			// that.remove();
		},
		remove: function(){
			this.$el.remove();
			Backbone.View.prototype.remove.apply(this, arguments);

		},
		render:function(){
			var that = this, $d, tmpModel = that.model.toJSON();
			$('.body-container').css({'cursor':'row-resize'});
			that.isReady = false;
			that._stopRollingImgs();
			clearTimeout(that.contribTimeLineTimer);
			clearTimeout(that.summaryTimeLineTimer);
			that.imgRollinTimer = null;
			that.contribTimeLineTimer = null;
			that.summaryTimeLineTimer = null;

			that.imgRollinCnt = 0;
			that.imgRollinTotal = tmpModel.imgLarge.length;

			that.$el.html(that.template(tmpModel));
			that.isReady = true;
			$('.s2-img').each(function(__idx){
				if(__idx==that.imgRollinCnt){
				}else{
					$(this).css({'opacity':'0'});
				}
			});
			that.show();
	        that.parseHTML = that.$el.html();
	        $d = this._startAni();
	        return $d;

		},
		show:function(){
			this._beforeSetup();
			this._drawPolygon();
			this._align();
	        // this.resize(0);
		},
		hide:function(){
			var that = this,
				$pBar = this.$el.find('.polygon-bar'),
				$d = $.Deferred();

			that.polygon.stopAnimate();
			$pBar.stop().delay(300).transition({scaleX:0,scaleY:1.2},700,'easeInOutCubic', function(){
				
			});

			$('.bg-star').delay(900).transition({opacity:0},200,'easeInCubic');
			$('.bg-black').delay(900).transition({opacity:0},200,'easeInCubic', function(){
				that.parentView.destroy();
				$d.resolve();
			});

			$('.article-container').delay(0).transition({opacity:0},300,'easeInOutCubic', function(){
				
			});
			
			return $d;
		},
		resize:function(__dly){
			var that = this,
				wid = $(window).width(),
				hei = $(window).height(),
				dly = (__dly)?__dly:350;

			that._align();
			if(that.polygon){
				if(wid<800){
					that.mesh.width = 0.45;
					that.mesh.xRange = 1.5;
					that.mesh.yRange = 0.37;
					that.mesh.segments = 2;
					that.mesh.slices = 3;
				}else{
					that.mesh.width = 0.25;
					that.mesh.xRange = 0.64;
					that.mesh.yRange = 0.17;
					that.mesh.segments = 3;
					that.mesh.slices = 5;
				}

				that.polygon.createMesh(that.mesh);
			}
		},
		_onScroll:function(){
			var that = this;

			that.iscrollV  = new IScroll(
				'.article-container', 
				{ scrollX: false, scrollY: true, bounce:true, scrollbars:'custom', fadeScrollbars:true, mouseWheel: true, click: true, tab: true ,probeType: 3/*, 
				    indicators: [{
						el: $('.polygon-bar')[0],
						resize: true,
						ignoreBoundaries: true,
						speedRatioY: 0.2
					}]*/
				});
			that.iscrollV.on('scroll', function(){
				// var tmpPer = Math.abs(this.x)/(Math.abs($('ul.works-menu').width()-$(window).width()))*100;
				// $('.work-prog-bar').css('width', tmpPer+'%');
			});
		},
		_beforeSetup:function(){
			var that = this, tmpModel = that.model.toJSON();
			that.mesh.ambient = tmpModel.mesh.ambient;
			that.mesh.diffuse = tmpModel.mesh.diffuse;
			that.light.ambient = tmpModel.light.ambient;
			that.light.diffuse = tmpModel.light.diffuse;
		},
		_drawPolygon:function(){
			this.polygon = MainRef.app.viewManager.setGlobalPolygon( {container:$('.commercial-project .polygon-bar')[0], output:$('.commercial-project .poly-vertical')[0]} );
			this.polygon.createMesh({mesh:this.mesh});
			this.polygon.createLights({light:this.light});
			this.polygon.updateRender();
		},
		_startAni:function(){
			var that = this,
				$pBar = this.$el.find('.polygon-bar'),
				$d = $.Deferred();

			that.polygon.animate();
			$pBar.stop().css({scaleX:0,scaleY:1.7}).delay(550).transition({scaleX:1,scaleY:1.1,opacity:0.9},2100,'easeInOutCubic');


			that._startClientAni();
			that.contribTimeLineTimer = setTimeout(function(){
				that._startContribAni();
			}, 2500);
			that.summaryTimeLineTimer = setTimeout(function(){
				that._startSummaryAni();
			}, 5000);
			that._startRollingImgs();

			that.$el.find('.client').css({'opacity':1});
			that.$el.find('.article-container-noise').css({'opacity':0}).delay(300).transition({'opacity':0.05},600,'easeInOutCubic');

			that.$el.find('.client h3').css({opacity:0}).delay(2100).transition({opacity:1},600,'easeInOutCubic');
			that.$el.find('.contrib h3').css({opacity:0}).delay(2200).transition({opacity:1},600,'easeInOutCubic');
			that.$el.find('.summary h3').css({opacity:0}).delay(2300).transition({opacity:1},600,'easeInOutCubic');

			$d.resolve();
			return $d;
		},
		_startRollingImgs:function(){
			var that = this,
				$imgs = that.$el.find('.s2-img'),
				prevCnt;

			if($imgs.length<=1){}else{
				
				that.imgRollinTimer = setInterval(function(){
					++that.imgRollinCnt;
					if(that.imgRollinCnt>=that.imgRollinTotal){
						that.imgRollinCnt = 0;
					}
					prevCnt = that.imgRollinCnt-1;
					if(prevCnt<0){
						prevCnt = that.imgRollinTotal-1;
					}
					$imgs.eq(prevCnt).css({'opacity':1}).transition({opacity:0},600);
					$imgs.eq(that.imgRollinCnt).css({'opacity':0}).transition({opacity:1},600, function(){
					});

				}, 4500);
			}
		},
		_stopRollingImgs:function(){
			var that = this;
			clearInterval(that.imgRollinTimer);
		},
		_align:function(){
			var that = this,
				wid = $(window).width(),
				hei = $(window).height(),
				titleMarginLeft = 8,
				$client = that.$el.find('.client'),
				$clientTitle = $client.find('h3'),
				$clientSvg = $client.find('svg'),
				$contrib = that.$el.find('.contrib'),
				$contribTitle = $contrib.find('h3'),
				$summary = that.$el.find('.summary'),
				$summaryTitle = $summary.find('h3');

			that._setClientPosition(wid, hei);
			that._setContribPosition(wid, hei);
			that._setSummaryPosition(wid, hei);
			that._resetHeight();

			if(that.iscrollV){
				that.iscrollV.refresh();
			}else{
				that._onScroll();
			}

			if($('.iScrollVerticalScrollbar')[0]){
				$('.iScrollVerticalScrollbar').css({'right':parseInt(wid*0.5-$('.iScrollVerticalScrollbar').width()*0.5)+'px'});
			}

		},
		_setClientPosition:function(__wid, __hei){
			var that = this,
				titleMarginLeft = 8,
				contentHei = $('.article-container-inner').height(),
				$client = that.$el.find('.client'),
				$clientTitle = $client.find('h3'),
				$clientSvg = $client.find('svg'),
				titleX,
				wid=__wid, hei=__hei,
				i, iTotal = that.clientPoint.length;

			$clientSvg.attr({'width':__wid, 'height':contentHei});
			that._setClientPoint(__wid, __hei);
			that._drawClientPoint(that.clientPoint);
			that._drawClientLineByPoint(that.clientPoint);

			$('#s1-t').attr({
				x: that.clientPoint[2].x-parseInt($('#s1-t')[0].getBBox().width)-parseInt($('#s1-c-3').attr('r')*2), 
				y: that.clientPoint[2].y+parseInt($('#s1-t')[0].getBBox().height)*0.25,
			});
			titleX = parseInt( __wid/2-$clientTitle.width()-titleMarginLeft*3 );
			$clientTitle.css({'left':titleX+'px', 'opacity':1 });
		},
		_setClientPoint:function(__wid, __hei){
			var that = this,
				$client = that.$el.find('.client'),
				$clientTitle = $client.find('h3'),
				wid=__wid, hei=__hei,
				i, iTotal = that.clientPoint.length,
				distX, distY, distXArr=[], distYArr=[];

			if(wid>=800){
				distX = parseInt(wid/2);
				distY = parseInt( parseInt($clientTitle.css('top')) + ($clientTitle.height()/2+$clientTitle.height()/2*0.25) );
				distXArr = [distX, 243, 353, 213, 73];
				distYArr = [distY, -99, 81, 261, 181];
			}else {
				distX = parseInt(wid/2);
				distY = parseInt( parseInt($clientTitle.css('top')) + ($clientTitle.height()/2+$clientTitle.height()) );
				distXArr = [distX, 93, 70, -40, -125];
				distYArr = [distY, 141, 240, 300, 200];
			}

			iTotal = distXArr.length;
			for(i=0; i<iTotal; ++i){
				if(i==0){
					that.clientPoint[i].x = distX;
					that.clientPoint[i].y = distY;
				}else{
					that.clientPoint[i].x = distX+distXArr[i];
					that.clientPoint[i].y = distY+distYArr[i];
				}
			}

			distYArr = null;
			distYArr = null;
		},
		_drawClientPoint:function(__clientPoint){
			var that = this,
				i, iTotal = __clientPoint.length;

			for(i=0; i<iTotal; ++i){
				$('#s1-c-'+(i+1)).attr({'cx':__clientPoint[i].x, 'cy':__clientPoint[i].y, 'data-x':__clientPoint[i].x, 'data-y':__clientPoint[i].y, 'data-r':$('#s1-c-'+(i+1)).attr('r') });
			}

			iTotal = that.clientLineEndArr.length;
			for(i=0; i<iTotal; ++i){
				$('#s1-l-'+(i+1)).attr({'data-x':__clientPoint[that.clientLineEndArr[i]].x, 'data-y':__clientPoint[that.clientLineEndArr[i]].y});
			}
		},
		_drawClientLineByPoint:function(__clientPoint){
			var that = this, 
				i, iTotal = __clientPoint.length;

			for(i=0; i<iTotal; ++i){
				$('#s1-l-'+(i+1)).attr({'x1':__clientPoint[i].x, 'y1':__clientPoint[i].y});
			}

			iTotal = that.clientLineStArr.length;
			for(i=0; i<iTotal; ++i){
				$('#s1-l-'+(i+1)).attr({'x1':__clientPoint[that.clientLineStArr[i]].x, 'y1':__clientPoint[that.clientLineStArr[i]].y, 
										'x2':__clientPoint[that.clientLineEndArr[i]].x, 'y2':__clientPoint[that.clientLineEndArr[i]].y});
			}
		},
		_startClientAni:function(){
			var that = this,
				dur=0.7,
				tmpDlyArr=[0.05, 0.08, 0.1, 0.08, 0.08, 0.1],
				len = tmpDlyArr.length,
				$client = that.$el.find('.client'),
				onUpdate = function(){
				};

			that._stopClientAni();
			that.clientTimeLine = new TimelineMax({onUpdate:onUpdate, onComplete:function(){
				that._setClientPosition( $(window).width(), $(window).height() );
			}});

			$('.s1-l').each(function(idx){
				if(idx==5){
					$(this).attr( {x1:that.clientPoint[0].x, y1:that.clientPoint[0].y, x2:that.clientPoint[0].x, y2:that.clientPoint[0].y} );
				}else if(idx==3){
					$(this).attr( {x1:that.clientPoint[2].x, y1:that.clientPoint[2].y, x2:that.clientPoint[2].x, y2:that.clientPoint[2].y} );
				}else{
					$(this).attr( {x1:that.clientPoint[idx].x, y1:that.clientPoint[idx].y, x2:that.clientPoint[idx].x, y2:that.clientPoint[idx].y} );
				}
			});

			that.clientTimeLine.set( $('.s1-c'), {attr:{r:0}} )
							   .set( $('#s1-t'), {opacity:0} );
			for( var i=0; i<len; ++i ){
				if(i==0){
					that.clientTimeLine.to( $('#s1-c-'+(i+1)), dur, {ease:Sine.easeInOut, delay:tmpDlyArr[i], attr:{r:parseInt($('#s1-c-'+(i+1)).attr('data-r')) }} , "+=2.2" );
				}else if(i==2){
					that.clientTimeLine.to( $('#s1-c-'+(i+1)), dur*1.5, {ease:Sine.easeOut, delay:tmpDlyArr[i], attr:{r:parseInt($('#s1-c-'+(i+1)).attr('data-r')) }} , "-="+dur );
				}else if(i<5){
					that.clientTimeLine.to( $('#s1-c-'+(i+1)), dur, {ease:Sine.easeInOut, delay:tmpDlyArr[i], attr:{r:parseInt($('#s1-c-'+(i+1)).attr('data-r')) }} , "-="+dur );
				}
				that.clientTimeLine.to( $('#s1-l-'+(i+1)), 
										dur, {ease:Cubic.easeIn, delay:0, 
										 	  attr:{ x2:parseInt($('#s1-l-'+(i+1)).attr('data-x')), y2:parseInt($('#s1-l-'+(i+1)).attr('data-y')) }}, "-="+dur );
			}
			that.clientTimeLine.to( $('#s1-c-3'), dur*2, {ease:Back.easeInOut, delay:tmpDlyArr[0], attr:{'stroke-width':30}} , "-=0.5" );
			that.clientTimeLine.to( $('#s1-t'), dur*0.5, {ease:Cubic.easeIn, opacity:1}, "-=0.8" );
			that.clientTimeLine.pause();
			$client.find('svg').css({opacity:1});
			that.clientTimeLine.restart();

			tmpDlyArr = null;
		},
		_stopClientAni:function(){
			if(this.clientTimeLine){
				this.clientTimeLine.kill();
				this.clientTimeLine = null;
			}
		},

		//
		_setContribPosition:function(__wid, __hei){
			var that = this,
				titleMarginLeft = 8,
				contentHei = $('.article-container-inner').height(),
				$contrib = that.$el.find('.contrib'),
				$contribTitle = $contrib.find('h3'),
				$contribSvg = $contrib.find('svg'),
				titleX,
				wid=__wid, hei=__hei,
				i, iTotal = that.contribPoint.length;

			
			$contribSvg.attr({'width':__wid, 'height':contentHei});
			that._setContribPoint(__wid, __hei);
			that._drawContribPoint(that.contribPoint);
			that._drawContribLineByPoint(that.contribPoint);

			titleX = parseInt( titleMarginLeft*3 );
			$contribTitle.css({'left':'calc(50% + '+titleX+'px)', 'opacity':1 });

		},
		_setContribPoint:function(__wid, __hei){
			var that = this,
				$contrib = that.$el.find('.contrib'),
				$contribTitle = $contrib.find('h3'),
				wid=__wid, hei=__hei,
				i, iTotal = that.contribPoint.length,
				distX, distY, distXArr=[], distYArr=[];

			if(wid>=800){
				distX = parseInt(wid/2);
				distY = parseInt( parseInt($contribTitle.css('top')) + ($contribTitle.height()/2+$contribTitle.height()/2*0.25) );
				distXArr = [distX, -241, -51, -88, -297, -365];
				distYArr = [distY, -38, 91, 236, 290, 172];
			}else{
				distX = parseInt(wid/2);
				distY = parseInt( parseInt($contribTitle.css('top')) + ($contribTitle.height()/2+$contribTitle.height()) );
				distXArr = [distX, -17, 107, 88, -42, -100];
				distYArr = [distY, 107, 174, 331, 364, 237];
			}

			iTotal = distXArr.length;
			for(i=0; i<iTotal; ++i){
				if(i==0){
					that.contribPoint[i].x = distX;
					that.contribPoint[i].y = distY;
				}else{
					that.contribPoint[i].x = distX+distXArr[i];
					that.contribPoint[i].y = distY+distYArr[i];
				}
			}
			distXArr=null;
			distYArr=null;
		},
		_drawContribPoint:function(__contribPoint){
			var that = this,
				i, iTotal = __contribPoint.length, 
				tmpModel = that.model.toJSON(),
				tmpLineEndArr = that.contribLineEndArr, 
				tmpActCirArr=[1,5,3,4,2], 
				tmpX, tmpY, tmpRad, $tmpCir, $tmpRole, $tmpPer;

			iTotal = __contribPoint.length;
			for(i=0; i<iTotal; ++i){
				$('#c1-c-'+(i+1)).attr({'cx':__contribPoint[i].x, 'cy':__contribPoint[i].y, 'data-x':__contribPoint[i].x, 'data-y':__contribPoint[i].y, 'data-r':$('#c1-c-'+(i+1)).attr('r') });
			}

			iTotal = tmpLineEndArr.length;
			for(i=0; i<iTotal; ++i){
				$('#c1-l-'+(i+1)).attr({'data-x':__contribPoint[tmpLineEndArr[i]].x, 'data-y':__contribPoint[tmpLineEndArr[i]].y});
			}

			iTotal = tmpModel.contribution.length;
			for(i=0; i<iTotal; ++i){
				$tmpCir = $('.c1-c:eq('+tmpActCirArr[i]+')');
				$tmpRole = $('.role:eq('+i+')');
				$tmpPer = $('.per:eq('+i+')');
				tmpX = parseInt( $tmpCir.attr('cx') );
				tmpY = parseInt( $tmpCir.attr('cy') );
				tmpRad = 26 ;

				$tmpCir.attr({'r':tmpRad, 'stroke-width':10, 'fill':'black', 'stroke':'white', 'data-r':tmpRad});
				$tmpRole.attr({ 'x':(tmpX-parseInt($tmpRole[0].getBBox().width/2)), 'y':(tmpY-tmpRad-15) });
				$tmpPer.attr({ 'x':(tmpX-parseInt($tmpPer[0].getBBox().width/2)), 'y':(tmpY+4) });
			}
			tmpActCirArr = null;
		},
		_drawContribLineByPoint:function(__contribPoint){
			var that = this, 
				i, iTotal, 
				tmpLineStArr = that.contribLineStArr, 
				tmpLineEndArr = that.contribLineEndArr;

			iTotal = tmpLineStArr.length;
			for(i=0; i<iTotal; ++i){
				$('#c1-l-'+(i+1)).attr({'x1':__contribPoint[tmpLineStArr[i]].x, 'y1':__contribPoint[tmpLineStArr[i]].y, 'x2':__contribPoint[tmpLineEndArr[i]].x, 'y2':__contribPoint[tmpLineEndArr[i]].y});
			}
		},
		_startContribAni:function(){
			var that = this,
				dur=0.7,
				tmpDlyDefault=2.5,
				tmpDlyArr=[0.05, 0.08, 0.1, 0.08, 0.08, 0.1, 0.05, 0.08, 0.1, 0.08],
				tmpLineStArr = that.contribLineStArr, 
				tmpLineEndArr = that.contribLineEndArr, 
				i, iTotal = tmpDlyArr.length,
				$contrib = that.$el.find('.contrib'),
				onUpdate = function(){
				};
				
			that._stopContribAni();
			that.contribTimeLine = new TimelineMax({delay:tmpDlyDefault, onUpdate:onUpdate, onComplete:function(){
				that._setContribPosition( $(window).width(), $(window).height() );
			}});

			$('.c1-l').each(function(idx){
				$(this).attr( {x1:that.contribPoint[tmpLineStArr[idx]].x, y1:that.contribPoint[tmpLineStArr[idx]].y, 
							   x2:that.contribPoint[tmpLineStArr[idx]].x, y2:that.contribPoint[tmpLineStArr[idx]].y} );
			});

			that.contribTimeLine.set( $('.c1-c'), {attr:{r:0}} )
								.set( $('.contrib-name'), {opacity:0} );

			iTotal = tmpDlyArr.length;
			for( i=0; i<iTotal; ++i ){
				if(i==0){
					that.contribTimeLine.to( $('#c1-c-'+(i+1)), dur, {ease:Sine.easeInOut, delay:tmpDlyArr[i], attr:{r:parseInt($('#c1-c-'+(i+1)).attr('data-r')) }} , "+=2.2" );
				}else{
					that.contribTimeLine.to( $('#c1-c-'+(i+1)), dur, {ease:Sine.easeInOut, delay:tmpDlyArr[i], attr:{r:parseInt($('#c1-c-'+(i+1)).attr('data-r')) }} , "-="+dur );
				}
				that.contribTimeLine.to( $('#c1-l-'+(i+1)), 
										dur, {ease:Cubic.easeIn, delay:tmpDlyArr[i], 
										 	  attr:{ x2:parseInt($('#c1-l-'+(i+1)).attr('data-x')), y2:parseInt($('#c1-l-'+(i+1)).attr('data-y')) }}, "-="+dur );
			}
			that.contribTimeLine.to( $('.contrib-name'), dur*0.5, {ease:Cubic.easeIn, opacity:1}, "-=0.5" );
			that.contribTimeLine.pause();
			$contrib.find('svg').css({opacity:1});
			that.contribTimeLine.restart();

			tmpDlyArr = null;
		},
		_stopContribAni:function(){
			if(this.contribTimeLine){
				this.contribTimeLine.kill();
				this.contribTimeLine = null;
			}
		},



		_setSummaryPosition:function(__wid, __hei){
			var that = this,
				titleMarginLeft = 8,
				contentHei = $('.article-container-inner').height(),
				$client = that.$el.find('.summary'),
				$imgCont = $client.find('.s2-imgs-container'),
				$clientTitle = $client.find('h3'),
				$clientSvg = $client.find('svg'),
				titleX,
				imgContWid = (__wid<800) ? ((__wid*0.75>652)?652:__wid*0.75) : 652, 
				imgContHei = parseInt(imgContWid*0.59662577),
				wid=__wid, hei=__hei,
				i, iTotal = that.sumaryPoint.length;

			$clientSvg.attr({'width':__wid, 'height':contentHei});
			$imgCont.css({'width':imgContWid+'px', 'height':imgContHei+'px', 'left':parseInt((__wid-imgContWid)*0.5)+'px'});
			if(wid>800){
				$('.s2-imgs-wrapper').css({'width':parseInt(imgContWid-40)+'px', 'height':parseInt(imgContHei-40)+'px'});
				$('.s2-img').css({'width':parseInt(imgContWid-40)+'px', 'height':parseInt(imgContHei-40)+'px'});
				$('.s2-img-bg').css({'width':parseInt(imgContWid-40)+'px', 'height':parseInt(imgContHei-40)+'px'});
				$('.s2-img-light').css({'width':parseInt(imgContWid-40)+'px', 'height':parseInt(imgContHei-40)+'px'});
			}else{
				$('.s2-imgs-wrapper').css({'width':parseInt(imgContWid-20)+'px', 'height':parseInt(imgContHei-20)+'px'});
				$('.s2-img').css({'width':parseInt(imgContWid-20)+'px', 'height':parseInt(imgContHei-20)+'px'});
				$('.s2-img-bg').css({'width':parseInt(imgContWid-20)+'px', 'height':parseInt(imgContHei-20)+'px'});
				$('.s2-img-light').css({'width':parseInt(imgContWid-20)+'px', 'height':parseInt(imgContHei-20)+'px'});
			}

			that._setSummaryPoint(__wid, __hei);
			that._drawSummaryPoint(that.sumaryPoint);
			that._drawSummaryLineByPoint(that.sumaryPoint);
			
			titleX = parseInt( __wid/2-$clientTitle.width()-titleMarginLeft*3 );
			$clientTitle.css({'left':titleX+'px', 'opacity':1 });
		},
		_setSummaryPoint:function(__wid, __hei){
			var that = this,
				$client = that.$el.find('.summary'),
				$imgCont = $client.find('.s2-imgs-container'),
				$txtCont = $client.find('.summary-text'),
				$clientTitle = $client.find('h3'),
				wid=__wid, hei=__hei,
				i, iTotal = that.sumaryPoint.length,
				distX, distY, gap, gapTxt, gapY, txtCont=0, addedX, fontSize = parseInt($txtCont.css('fontSize')),
				$sumLast = $('.summary-text:last'), summaryHei,
				imgTop, imgLeft = parseInt($imgCont.css('left')), imgWid = $imgCont.width(), imgHei = $imgCont.height(), 
				distXArr=[], distYArr=[];

			if(wid>=800){
				gap = gapTxt = 15;
				gapY =0;
				distX = parseInt(wid/2);
				distY = parseInt( parseInt($clientTitle.css('top')) + ($clientTitle.height()/2+$clientTitle.height()/2*0.25) );
				imgTop = parseInt(distY+80);
			}else {
				gap = 10;
				gapTxt = 18;
				gapY =30;
				distX = parseInt(wid/2);
				distY = parseInt( parseInt($clientTitle.css('top')) + ($clientTitle.height()/2+$clientTitle.height()) );
				imgTop = parseInt(distY+45);
			}
			
			$txtCont.each(function(idx){
				if(idx==0){
					txtCont = parseInt(txtCont+imgTop+imgHei+gapTxt*10);
				}else{
					txtCont = parseInt($txtCont.eq(idx-1).height()+parseInt($txtCont.eq(idx-1).css('top'))+100);
				}

				if(idx%2==0){
					$(this).addClass('right');
					addedX = -10;
				}else{
					$(this).addClass('left');
					addedX = -15;
				}

				$(this).css({ 'width':($imgCont.width())+'px',
							  'height':parseInt( $(this).find('.summary-text-line').length*fontSize*1.4 )+'px', 
							  'top':txtCont+'px', 
							  'left':parseInt( (__wid-$imgCont.width())*0.5+addedX )+'px'
				});

				$(this).find('.summary-text-line').each(function(__idx){
					$(this).css({'width':($imgCont.width())+'px', 'top':parseInt( __idx*(fontSize*1.6) )+'px'});
				});
				
			});

			summaryHei = $sumLast.height()+parseInt($sumLast.css('top'));
			$('.visit-site').css({'top':(summaryHei+100)+'px', 'right':parseInt( (__wid-$imgCont.width())*0.5-10 )+'px', width:parseInt(imgWid)+'px'});
			$imgCont.css({'top':parseInt(imgTop+gapY)+'px', 'left':parseInt( (__wid-$imgCont.width())*0.5 )+'px'});

			distXArr = [distX, imgLeft-gap, imgLeft+imgWid+gap, imgLeft+imgWid+gap, imgLeft-gap, distX];
			distYArr = [distY+gapY, imgTop-gap+gapY, imgTop-gap+gapY, imgTop+imgHei+gap+gapY, imgTop+imgHei+gap+gapY,  parseInt(imgTop+imgHei+gap*6)+gapY];

			iTotal = distXArr.length;
			for(i=0; i<iTotal; ++i){
				that.sumaryPoint[i].x = distXArr[i];
				that.sumaryPoint[i].y = distYArr[i];
			}

			distXArr = null;
			distYArr = null;
		},
		_drawSummaryPoint:function(__summaryPoint){
			var that = this,
				i, iTotal = __summaryPoint.length,
				w = $(window).width;


			for(i=0; i<iTotal; ++i){
				$('#s2-c-'+(i+1)).attr({'cx':__summaryPoint[i].x, 'cy':__summaryPoint[i].y, 'data-x':__summaryPoint[i].x, 'data-y':__summaryPoint[i].y, 'data-r':$('#s2-c-'+(i+1)).attr('r') });
			}

			iTotal = that.sumaryLineStArr.length;
			for(i=0; i<iTotal; ++i){
				$('#s2-l-'+(i+1)).attr({'data-x':__summaryPoint[that.sumaryLineEndArr[i]].x, 'data-y':__summaryPoint[that.sumaryLineEndArr[i]].y});
			}
		},
		_drawSummaryLineByPoint:function(__summaryPoint){
			var that = this, 
				i, iTotal = __summaryPoint.length;

			for(i=0; i<iTotal; ++i){
				$('#s2-l-'+(i+1)).attr({'x1':__summaryPoint[i].x, 'y1':__summaryPoint[i].y});
			}

			iTotal = that.sumaryLineStArr.length;
			for(i=0; i<iTotal; ++i){
				$('#s2-l-'+(i+1)).attr({'x1':__summaryPoint[that.sumaryLineStArr[i]].x, 'y1':__summaryPoint[that.sumaryLineStArr[i]].y, 
										'x2':__summaryPoint[that.sumaryLineEndArr[i]].x, 'y2':__summaryPoint[that.sumaryLineEndArr[i]].y});
			}
		},
		_startSummaryAni:function(){
			var that = this,
				dur=0.7,
				tmpDlyArr=[0.05, 0.08, 0.09, 0.1, 0.11, 0.12],
				len = tmpDlyArr.length,
				$client = that.$el.find('.summary'),
				onUpdate = function(){
				};

			that._stopSummaryAni();
			that.summaryTimeLine = new TimelineMax({onUpdate:onUpdate, onComplete:function(){
				that._setSummaryPosition( $(window).width(), $(window).height() );
			}});

			$('.s2-l').each(function(idx){
				$(this).attr( {x1:that.sumaryPoint[idx].x, y1:that.sumaryPoint[idx].y, x2:that.sumaryPoint[idx].x, y2:that.sumaryPoint[idx].y} );
			});

			that.summaryTimeLine.set( $('.s2-c'), {attr:{r:0}} )
							   .set( $('#s2-t'), {opacity:0} );
			for( var i=0; i<len; ++i ){
				if(i==0){
					that.summaryTimeLine.to( $('#s2-c-'+(i+1)), dur, {ease:Sine.easeInOut, delay:tmpDlyArr[i], attr:{r:parseInt($('#s2-c-'+(i+1)).attr('data-r')) }} , "+=2.2" );
				}else{
					that.summaryTimeLine.to( $('#s2-c-'+(i+1)), dur*1.5, {ease:Sine.easeOut, delay:tmpDlyArr[i], attr:{r:parseInt($('#s2-c-'+(i+1)).attr('data-r')) }} , "-="+dur );
				}
				that.summaryTimeLine.to( $('#s2-l-'+(i+1)), 
										dur, {ease:Cubic.easeIn, delay:0, 
										 	  attr:{ x2:parseInt($('#s2-l-'+(i+1)).attr('data-x')), y2:parseInt($('#s2-l-'+(i+1)).attr('data-y')) }}, "-="+dur );
			}
			that.summaryTimeLine.to( $('#s2-t'), dur*0.5, {ease:Cubic.easeIn, opacity:1}, "-=0.8" );
			that.summaryTimeLine.pause();
			$client.find('svg').css({opacity:1});
			that.summaryTimeLine.restart();

			tmpDlyArr = null;
		},
		_stopSummaryAni:function(){
			if(this.summaryTimeLine){
				this.summaryTimeLine.kill();
				this.summaryTimeLine = null;
			}
		},
		_resetHeight:function(){
			var that = this, h=0, $sumLast = $('.summary-text:last'), summaryHei = $sumLast.height()+parseInt($sumLast.css('top'))+200;

			$sumLast.closest('.summary').css({'height':(summaryHei)+'px'});
			h = $('.client').height()+$('.contrib').height()+summaryHei;
			$('.article-container-inner').css({'height':h+'px'});
		}

	});

	return CommercialDetailView;
});



























