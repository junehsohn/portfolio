define(['jquery','underscore','backbone','mainRef'], function ($, _, Backbone, MainRef) {
	'use strict';

	var NoUrlModel = Backbone.Model.extend({});
	NoUrlModel.prototype.sync = function() { return null; };
	NoUrlModel.prototype.fetch = function() { return null; };
	NoUrlModel.prototype.save = function() { return null; };

	return NoUrlModel;
});