define(['jquery','underscore','backbone','mainRef','noUrlModel'], function ($, _, Backbone, MainRef, NoUrlModel) {
	'use strict';

	var NavModel = NoUrlModel.extend({
		defaults:{
			name:'',
			href:''
		},
		initialize:function(){
		}
	});

	return NavModel;
});