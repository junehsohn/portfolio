define(['jquery','underscore','backbone','dualStorage','mainApp','mainRef','workModel'], function ($, _, Backbone, DualStorage, App, MainRef , WorkModel) {
	'use strict';

	var WorkCollection = Backbone.Collection.extend({
		model:WorkModel,
		url:"./workData.json",
		remote: true,
		local: true,
		initialize:function(){

		},
		getByType:function(__str){
			return this.where({workType: __str});
		}
	});

	return WorkCollection;
});