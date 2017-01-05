
define(['jquery','underscore','backbone','tweenMax', 'jqueryTransit','mainRef','polygon','navView','homeView', 'workBaseView', 'commercialProjectView','navCollection','navModel','workCollection','workModel','contactView','text!contactTemplate','contactModel','aboutView','text!aboutTemplate'], 
	function ($, _, Backbone, TweenMax, JqueryTransit, MainRef, Polygon, NavView, HomeView, WorkBaseView, CommercialProjectView, NavCollection, NavModel, WorkCollection, WorkModel, ContactView, ContactTemplate, ContactModel, AboutView, AboutTemplate) {
	'use strict';

	/*
	 - view create(setup)
	 - view transition manager
	*/	

	var app,
		component,
		AppViewManager = _.extend({}, Backbone.Events);

	AppViewManager.initialize = function(){
		this.polygon = null;
		this.navi = null;
		this.$dialogLayer = $('.dialog-layer');
		this.$textPartialTop = $('.dialog-layer').find('.text-partial').eq(0);
		this.$textPartialBottom = $('.dialog-layer').find('.text-partial').eq(1);
		this.$prevDialogTL;
		this.setPrevDialogTimelineTimer = null;
		this.setPrevDialogTimelineTimerAfter = null;

		app = MainRef.app;
		component = app.component;

		this.setNavi();
		$(window).resize(this.resize);
		this.resize();
	};

	AppViewManager.resize = function(){
		// trace('AppViewManager resize');
		var winWid = $(window).width(),
			winHei = $(window).height();

		if(component.current && component.current.view){
			component.current.view.resize(300);
		}

		if(component.navi && component.navi.view){
			component.navi.view.resize();
		}

		if(winWid<600){
			AppViewManager.$dialogLayer.css({'font-size':'40px'});
			AppViewManager.$textPartialTop.css({'height':'40px'});
			AppViewManager.$textPartialBottom.css({'height':'40px'});
			AppViewManager.$dialogLayer.find('.text-inner-partial').css({'height':'40px'});
		}else if(winWid<800){
			AppViewManager.$dialogLayer.css({'font-size':'50px'});
			AppViewManager.$textPartialTop.css({'height':'50px'});
			AppViewManager.$textPartialBottom.css({'height':'50px'});
			AppViewManager.$dialogLayer.find('.text-inner-partial').css({'height':'50px'});
		}else{
			AppViewManager.$dialogLayer.css({'font-size':'70px'});
			AppViewManager.$textPartialTop.css({'height':'70px'});
			AppViewManager.$textPartialBottom.css({'height':'70px'});
			AppViewManager.$dialogLayer.find('.text-inner-partial').css({'height':'70px'});
		}
		var tmpHei = AppViewManager.$textPartialTop.height();

		AppViewManager.$textPartialTop.css({'top':( ((winHei-AppViewManager.$textPartialTop.height())/2)-(tmpHei/2) )+'px'});
		AppViewManager.$textPartialBottom.css({'top':( ((winHei-AppViewManager.$textPartialBottom.height())/2)+(tmpHei/2) )+'px'});

		if( $('.loading-bar-txt')[0] ){
			$('.loading-bar-txt').css({'top':parseInt((winHei*0.5)-40)+'px'});
		}

	};

	AppViewManager.setBgColor = function(__color, __dur){
		var dur = (__dur)?__dur:1200;
		$('.body-container').stop().delay(0).transition({backgroundColor:__color},dur);
	};

	AppViewManager.showPrevDialog = function(__id){
		var $d = $.Deferred(), 
			$innerTop, 
			$innerBtm,
			compID = MainRef.app.config.id,
			tl, color;

		switch(__id){
			case compID.HOME:
			case compID.COMERCIAL_PROJECT:
				color = '#FFFFFF';
			break;

			case compID.ABOUT:
			case compID.WORKS_COMERCIAL:
			case compID.WORKS_PERSONAL:
			case compID.CONTACT:
				color = '#000000';
			break;

			default:
				color = '#FFFFFF';
			break;
		}

		if(AppViewManager.$textPartialTop && AppViewManager.$textPartialBottom){
			AppViewManager.setPrevDialogTimeline.promise = $d;
			AppViewManager.setPrevDialogTimeline(color);

		}else{
			$('.dialog-layer').css('display','none');
			$d.resolve();
		}
		return $d;
	};


	AppViewManager.setGlobalPolygon = function(__opt){
		if(AppViewManager.polygon){
		}else{
			component.polygon = AppViewManager.polygon = new Polygon({
				mesh:{},
				light:{},
				container:__opt.container,
				output:__opt.output,
			});

			AppViewManager.polygon.init();
		}
		AppViewManager.polygon.setupContainer(__opt);
		AppViewManager.polygon.resize(AppViewManager.polygon._container.offsetWidth, AppViewManager.polygon._container.offsetHeight);
		return AppViewManager.polygon;
	};

	AppViewManager.setNavi = function(){
		component.navi.view = AppViewManager.navi = new NavView();
		component.navi.id = 'navi';
		return AppViewManager.navi;
	};


	AppViewManager.setPrevDialogTimeline = function(__color){
		var that = this, $innerTop, $innerBtm, tmpHei;
		$innerTop = AppViewManager.$textPartialTop.find('.text-inner-partial');
		$innerBtm = AppViewManager.$textPartialBottom.find('.text-inner-partial');
		tmpHei = $innerBtm.height();

		clearTimeout(that.setPrevDialogTimelineTimer);
		clearTimeout(that.setPrevDialogTimelineTimerAfter);
		that.setPrevDialogTimelineTimer = setTimeout(function(){

			clearTimeout(that.setPrevDialogTimelineTimer);
			$innerTop.stop().css({x:tmpHei/2, y:tmpHei});
			$innerBtm.stop().css({x:-tmpHei/2, y:-tmpHei});
			$('.dialog-layer').stop().css({'opacity':0});
			$('.dialog-layer').css({'display':'block','color':__color});
			$('.dialog-layer>.dialog-text').stop().css({'rotateX':-90,'rotateY':-45,'rotateZ':-45});

			$innerTop.stop().delay(0).transition({x:0, y:(tmpHei*0.375)},1000,'easeInOutCubic');
			$innerBtm.stop().delay(0).transition({x:0, y:-(tmpHei*0.625)},1000,'easeInOutCubic');
			$('.dialog-layer>.dialog-text').stop().delay(0).transition({'rotateX':0,'rotateY':0,'rotateZ':-10},1000,'easeInOutCubic');
			$('.dialog-layer').stop().delay(0).transition({'opacity':1},1000,'easeInOutCubic', function(){

				that.setPrevDialogTimelineTimerAfter = setTimeout(function(){
					clearTimeout(that.setPrevDialogTimelineTimerAfter);
					$('.dialog-layer').stop().delay(0).transition({'opacity':0},800,'easeInOutCubic');
					$('.dialog-layer>.dialog-text').stop().delay(0).transition({'rotateX':90,'rotateY':25,'rotateZ':15},800,'easeInCubic');
					$innerTop.delay(0).transition({x:-tmpHei/6},700,'easeInOutCubic');
					$innerTop.delay(0).transition({y:tmpHei},800,'easeInOutCubic');
					$innerBtm.delay(0).transition({x:tmpHei/6},700,'easeInOutCubic');
					$innerBtm.delay(0).transition({y:-tmpHei},800,'easeInOutCubic', function(){
						$('.dialog-layer').css({'display':'none', 'opacity':0});
						that.setPrevDialogTimeline.promise.resolve();
					});
				},500);
			});
		},700);

	};

	AppViewManager.setPrevDialogTxt = function(__str){
		$('.text-inner-partial').html(__str);
	}

	AppViewManager.changeNavi = function(__id, __model){
		component.navi.view.changeStatus(__id, __model);
	};

	AppViewManager.setCurrentPage = function(__id){
		var pageClass='', compID = MainRef.app.config.id;
		
		switch(__id){
			case compID.HOME:
				pageClass = 'home';
			break;

			case compID.ABOUT:
				pageClass = 'about';
			break;

			case compID.WORKS_COMERCIAL:
			case compID.WORKS_PERSONAL:
				pageClass = 'works';
			break;

			case compID.CONTACT:
				pageClass = 'contact';
			break;

			default:
				//create work detail
			break;
		}

		$('.section-container').find('.current-page').removeClass('current-page');
		if(pageClass) $('.section-container').find('.'+pageClass).addClass('current-page');	//FIXME
	};


	AppViewManager.createComponent = function(__id, __model){
		var comp=null, compID = MainRef.app.config.id;
		switch(__id){
			case compID.HOME:
				comp = AppViewManager.createHome(__id);
			break;

			case compID.ABOUT:
				comp = AppViewManager.createAbout(__id);
			break;

			case compID.WORKS_COMERCIAL:
			case compID.WORKS_PERSONAL:
				comp = AppViewManager.createWork(__id);
			break;

			case compID.CONTACT:
				comp = AppViewManager.createContact(__id);
			break;

			case compID.COMERCIAL_PROJECT:
				if(__model){
					comp = AppViewManager.createCommercialProject(__id, __model);
				}
			
			break;

			default:
				//create work detail

			break;
		}

		return comp;
	};


	AppViewManager.createHome = function(__id){
		if(component.home.view){}else{
			var _that = this, _v, _m, _c;

			if(component.home.model){
				_m = component.home.model;
			}else{
				_m = [ new NavModel({id:'about', href:'#!/about',name:'About'}), 
					   new NavModel({id:'works', href:'#!/work/'+(MainRef.app.config.workType())+'',name:'Work'}), 
					   new NavModel({id:'contact', href:'#!/contact',name:'Contact'}) 
				];
			}

			if(component.home.collection){
				_c = component.home.collection;
			}else{
				_c = new NavCollection(_m);
			}

			if(component.home.view){
				_v = component.home.view;
			}else{
				_v = new HomeView({collection:_c});
			}
			
			component.home.id = __id;
			component.home.model = _m;
			component.home.collection = _c;
			component.home.view = _v;
		}
		return component.home;
	};

	AppViewManager.createAbout = function(__id){
		if(component.about.view){}else{
			var _that = this, _v, _m, _c;
			_v = new AboutView();
			
			component.about.id = __id;
			component.about.view = _v;
		}
		return component.about;
	};

	AppViewManager.createWork = function(__id){
		if(component.work.view){}else{
			var _that = this, _v, _m, _c;

			_c = MainRef.app.collection;

			if(component.work.view){
				_v = component.work.view;
			}else{
				_v = new WorkBaseView({collection:_c});
			}
			
			component.work.id = __id;
			component.work.collection = _c;
			component.work.view = _v;
		}
		return component.work;
	};

	AppViewManager.createCommercialProject = function(__id, __model){
		var _that = this, _v, _m;
		_m = __model;
		if(component.commercialProj.view){
			_v = component.commercialProj.view;
		}else{
			_v = new CommercialProjectView();
		}
		_v.model = _m;
		
		component.commercialProj.id = __id;
		component.commercialProj.model = _m;
		component.commercialProj.view = _v;
		return component.commercialProj;
	};

	AppViewManager.createContact = function(__id){
		if(component.contact.view){}else{
			var _that = this, _v, _m, _c;

			_m = new ContactModel({email:'junehsohn@gmail.com', location:'seoul', country:'south korea'});
			_v = new ContactView({model:_m});
			
			component.contact.id = __id;
			component.contact.model = _m;
			component.contact.view = _v;
		}
		return component.contact;
	};



	return AppViewManager;
});























