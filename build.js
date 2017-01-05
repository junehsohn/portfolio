({
    baseUrl: ".",
    paths: {
        text: 'module/lib/text.min',
		jquery: 'module/lib/jquery.min',
		jqueryTransit: 'module/lib/jquery.transit.min',
		underscore: 'module/lib/underscore-min',
		backbone: 'module/lib/backbone.min',
		dualStorage: 'module/lib/backbone.dualstorage.amd.min',
		tweenMax: 'module/lib/TweenMax.min',
		autoMata: 'module/lib/automata',
		handlebars: 'module/lib/handlebars-v3.0.0.min',
		modernizr: 'module/lib/modernizr.min',
		pxLoader: 'module/lib/pxloader-all.min',
		fss: 'module/lib/fss.min',
		arcText: 'module/lib/jquery.arctext.min',
		iscroll: 'module/lib/iscroll.min',
		
		mainRef: 'module/mainRef',
		mainApp: 'module/app',
		appViewManager: 'module/appViewManager',
		router: 'module/router/router',
		controller: 'module/controller/controller',
		polygon: 'module/component/decoration/polygon/polygon',
		dotLine: 'module/component/decoration/polygon/dotLine',
		dotCube: 'module/component/decoration/polygon/dotCube',
		navView: 'module/component/nav/navView',
		homeView: 'module/component/menu/home/homeView',
		workBaseView: 'module/component/menu/works/workBaseView',
		commercialProjectView: 'module/component/menu/works/commercial/commercialProjectView',
		commercialDetailView: 'module/component/menu/works/commercial/cDetailView',
		homeTemplate: 'module/component/menu/home/homeTemplate.html',
		workTemplate: 'module/component/menu/works/workTemplate.html',
		commercialProjectTemplate: 'module/component/menu/works/commercial/commercialProjectTemplate.html',
		commercialDetailTemplate: 'module/component/menu/works/commercial/cDetailTemplate.html',
		navCollection: 'module/collection/navCollection',
		workCollection: 'module/collection/workCollection',
		navModel: 'module/model/navModel',
		workModel: 'module/model/workModel',
		contactView: 'module/component/menu/contact/contactView',
		contactTemplate: 'module/component/menu/contact/contactTemplate.html',
		aboutView:'module/component/menu/about/aboutView',
		aboutTemplate:'module/component/menu/about/aboutTemplate.html',
		alertTemplate:'module/component/popup/notSupported.html',
		contactModel: 'module/model/contactModel',
		noUrlModel: 'module/model/noUrlModel'
    },
    shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		dualStorage: {
			deps: [
				'underscore',
				'jquery',
				'backbone'
			],
			exports: 'DualStorage'
		},
		tweenMax: {
			deps: ['jquery'],
			exports: 'TweenMax'
		},
		jqueryTransit: {
			deps: ['jquery'],
			exports: 'Transit'
		},
		autoMata: {
			deps: ['jquery'],
			exports: 'AutoMata'
		},
		handlebars: {
			exports: 'Handlebars'
		},
		arcText: {
			deps: ['jquery'],
			exports: 'ArcText'
		},
		fss: {
			exports: 'FSS'
		},
		modernizr: {
			exports: 'Modernizr'
		},
		pxLoader: {
			exports: 'PxLoader'
		},
		iscroll: {
			exports: 'IScroll'
		},
		polygon: {
			deps: ['jquery','fss'],
			exports: 'Polygon'
		}
	},
    optimizeCss: "standard",
    removeCombined: true,
    findNestedDependencies: true,
	name: "module/main",
    out: "dist/main-built.js"
})