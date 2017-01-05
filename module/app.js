
define(['jquery','underscore','backbone','mainRef','appViewManager','router','controller','workCollection','workModel', 'pxLoader'], 
	function ($, _, Backbone, MainRef, AppViewManager, Router, Controller, WorkCollection, WorkModel, PxLoader) {
	'use strict';

	

	/*

	[module]
	1. app

	2. router

	3. controller
		: transition mediator

	4.	view component
		: appView - main view(body)
		: nav - nav
		: home
		: about
		: work
		: contact

	5. model
		: appView에 매칭되는 실제 JSON data를 root conllection로 담고, 나머지 collection/model은 참조하는 형태




	[workflow]
	1. base: 
		router => controller(transition mediator), event.trigger => appView.on => dispatch event
	
	2. case
		2.1  home ::> menu click
			 : router navigate => controller(menu create , transition mediator, transition complete) 
			 	=>  menu show
			 (* 바뀌는 메뉴가 이전과 같다면 / 다르다면)

		2.2  works ::> works detail
			 : router navigate => controller(menu create , transition mediator, transition complete) 
			 	=>  works detail show

		2.3  works detail ::> menu or home
		
		2.4  menu ::> home
			 : menu cache, 현재 menu를 지우지 않는다.

		2.5  menu ::> other menu



	*/
	var app = {
			VERSION:'0.0.0.9.7.9.3',
			config:{
				id:{
					HOME:'home',
					ABOUT:'about',
					WORKS_COMERCIAL:'work/commercial',
					WORKS_PERSONAL:'work/personal',
					COMERCIAL_PROJECT:'commercial_project',
					CONTACT:'contact'
				},
				workType:function(){
					if(arguments.length==1){
						//setter
						window.sessionStorage.setItem('workType', arguments[0]);
						if( app.component.home.collection && app.component.home.collection.get('work') ){
							app.component.home.collection.get('work').set({href:'#!/work/'+String(arguments[0])+'/'});
							// trace(app.component.home.collection.get('work'));
						}
					}else if(arguments.length==0){
						//getter
						return window.sessionStorage.getItem('workType');
					}
				}
			},
			collection:null,
			router:null,
			viewManager:null,
			component:{
				home:{}, 
				about:{}, 
				work:{}, 
				commercialProj:{}, 
				contact:{}, 
				navi:{}, 
				polygon:{}, 
				current:{id:''},	/*current page*/
				next:{id:''}		/*next page*/
			},
			util:{
				hexToRgb:function(hex) {
				    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				    return result ? {
				        r: parseInt(result[1], 16),
				        g: parseInt(result[2], 16),
				        b: parseInt(result[3], 16)
				    } : null;
				}, 
				rgbToHex:function(r, g, b) {
				    return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
				}
			},
			fetchCollection:function(){
				var that = this;
				window.localStorage.clear();
				that.collection.fetch({reset:true, success:function(){
					that.setWorkData();
				}});
			},
			setWorkData:function(__type, __idArr){
				var that = this, i, iTotal, tmpId;
				window.localStorage.setItem('appVersion', MainRef.app.VERSION );
				that.collection.remote = false;
				that.collection.local = true;

				if(__type=='local'){
					iTotal=__idArr.length;
					for( i=0; i<iTotal; ++i ){
						tmpId = that.collection.url+__idArr[i];
						that.collection.create(JSON.parse(window.localStorage.getItem(tmpId)));
					}

				}else{
					that.collection.models.forEach(function(model){
		    			model.save();
					});
				}
				that.start();
			},
			initialize:function(){
				trace('Orange.app.initialize: ');

				var that = this,
					workType = window.sessionStorage.getItem('workType') || 'commercial',
					ver = window.localStorage.getItem('appVersion'),
					lsIdArr;

				$(document.body).css('opacity', 0);
				that.collection = new WorkCollection();
				lsIdArr = (window.localStorage.getItem(that.collection.url)) ? window.localStorage.getItem(that.collection.url).split(','):null
				that.config.workType(workType);
				app.viewManager = AppViewManager;
				app.controller = Controller;

				if( MainRef.app.VERSION===ver ){
					if(lsIdArr && lsIdArr.length){
						that.setWorkData('local', lsIdArr);
					}else{
						that.fetchCollection();
					}
				}else{
					that.fetchCollection();
				}
			},
			start:function(){
				var that = this,
					loader = new PxLoader(),
					timer=null;

				loader.addCompletionListener(function(e) { 
				    console.log('Ready to go!'); 
				    clearTimeout(timer);
				    that.showLoadingBar(false);
				    loader = null;
				    $(document.body).css('opacity', 1);
				    app.viewManager.initialize();
					app.router = new Router();
					Backbone.history.start();
				}); 
				loader.add(new PxLoaderImage('./image/cir.png')); 
				loader.add(new PxLoaderImage('./image/cir_half.png')); 
				loader.add(new PxLoaderImage('./image/noise.png')); 
				loader.start();

				timer = setTimeout(function(){
					that.showLoadingBar(true);
				},4500);
				
				
			},
			showLoadingBar:function(__isShow){
				var $d = $.Deferred();
				if(__isShow){
					$('.loading-bar-txt').removeClass('show-hide');
					$('.loading-bar').stop().css({'opacity':0 , 'display':'block'}).delay(2000).transition({ 'opacity':1 }, 1500,'easeInCubic', function(){
						$('.loading-bar-txt').addClass('show-hide');
						$d.resolve();
					});

				}else{
					$('.loading-bar-txt').removeClass('show-hide');
					$('.loading-bar').stop().css({'opacity':0 , 'display':'none'});
					$d.resolve();
				}
				return $d;
			}
	};



	return app;
});























