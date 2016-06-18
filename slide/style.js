'use strict';

(function(root, factory){
	if (typeof define === 'function' && define.amd) {
		define([], factory.call(this, jQuery, window));
	} else if (typeof exports === 'object') {
		module.exports = factory(jQuery, window);
	}else{
		root.Lazyload = factory(jQuery, window);
	}
})(this, function($, win){
	var defaults = {
		parentEle: '.slide',
		scrollEle: 'li',
		courlEle: 'i',
		btnPre: '.slide_pre',
		btnNxt: '.slide_nxt',
	}

	var Slide = function(options){
		this.opts = $.extend({}, defaults, options);
		
		this.$ele = $(this.opts.parentEle);
		this.$pre = $(this.opts.btnPre);
		this.$nxt = $(this.opts.btnNxt);
		this.$item = this.$ele.find(this.opts.scrollEle);
		this.$tag = this.$ele.find(this.opts.courlEle);

		this.index = this.opts.index || 0;
		this.length = this.$item.length;
		

		if(this.length > 0){
			this.init();
		};
	};

	Slide.prototype = {
		init: function(){
			this.turn(this.index);
			this.auto();
			this.bind();
		},

		bind: function(){
			var that = this;

			that.$tag.on('click', function(){
				var index = $(this).index();
				that.turn(index);
			});

			that.$pre.on('click', function(){
				that.pre();
			});

			that.$nxt.on('click', function(){
				that.nxt();
			});

			that.$ele.on('mouseover', function(){
				that.stop();
			});

			that.$ele.on('mouseout', function(){
				that.auto();
			})
		},

		turn: function(index){
			if(index < 0){
				this.index = this.length - 1;
			}else if(index > this.length - 1){
				this.index = 0;
			}else{
				this.index  = index;
			}
			this.$item.removeClass().eq(this.index).addClass('on');
			this.$tag.removeClass().eq(this.index).addClass('on');
		},

		pre: function(){
			this.index --;
			this.turn(this.index);
		},

		nxt: function(fn){
			this.index ++;
			this.turn(this.index);
			// 如果需要可以处理方法回调
			if(fn){
				fn.call(this);
			}
		},

		auto: function(){
			var that = this;
			that.timer = win.setInterval(function(){
				that.nxt();
			}, 5000);
		},

		stop: function(){
			win.clearInterval(this.timer);
		},

		getIndex: function(){
			return this.index;
		},
	};

	return Slide;

});