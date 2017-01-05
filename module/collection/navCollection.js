define(['jquery','underscore','backbone','mainApp','mainRef','navModel'], function ($, _, Backbone, App, MainRef , NavModel) {
	'use strict';

	var NavCollection = Backbone.Collection.extend({
		model:NavModel,
		initialize:function(){

		}
	});

	return NavCollection;
});