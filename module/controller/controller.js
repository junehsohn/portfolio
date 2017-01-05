define(['jquery','underscore','backbone','tweenMax','mainRef'], function ($, _, Backbone, TweenMax, MainRef) {
	'use strict';

	var controller = _.extend({}, Backbone.Events);
	controller.showCurrentComponentTimer = null;

	controller.on( 'change', function(__id, __model, __skipPrevDialog){
		var timerDur = 1100;
		clearTimeout(controller.showCurrentComponentTimer);

		MainRef.app.component.next = MainRef.app.viewManager.createComponent(__id, __model);
		MainRef.app.viewManager.changeNavi(__id, __model);
		if( MainRef.app.component.current.view ){
			// 각 component.view(Backbone.view) 의 hide method는 반드시 promise를 구현, return으로 반환해야한다.
			MainRef.app.component.current.view
			.hide()
			.done(function(__view){
				if(!__skipPrevDialog){
					if(MainRef.app.component.next) MainRef.app.viewManager.setBgColor( MainRef.app.component.next.view.bgColor );

					MainRef.app.viewManager.showPrevDialog(__id).done(function(){
						controller.showCurrentComponent(__id, __model);
					});
				}else{
					if(MainRef.app.component.next) MainRef.app.viewManager.setBgColor( MainRef.app.component.next.view.bgColor, 1000 );

					controller.showCurrentComponentTimer = setTimeout(function(){
						controller.showCurrentComponent(__id, __model);
					}, timerDur);
				}
			});

		}else{
			if(MainRef.app.component.next) MainRef.app.viewManager.setBgColor( MainRef.app.component.next.view.bgColor );
			if(!__skipPrevDialog){
				MainRef.app.viewManager.showPrevDialog(__id).done(function(){
					controller.showCurrentComponent(__id, __model);
				});
			}else{
				controller.showCurrentComponentTimer = setTimeout(function(){
					controller.showCurrentComponent(__id, __model);
				}, timerDur);
			}
		}

	} );

	controller.showCurrentComponent = function(__id, __model){
		MainRef.app.component.current = MainRef.app.component.next;
		MainRef.app.component.next = null;
		MainRef.app.viewManager.setCurrentPage(__id);

		if(MainRef.app.component.current && MainRef.app.component.current.view){
			// 각 component.view(Backbone.view) 의 render method는 반드시 promise를 구현, return으로 반환해야한다.
			var tmpWid = $(window).width(), tmpHei = $(window).height();
			MainRef.app.component.current.view
			.render()
			.done(function(__view){
				if( tmpWid == $(window).width() && tmpHei == $(window).height()){
				}else{
					MainRef.app.viewManager.resize(0);
				}
				MainRef.app.router.compareCurrentStatus();
			});
		}
	};


	return controller;
});