define(['jquery','underscore','backbone','mainRef','noUrlModel'], function ($, _, Backbone, MainRef, NoUrlModel) {
	'use strict';

	var ContactModel = NoUrlModel.extend({
		defaults:{
			email:'junehsohn@gmail.com',
			location:'Seoul',
			country:'south korea'
		},
		initialize:function(){
		}
	});

	return ContactModel;
});