var AppView, BodyView, IndexView, OtherView, PageViewBase, Router,
  _this = this;

$(function() {
  var body_view;
  body_view = new BodyView();
  new Router();
  return Backbone.history.start({
    pushState: true
  });
});

Router = Backbone.Router.extend({
  constructor: function() {
    if (!Router.instance) {
      Router.instance = this;
      Backbone.Router.apply(Router.instance, arguments);
    }
    return Router.instance;
  },
  routes: {
    "": "index",
    "other": "other",
    "other/:id": "other"
  },
  index: function() {
    if (!this.index_view) {
      this.index_view = new IndexView();
    }
    return this.index_view.render();
  },
  other: function(id) {
    if (!this.other_view) {
      this.other_view = new OtherView();
    }
    return this.other_view.render({
      id: id
    });
  }
});

BodyView = Backbone.View.extend({
  el: 'body',
  events: {
    "click .link": "link"
  },
  link: function(e) {
    e.preventDefault();
    return (new Router()).navigate($(e.target).attr("href"), {
      trigger: true
    });
  }
});

PageViewBase = Backbone.View.extend({
  el: '#app_view',
  template_name: "",
  initialize: function() {
    return this.template = $(this.template_name).text();
  },
  execute: function(params) {
    return {};
  },
  render: function(params) {
    var _this = this;
    return this.$el.fadeOut("fast", function() {
      _this.$el.html(Mustache.render(_this.template, _this.execute(params)));
      return _this.$el.fadeIn("fast");
    });
  }
});

IndexView = PageViewBase.extend({
  template_name: '#index_view_template'
});

OtherView = PageViewBase.extend({
  template_name: '#other_view_template',
  execute: function(params) {
    if (params.id == null) {
      params.id = 0;
    }
    return {
      val: params.id
    };
  }
});

AppView = Backbone.View.extend({
  el: '#app',
  initialize: function() {
    var mediator;
    return mediator = _.extend({}, Backbone.Events);
  }
});

/*
//@ sourceMappingURL=main.js.map
*/