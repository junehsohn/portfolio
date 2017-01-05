
define(['jquery','backbone','handlebars','modernizr','mainRef','mainApp', 'autoMata', 'commercialDetailView', 'workCollection','workModel','text!commercialProjectTemplate'], 
function ($, Backbone, Handlebars, Modernizr, MainRef, App, AutoMata ,CommercialDetailView , WorkCollection, WorkModel, commercialProjectTemplate) {
	'use strict';

	var CommercialProjectView = Backbone.View.extend({
		el:'.section-container',
		bgColor:'#000000',
		templateId:'#commercial-project-template',
		autoMataArr:[],
		detailView:null,
		parseHTML:null,
		resizeTimer:null,
		autoMataDelayTimer:null,
		autoMataTimer:null,
		detailViewShowTimer:null,
		isReady:false,
		isActPrevPage:false,
		isActDetailPage:false,
		events:{
			'click .close-btn':'_onClose',
			'click .more-btn':'_onShowDetail'
		},
		template:null,
		initialize:function(){
			var that = this;
			that.template = Handlebars.compile($(commercialProjectTemplate).html());
		},
		destroy: function(){
			var that = this;
			this._stopAutoMata();
			clearTimeout(that.detailViewShowTimer);
			$(window).off('resize', that.resize.bind(that));
			that.off();
			if(that.detailView) {
				that.detailView.destroy();
			}
			// that.remove();
		},
		remove: function(){
			this.$el.remove();
			Backbone.View.prototype.remove.apply(this, arguments);

		},
		render:function(){
			var that = this, $d, replaceHtml='', strArr, i, iTotal, tmpModel = that.model.toJSON();
			$('.body-container').css({'cursor':'default'});
			that.isActPrevPage = false;
			that.isActDetailPage = false;
			that.$el.html(that.template(tmpModel));
			if(that.detailView){
			}else{
				that.detailView = new CommercialDetailView();
			}
			that.detailView.setElement('.proj-panel-container');
			that.detailView.parentView = that;
			that.show();
	        that.parseHTML = that.$el.html();
	        $d = this._startAni();
	        return $d;
		},
		show:function(){
			this._beforeSetup();
			this._align();
	        // this.resize(0);
		},
		hide:function(){
			var that = this,
				$d = $.Deferred();

			if(that.isActPrevPage && !that.isActDetailPage){
				that.hidePrevPage($d);
			}else if(that.isActPrevPage && that.isActDetailPage && that.detailView){
				that.hidePrevPage();
				$d = that.detailView.hide();
			}

			$('.close-btn').transition({opacity:0},300,'easeInOutCubic', function(){
				$('.close-btn').css('display','none');
			});

			return $d;
		},
		hidePrevPage:function(__$d){
			var that = this,
				completeFnc = (__$d) ? function(){ that.destroy(); __$d.resolve(that); } : null,
				ang = (__$d) ? -180 : 360,
				dur = 800,
				tmpScale = (__$d) ? 0.5 : 0;

			this._stopAutoMata();
			$('.txt-line').transition({scaleX:0},300,'easeOutCubic');
			$('.txt-copy').transition({opacity:0},300,'easeInOutCubic');
			$('.more-btn').transition({scaleX:0,scaleY:0},300,'easeInOutCubic');
			$('.proj-title').transition({bottom: -0.5*parseInt($('.proj-title').css('fontSize'))+'px', opacity:0 },400,'easeInOutCubic');
			$('.proj-circle-inner').delay(300).transition({scaleX:tmpScale, scaleY:tmpScale, rotate:ang, opacity:0},dur,'easeInOutCubic', function(){
				$('.proj-prev-panel').css('display','none');
			});
			$('.proj-circle-color-inner').delay(300).transition({scaleX:tmpScale, scaleY:tmpScale, opacity:0},dur,'easeInOutCubic', completeFnc);
		},
		resize:function(__dly){
			var that = this,
				wid = $(window).width(),
				hei = $(window).height(),
				dly = (__dly)?__dly:350;

			clearTimeout(this.resizeTimer);
			this.resizeTimer = setTimeout(function(){
				that._align();
				if(that.detailView && that.detailView.isReady==true) that.detailView._align();
			}, dly);
			
		},
		_beforeSetup:function(){
			$('.commercial-project').css({opacity:0});

			var amArrLen = this.autoMataArr.length,
				anyCopyLen = $('.inner-ani-copy').length,
				i, iTotal;

			this._stopAutoMata();

			if(anyCopyLen>amArrLen){
				iTotal = anyCopyLen-amArrLen;
				for(i=0; i<iTotal; ++i){
					this.autoMataArr.push(new AutoMata());
				}
			}

		},
		_startAutoMata:function(__speed){
			var that = this,
				s = (__speed)?__speed:70,
				anyCopyLen = $('.inner-ani-copy').length, 
				chk = true;

			if(anyCopyLen>0){
				$('.inner-ani-copy').each(function(__idx){
					that.autoMataArr[__idx].reset( $(this).attr('data-str'), $(this), 0 );
				});

				that.autoMataTimer = setInterval(function(){
					chk = true;
					$('.inner-ani-copy').each(function(__idx){
						if(!that.autoMataArr[__idx].isComplete()){
							chk = false;
							that.autoMataArr[__idx].render();
						}else{
						}

					});

					if(chk){
						$('.inner-ani-copy').each(function(__idx){
							$(this).empty();
							$(this).html( $(this).attr('data-str') );
						});
						clearInterval(that.autoMataTimer);
					}
				}, s);
				
			}
		},
		_stopAutoMata:function(){
			var amArrLen = this.autoMataArr.length,
				i, iTotal;

			clearTimeout(this.autoMataDelayTimer);
			clearInterval(this.autoMataTimer);

			if(amArrLen>0){
				iTotal = amArrLen;
				for(i=0; i<iTotal; ++i){
					this.autoMataArr[i].stop();
				}
			}
		},
		_startAni:function(){
			var that = this,
				$d;

			if(!that.isActPrevPage && !that.isActDetailPage){
				that.isActPrevPage = true;
				$d = that._startPrevPageAni();
			}

			return $d;
		},
		_startPrevPageAni:function(){
			var that = this,
				$d = $.Deferred();

			$('.txt-line:eq(1)').delay(800).css({transformOrigin:'0% 0%'});
			$('.txt-line').delay(800).css({scaleX:0}).transition({scaleX:1},800,'easeInOutCubic');
			$('.txt-copy').delay(800).css({opacity:1}).transition({opacity:1},800,'easeInOutCubic');
			$('.proj-circle-inner').delay(200)
								   .css({transformOrigin:'50% 50%', opacity:0, scaleX:0.8, scaleY:0.8, rotate:40})
								   .transition({opacity:1, scaleX:1, scaleY:1, rotate:180},1800,'easeOutCubic', function(){
								   		that.isReady = true;
								   		$d.resolve(that);

								   		//FIXME TEST
								   		//$('.more-btn').trigger('click');
								   });

			$('.proj-circle-color-inner').delay(200)
										 .css({transformOrigin:'50% 50%', opacity:0, scaleX:0.8, scaleY:0.8})
										 .transition({opacity:0.5, scaleX:1,scaleY:1},1800,'easeOutCubic', function(){

										});;

			$('.proj-title').delay(1000)
							.css({bottom: -1.2*parseInt($('.proj-title').css('fontSize'))+'px' })
							.transition({bottom:parseInt($('.proj-title').attr('data-bottom'))+'px'},800,'easeOutCubic', function(){
								
							});

			$('.more-btn').delay(2000).css({opacity:0,scaleX:0,scaleY:0}).transition({opacity:1,scaleX:1,scaleY:1},800,'easeInOutCubic');
			$('.commercial-project').css({opacity:1});
			$('.commercial-project').stop().delay(200).transition({opacity:1},800,'easeInOutCubic', function(){
			});

			this.autoMataDelayTimer = setTimeout(that._startAutoMata.bind(that), 1000);

			$('.close-btn').delay(800).css({opacity:0, transitionDuration:'0s'}).transition({opacity:1},800,'easeInOutCubic', function(){
				$('.close-btn').removeAttr('style');
			});
			return $d;
		},
		_startDetailPageAni:function(){
			var that = this,
				$d = $.Deferred();

			return $d;
		},
		_align:function(){
			var that = this,
				wid = $(window).width(),
				hei = $(window).height(),
				compareCirRad = (wid>hei)?hei:wid,
				cirRad = parseInt(compareCirRad*669/960,10),
				tmpCopyFontSize = parseInt(cirRad*48/669,10),
				tmpDateFontSize = tmpCopyFontSize,
				cirTop = parseInt( (hei-cirRad)*0.5 ),
				lineWid = parseInt( cirRad*0.5 ),
				lineHei = parseInt(tmpCopyFontSize*0.55),
				txtMarginTop = parseInt(tmpCopyFontSize*12/48),
				titleFontSize = parseInt(wid*272/1920),
				txtCopyWid,
				$txtCopyInner = $('.txt-copy-inner'),
				txtCopyInnerLen = $txtCopyInner.length,
				$cir = this.$el.find('.proj-circle'),
				$title = this.$el.find('.proj-title'),

				$copyKor = this.$el.find('.proj-copy-kor'),
				$txtCopy = $copyKor.find('.txt-copy'),
				$txtLine = $copyKor.find('.txt-line'),
				$dateCopy = $copyKor.find('.txt-date'),

				$projDate = this.$el.find('.proj-date'),
				$dateLine = $projDate.find('.txt-line');

			$cir.css({width:cirRad+'px', height:cirRad+'px', left:parseInt( (wid-cirRad)*0.5 )+'px', top:cirTop+'px'});
			$title.css({ fontSize:titleFontSize+'px'})
				  .css({ bottom:( titleFontSize*-50/173 )+'px' }).attr('data-bottom', parseInt(titleFontSize*-50/173)+'px');

			$copyKor.css({width:(lineWid)+'px'});
			$txtCopy.css({fontSize:tmpCopyFontSize+'px', width:(lineWid)+'px', top: (lineHei+txtMarginTop*3)+'px'});
			$txtCopyInner.css({height:(tmpCopyFontSize)+'px'});
			$txtCopyInner.each(function(__idx){
				if( txtCopyInnerLen-2==__idx ){
					$(this).css({top: 0, width:(wid)+'px', right:0, marginBottom:txtMarginTop*2+'px' });
				}else if( txtCopyInnerLen-1==__idx ){
					var tmpRad = 150*wid/1920;
					if(tmpRad<50) tmpRad = 50;
					$(this).css({width:(tmpRad)+'px', height:(tmpRad)+'px', fontSize:parseInt(tmpRad/2)+'px' });
				}else{
					$(this).css({top:0,width:(wid)+'px', right:0, marginBottom:txtMarginTop+'px' });
				}
			});
			$dateCopy.css({fontSize:(28*tmpCopyFontSize/38)+'px', top:'0px'});

			$txtLine.css({width:lineWid+'px', height:lineHei+'px'});
			$dateLine.css({width:lineWid+'px', height:lineHei+'px', top:(cirRad-(cirRad*63*2/669)-lineHei)+'px'});

			$copyKor.css({ top:parseInt(cirTop+(cirRad*63/669))+'px', left:parseInt(wid*0.5)+'px' });
			$projDate.css({ top:parseInt(cirTop+(cirRad*63/669))+'px', left:parseInt((wid*0.5)-$dateLine.width())+'px' });

		},
		_onClose:function(__e){
			__e.preventDefault();
			MainRef.app.router.navigate( '!/'+'work/'+( MainRef.app.config.workType() ), {trigger: true} );
			return false;
		},
		_onShowDetail:function(__e){
			var that = this;
			__e.preventDefault();
			that.hidePrevPage();

			clearTimeout(that.detailViewShowTimer);
			that.detailViewShowTimer = setTimeout(function(){
				clearTimeout(that.detailViewShowTimer);
				that.detailView.model = that.model;
				that.isActDetailPage = true;
				that.detailView.render().done(function(){
				});

			},1500);

			return false;
		}
	});

	return CommercialProjectView;
});

















