'use strict';

(function($, win){
	
	var defaults = {
		threshold   : 50,
		event       : 'scroll resize',
		data_attr   : 'original',
		placeholder : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC",
		callback: function(){},
	};

	var Lazyload = function(options){
		this.opts = $.extend( {}, defaults, options );
		this.init();
	};

	Lazyload.prototype = {

		// 初始化
		init: function(){
			this.updateImgs();

			if(this.length > 0){
				var _scrollTop = $(win).scrollTop();
				if( _scrollTop > 0 ){
					this.bind();
				}else{
					this.appear();
					this.bind();
				}
			}
		},

		// 获取图片对象和个数
		updateImgs: function(){
			this.$imgs = $('img[' + this.opts.data_attr + ']');
			this.length = this.$imgs.length;
		},

		// 绑定事件
		bind: function(){
			let timer,
				show = () => {
					timer && clearTimeout(timer);
					timer = win.setTimeout( () => {
						this.appear();
					}, 100);
				}

			$(win).on(this.opts.event, show);
		},

		// 遍历元素判断是否在视图可视区
		appear: function(){
			let screH = $(win).height();

			this.updateImgs();

			this.$imgs.each( (index, item) => {
				var	viewV = item.getBoundingClientRect(),
					viewT = viewV.top,
					viewB = viewV.bottom,
					$item = $(item);

				// 如果图片没有设置src，使用placeholder
				if( $item.attr('src') === undefined || $item.attr("src") === false ){
					$item.attr("src", this.opts.placeholder);
				}

				// 判断元素在视窗内临界点
				if( ( viewT - this.opts.threshold ) <= screH && ( viewB + this.opts.threshold ) >= 0 ){
					$item.attr('src', $item.attr( this.opts.data_attr) );
					$item.removeAttr( this.opts.data_attr );

					this.opts.callback.call(this);
				};
			});
		},
	};

	win.Lazyload = Lazyload;

})(jQuery, window);

