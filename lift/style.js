'use strict';

!function(win, doc) {
	
	// 类型判断
	let _isType = ( type, obj ) => {
		let _class = Object.prototype.toString.call(obj).slice( 8, -1 );
		return obj !== undefined && obj !== null && _class === type;
	};


	// 扩展对象
	let _deepExtend = function( out ) {
		out = out || {};
		for ( let i = 1; i < arguments.length; i++ ) {
			let obj = arguments[i];
			if ( !obj ) continue;
			for ( let key in obj ){
				if ( obj.hasOwnProperty( key ) ){
					if ( _isType( 'Object', obj[key] ) && obj[key] !== null )
						_deepExtend( out[key], obj[key] ); 
					else
						out[key] = obj[key];
				}
			}
		}
		return out;
	};


	// 事件监听
	let _addEvent = ( obj, type, fn ) => {
		if ( obj === null || typeof(obj) === 'undefined' ) return;
		if ( obj.addEventListener ) {
			obj.addEventListener( type, fn, false );
		} else if ( obj.attactEvent ) {
			obj.attactEvent( 'on' + type, fn );
		} else {
			obj['on' + type] = fn;
		}
	}

	// 类名的增，删，查
	let _hasClass = function(el, className) {
		if (!className) return false;
		if (el.classList) {
			return el.classList.contains(className);
		} else {
			return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
		}
	}


	let _addClass = ( el, className ) => {
		if (!className) return;
		if (el.classList) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	}


	let _removeClass = ( el, className ) => {
		if (!className) return;
		if (el.classList) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	let _getBd = (ele) => {
		return ele.getBoundingClientRect();
	};


	class Lift {
		
		constructor(args) {
			this.settings = {
				classes: {
					module: '.f',
					navItem: '.lift_btn',
					navTop: '.lift_top',
					navCurrent: 'on',
				},
				interval: 30,
				onInit: function() {},
				onStart: function() {},
				onStop: function() {},
			};

			if ( typeof args === 'object' ) {
				_deepExtend( this.settings, args );
			};

			let s = this.settings.classes;
			this.mod = doc.querySelectorAll( s.module );
			this.nav = doc.querySelectorAll( s.navItem );
			this.top = doc.querySelector( s.navTop );

			if ( this.mod.length > 0 && this.nav.length > 0 && this.mod.length === this.nav.length ) {
				this.bind();
			};
		};


		initClass( i ) {
			let [ n, c ] = [ this.nav, this.settings.classes.navCurrent ];

			if ( this.index != undefined ) {
				_removeClass( n[this.index], c );
				this.index = undefined;
			};

			if ( n[i] ){
				_addClass( n[i], c );
				this.index = i;
			};
		};


		scroll() {
			let [ m, f, l, n, h, c, p ] = [ this.mod, this.mod[0], this.mod[this.mod.length - 1], this.nav, doc.documentElement.clientHeight ];

			// 判断边界模块
			if ( _getBd(f).top > h / 2 || _getBd(l).bottom < h / 2 ) {
				this.initClass();
				return;
			};
			
			// 获取当前模块的top值，便于做下面的比较
			if ( this.index !== undefined ) {
				c = _getBd( m[this.index] ).top;
			};

			m.forEach(( e, i ) => {
				p = _getBd( e );
				if ( p.top < h * 0.4 && p.bottom > h * 0.4 ) { // 进入距离窗口顶部40%的区域视为主视图模块
					if ( c == 0 ) {
						return;
					} else {
						this.initClass(i);
					}
				}
			});
		};


		// 跳转到指定模板
		scrollTo( i ) {
			let m = this.mod;

			if ( m[i] ) {
				this.initClass(i);
				this.scrollX( m[i].offsetTop );
			};
		};

		scrollX( x ) {
			doc.body.scrollTop = x;
		};


		bind() {
			let [ n, t, interval, timer ] = [ this.nav, this.top, this.settings.interval ];

			// 绑定返回顶部
			_addEvent( t, 'click', () => {
				this.scrollX( 0 );
			} );

			// 绑定滚动
			_addEvent( win, 'scroll', () => {
				timer && clearTimeout(timer);
				timer = win.setTimeout( () => {
					this.scroll();
				}, interval );
			} );

			// 绑定楼层导航
			n.forEach((ele, index) => {
				_addEvent( ele, 'click', () => {
					this.scrollTo( index );
				} );
			});
		};


	};

	window.Lift = Lift;

}(window, document);
