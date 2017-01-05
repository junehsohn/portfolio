define(['jquery','underscore','backbone','mainRef'], function ($, _, Backbone, MainRef) {
	'use strict';


	/*
	route => controller workflow
	*/

	var TodoRouter = Backbone.Router.extend({
		routes: {
			// '*filter': 'setFilter',
			'': 'redirecHome',
			'!': 'redirecHome',
			'!/': 'redirecHome',
			'!/home': 'home',
			'!/home/': 'home',
			'!/about': 'about',
			'!/about/': 'about',
			'!/work/:type': 'works',
			'!/work/:type/': 'works',
			'!/work/:type/:id': 'project',
			'!/work/:type/:id/': 'project',
			'!/contact': 'contact',
			'!/contact/': 'contact'
		},
		redirecHome:function(param){
			this.goHome(true);
		},
		home:function(param){
			var _that = this, _id;
			MainRef.app.viewManager.setPrevDialogTxt('Optimistic Range');		
			window.document.title = 'HOME | Optimistic Range';	
			_id = MainRef.app.config.id.HOME;	
			MainRef.app.controller.trigger('change', _id);
		},
		about:function(param){
			var _that = this, _id;
			MainRef.app.viewManager.setPrevDialogTxt('Introduce myself');		
			window.document.title = 'About | Optimistic Range';	
			_id = MainRef.app.config.id.ABOUT;	
			MainRef.app.controller.trigger('change', _id);
		},
		works:function(param){
			var _that = this, _id, skipPrevDialog = false;

			if(MainRef.app.component.current.id==MainRef.app.config.id.COMERCIAL_PROJECT) skipPrevDialog = true;
			MainRef.app.viewManager.setPrevDialogTxt('Commercial Work');	
			window.document.title = 'Work | Optimistic Range';	
			_id = MainRef.app.config.id.WORKS_COMERCIAL;
			MainRef.app.controller.trigger('change', _id, null, skipPrevDialog);
		},
		project:function(type, id){
			var model = MainRef.app.collection.get(id);
			if(model){
				MainRef.app.viewManager.setPrevDialogTxt(model.toJSON().projectName);	
				window.document.title = model.toJSON().projectName+' | Optimistic Range';	
				MainRef.app.controller.trigger('change', MainRef.app.config.id.COMERCIAL_PROJECT, model);
			}else{
				alert('Not Found Project');
				this.goHome(true);
			}

		},
		contact:function(param){
			var _that = this, _id;
			MainRef.app.viewManager.setPrevDialogTxt('If you contact me');		
			window.document.title = 'Contact | Optimistic Range';	
			_id = MainRef.app.config.id.CONTACT;	
			MainRef.app.controller.trigger('change', _id);
		},
		setFilter: function (param) {
			trace('TodoRouter router: setFilter: ', param);
			
		},
		goHome:function(__replace){
			MainRef.app.router.navigate( '!/'+MainRef.app.config.id.HOME, {trigger: true, replace:(__replace)?__replace:false} );
		},
		compareCurrentStatus:function(){
			if(MainRef.app.component && MainRef.app.component.current && MainRef.app.component.current.id){
				var hash = window.location.hash,
					idx = hash.indexOf( MainRef.app.component.current.id );

				if(idx==-1){
					// trace('compareCurrentStatus=>NO: '+hash);
					//MainRef.app.router.navigate( hash, {trigger: true, replace:true} );
				}else{
					// trace('compareCurrentStatus=>OK');
				}

			}
		}
	});

	return TodoRouter;
});


















