define(['jquery','underscore','backbone','mainRef','noUrlModel'], function ($, _, Backbone, MainRef, NoUrlModel) {
	'use strict';

	var WorkModel = Backbone.Model.extend({
		defaults:{
			id:'',
			workType:'',
			projectName:'',
			copyEng:'',
			copyKor:'',
			client:'',
			contribution:{html:50,css:50,js:50},
			summary:'',
			siteLink:'',
			imgSmall:[],
			imgLarge:[],
			stDate:'',
			endDate:'',
			mesh:{},
			light:{},
			href:''
		},
		initialize:function(){
		}
	});

	return WorkModel;
});