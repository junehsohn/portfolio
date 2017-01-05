define(['jquery','underscore','backbone','jqueryTransit' ,'mainRef'], function ($, _, Backbone, JqueryTransit , MainRef) {
	'use strict';

	var NavView = Backbone.View.extend({
		el:'#navi',
		iconMode:'none',
		$icon:null,
		$btn:null,
		$titleTxt:null,
		template:null,
		events:{'click .nav-btn':'_goHome'},
		initialize:function(){
			var that = this;
			this.$icon = this.$el.find('aside.icon');
			this.$btn = this.$el.find('.nav-btn');
			this.$titleTxt = this.$el.find('.title');
			// this.$icon.on('click', function(__e){
				
				
			// });
		},
		destroy: function(){
			//this.model.destroy();
			var that = this;
			that.off();
			that.remove();
			delete that.$el;
			delete that.el;
		},
		remove: function(){
			this.$el.remove();
			Backbone.View.prototype.remove.apply(this, arguments);
		},
		render:function(){
			var that = this;
			
	        that.resize();
	        return that;
		},
		resize:function(){
			var that = this, wid = $(window).width(), $title = that.$el.find('.title'), scaleX, scaleY;
			if( wid<600 ){
				scaleX = scaleY = 0.5;
			}else{
				scaleX = scaleY = 0.6;
			}
			$title.css({'display':'none'});
			that.$icon.css({scaleX:scaleX, scaleY:scaleY});
		},
		changeStatus:function(__id, __model){
			var compID = MainRef.app.config.id;
			switch(__id){
				case compID.HOME:
					this.changeTxt('','#FFFFFF');
					this.changeTopIcons('none');
				break;

				case compID.ABOUT:
					this.changeTxt('About');
					this.changeTopIcons('menu');
				break;

				case compID.WORKS_COMERCIAL:
				case compID.WORKS_PERSONAL:
					this.changeTxt('Works','#000000');
					this.changeTopIcons('menu');
				break;

				case compID.COMERCIAL_PROJECT:
					if(__model){
						this.changeTxt('','#FFFFFF');
						this.changeTopIcons('hide');
					}
				break;

				case compID.CONTACT:
					this.changeTxt('Contact');
					this.changeTopIcons('menu');
				break;

				default:
					//work detail
					
					
				break;
			}
		},
		changeTxt:function(__txt, __color){
			var $title = this.$el.find('.title') , c = __color || '#FFFFFF', o=($(window).width()<800)?0:1;
			// $title.html(__txt);
			$title.empty();
			if(__txt==''){
				$title.css('display','none');
			}else{
				$title.css({'display':'block','opacity':0});
				$title.stop().css({color:c}).delay(600).transition({'opacity':o},600,'easeInCubic');
			}
		},
		changeTopIcons:function(__type){
			var that = this,
				iconRotAng = 180,
				lineY = 18,
				$box0 = that.$el.find('.box:eq(0)'),
				$box1 = that.$el.find('.box:eq(1)'),
				$box2 = that.$el.find('.box:eq(2)');

			that.iconMode = __type;

			switch(__type){
				case 'hide':
					iconRotAng = 360;
					this.$btn.css({cursor:'default'});
					that.$icon.stop().delay(0).transition({rotateZ:0},0,'easeInOutCubic');
					$box0.stop().delay(0).transition({y:lineY, x:14, width:28, backgroundColor:'#FFFFFF', opacity:0},1200,'easeInOutCubic');
					$box1.stop().delay(0).transition({y:lineY, x:0, width:56, backgroundColor:'#FFFFFF', opacity:0},1200,'easeInOutCubic');
					$box2.stop().delay(0).transition({y:lineY, x:14, width:28, backgroundColor:'#FFFFFF', opacity:0},1200,'easeInOutCubic');
					that.$icon.stop().delay(0).transition({rotateZ:iconRotAng},1200,'easeInOutCubic', function(){
						that.$icon.css({rotateZ:0});
					});
				break;

				case 'none':
					iconRotAng = 360;
					this.$btn.css({cursor:'default'});
					that.$icon.stop().delay(0).transition({rotateZ:0},0,'easeInOutCubic');
					$box0.stop().delay(0).transition({y:lineY, x:14, width:28, backgroundColor:'#FFFFFF', opacity:0},1200,'easeInOutCubic');
					$box1.stop().delay(0).transition({y:lineY, x:0, width:56, backgroundColor:'#FFFFFF', opacity:1},1800,'easeInOutCubic');
					$box2.stop().delay(0).transition({y:lineY, x:14, width:28, backgroundColor:'#FFFFFF', opacity:0},1200,'easeInOutCubic');
					that.$icon.stop().delay(0).transition({rotateZ:iconRotAng},1800,'easeInOutCubic', function(){
						that.$icon.css({rotateZ:0});
					});
				break;

				case 'menu':
					iconRotAng = 180;
					this.$btn.css({cursor:'pointer'});
					that.$icon.stop().delay(0).transition({rotateZ:0},0,'easeInOutCubic');
					$box0.stop().delay(200).transition({y:0, x:14, width:28, backgroundColor:'#000000', opacity:1},800,'easeInOutCubic');
					$box1.stop().delay(0).transition({y:lineY, x:0, width:56, backgroundColor:'#000000', opacity:1},1200,'easeInOutCubic');
					$box2.stop().delay(200).transition({y:lineY*2, x:14, width:28, backgroundColor:'#000000', opacity:1},800,'easeInOutCubic');
					that.$icon.stop().delay(0).transition({rotateZ:iconRotAng},1200,'easeInOutCubic', function(){
						that.$icon.css({rotateZ:0});
					});

				break;
			}
		},
		_goHome:function(__e){
			__e.preventDefault();
			switch(this.iconMode){
				case 'none':

				break;

				case 'menu':
					MainRef.app.router.goHome();
				break;
			}
		}
	});

	return NavView;
});


























