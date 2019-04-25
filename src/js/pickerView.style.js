/*
 * @author andypliang
 * @email t-cong@163.com
 * @description 移动端多级联动选择器 
 * @version 1.0.0
 */
'use strict';

;(function(window){
    // 根据年月获取日数
    var getDays = function(year, month) {
        var result = [];
        var days = 31;
        var smallMonths = [4, 6, 9, 11];
        var isLeapYear = function(y) { return (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0); }
        year = parseInt(year);
        month = parseInt(month);
        if (month === 2) {
            isLeapYear(year) ? (days = 29) : (days = 28);
        } else if (smallMonths.indexOf(month) > -1) {
            days = 30;
        }
        for (var i = 0; i < days; i++) { 
            result.push(i + 1 + '日');
        }
        return result;
    }
	var PickerView = function(opts) {
			// 参数存起来
			this.pickerOpts = opts;
			// 选择器前缀
	    	this.prefix = '_picker-' + new Date().getTime();
	    	// 每一项的高度
			this.itemHeight = 30;
			// 记录鼠标位置
			this.pos = {
				startY: 0,
				moveY: 0,
				endY: 0,
				curY: 0,
				itemStartY: 0
            };
            // 日期检测
            this.checkDate();

	    	// 生成选择器Dom结构
	    	this.createPickerDom();

			// 记录选择器对应的dom
            this.container = document.querySelector('.' + this.prefix);
            this.mask = this.container.querySelector('._picker-mask');
			this.cols = this.container.querySelectorAll('._picker-col');
			this.col_list = this.container.querySelectorAll('._picker-data-list');
			this.btnCancel = this.container.querySelector('._picker-btn-cancel');
			this.btnConfirm = this.container.querySelector('._picker-btn-confirm');
			if (this.pickerOpts.selector) {
                this.selector = document.getElementById(this.pickerOpts.selector);
            }

			// 绑定选择器的事件
			this.bind();
	}

	PickerView.prototype = {
        show: function() {
            this.container.className = '_picker-container ' + this.prefix;
        },
		bind: function() {
			var _this = this;
            var hidePicker = function() {
                if (typeof _this.pickerOpts.onCancel === "function") {
	                _this.pickerOpts.onCancel();
	            }
	            _this.container.className = '_picker-container hide';
            };
            // 选择取消事件
            this.mask.addEventListener('touchend', hidePicker, false);
			this.btnCancel.addEventListener('touchend', hidePicker, false);

			// 选择确定事件
			this.btnConfirm.addEventListener('touchend', function() {
				if (typeof _this.pickerOpts.onConfirm === "function") {
	                var values = [];
	                // 获取每一个当前选中值 没有的话默认第一个
	                for (var i = 0; i < _this.pickerOpts.cols.length; i++) {
                        var val = _this.pickerOpts.cols[i].curVal !== undefined ? _this.pickerOpts.cols[i].curVal : _this.pickerOpts.cols[i].values[0];
                        values.push(_this.pickerOpts.type === 'date' ? parseInt(val.substr(0, val.length - 1)) : val);
	                }
	                _this.pickerOpts.onConfirm(values);
				}
	            _this.container.className = '_picker-container hide';
			},false);

			// 唤起选择器事件
			this.selector && this.selector.addEventListener('touchend', function() {
	            _this.show();
			},false);

            // 绑定选项滑动事件
	        for (var i = 0; i < this.cols.length; i++) {
	            this.cols[i].addEventListener('touchstart', _this.touchEventCallBack(i, 'touchstart', _this.pos), false);
	            this.cols[i].addEventListener('touchmove', _this.touchEventCallBack(i, 'touchmove', _this.pos), false);
	            this.cols[i].addEventListener('touchend', _this.touchEventCallBack(i, 'touchend', _this.pos), false);
	        }
		},
		touchEventCallBack: function(index, event, pos) {
	        var _this = this;
			return function(e) {
                e.preventDefault();
	            switch (event) {
					case 'touchstart':
						// 计算起始每个值的位置
						pos.startY = e.touches[0].clientY;
						pos.curY = pos.itemStartY =  (3 - _this.pickerOpts.cols[index].curIndex) * _this.itemHeight;
                        _this.col_list[index].classList.remove('animate');
						break;
					case 'touchmove':
	                    // 移动的位置
	                    pos.moveY = e.changedTouches[0].clientY;
	                    // 动态计算当前位置
	                    pos.curY = pos.itemStartY + (pos.moveY - pos.startY);
                        _this.col_list[index].setAttribute('style','-webkit-transform:translate3d(0, ' + pos.curY + 'px, 0);transform:translate3d(0, ' + pos.curY + 'px, 0)');
						break;
					case 'touchend':
	                    // 结束的位置
	                    pos.endY = e.changedTouches[0].clientY;
	                    var curIndex = Math.round((pos.startY - pos.endY) / _this.itemHeight) + _this.pickerOpts.cols[index].curIndex;
						var len = _this.pickerOpts.cols[index].values.length;
						if (curIndex < 0) {
							curIndex = 0;
						} else if (curIndex >= len) {
							curIndex = len - 1;
						}
	                    // 更新当前选中值
	                    _this.pickerOpts.cols[index].curIndex = curIndex;
                        _this.pickerOpts.cols[index].curVal = _this.pickerOpts.cols[index].values[curIndex];
                        _this.col_list[index].classList.add('animate');
	                    _this.col_list[index].setAttribute('style', '-webkit-transform:translate3d(0, ' + (3 - curIndex) * _this.itemHeight+'px, 0);transform:translate3d(0, ' + (3 - curIndex) * _this.itemHeight + 'px, 0);');
                        // 选中事件回调
                        if (_this.pickerOpts.type === 'date' && (index === 1 || index === 0 && _this.pickerOpts.cols[1].curVal === '2月')) {
                            var year = _this.pickerOpts.cols[0].curVal;
                            var month = _this.pickerOpts.cols[1].curVal;
                            _this.updateCol(2, {
                                values: getDays(year.substr(0, year.length - 1), month.substr(0, month.length - 1))
                            });
                        }
						if (typeof _this.pickerOpts.onSelected === 'function') {
                            var val = _this.pickerOpts.cols[index].curVal;
	                        _this.pickerOpts.onSelected(index, _this.pickerOpts.cols[index].curIndex, _this.pickerOpts.type === 'date' ? parseInt(val.substr(0, val.length - 1)) : val);
                        }
						break;
				}
			}
        },
        // 日期类型检测
        checkDate: function() {
            var opts = this.pickerOpts;
            if (!opts.type || opts.type !== 'date') return;
            var start = opts.start || 1990;
            var end = opts.end || new Date.getFullYear();
            var years = [], months = [];
            var curYear = opts.curYear || start, curMonth = opts.curMonth || 1;
            for (var i = start; i <= end; i++) {
                years.push(i + '年');
            }
            for (var j = 0; j < 12; j++) {
                months.push(j + 1 + '月');
            }
            this.pickerOpts.cols = [
                { values: years, curVal: curYear + '年' }, 
                { values: months, curVal: curMonth + '月' },
                { values: getDays(curYear, curMonth), curVal: '1日' }
            ];
        },
	    // 创建选择器的Dom结构
	    createPickerDom: function() {
            var opts = this.pickerOpts;
			var mainDom = '';
			for (var i = 0; i < opts.cols.length; i++) {
                this.initCol(opts.cols[i]);
				mainDom += '<div class="_picker-col">' + this.setOptions(opts.cols[i]) + '</div>';
			}
            var dom = '<div class="_picker-container hide ' + this.prefix + '">' +
                            '<div class="_picker-mask"></div>' +
							'<div class="_picker-wrapper">' +
								'<div class="_picker-head">' +
									'<h3 class="_picker-title">' + (opts.title || '') + '</h3>' +
									'<a class="_picker-btn-cancel" href="javascript:;">取消</a>' +
									'<a class="_picker-btn-confirm" href="javascript:;">确定</a>' +
								'</div>' +
								'<div class="_picker-content">' + mainDom + '</div>' +
							'</div>' +
					  '</div>';
			var wrapper = document.createElement('div');
            wrapper.innerHTML = dom;
			document.body.appendChild(wrapper);
		},
		// 设置选择器里的列内容
		setOptions: function(col) {
            this.initCol(col);
			var dom  = '<ul class="_picker-data-list" style="-webkit-transform:translate3d(0, ' + (3 - col.curIndex) * this.itemHeight + 'px, 0);transform:translate3d(0, ' + (3 - col.curIndex) * this.itemHeight + 'px, 0)">';
			for (var i = 0; i < col.values.length; i++) {
				dom += '<li>' + col.values[i] + '</li>';
			}
			return dom + '</ul>';
        },
        // 初始化列选项
        initCol: function(col) {
            if (!col.values.length) return;
            if (col.curVal) {
				var temp = col.values.indexOf(col.curVal);
				if (temp === -1) {
	                col.curVal = col.values[0];
	                col.curIndex = 0;
				} else {
	                col.curIndex = temp;
				}
			} else {
	            // 没有当前项 默认第一个
	            col.curVal = col.values[0];
	            col.curIndex = 0;
			}
        },
		// 更新列内容
		updateCol: function(colIndex,col) {
			this.cols[colIndex].innerHTML = this.setOptions(col);
	        // 更新pickerOpts
	        this.pickerOpts.cols[colIndex] = col;
	        // 更新col list
	        this.col_list = document.querySelectorAll('.' + this.prefix + ' ._picker-data-list');
		}
    }
    // 样式注入
    var style = document.createElement('style');
    style.innerText = "._picker-container{position:fixed;z-index:9999;top:0;left:0;bottom:0;right:0;font-size:0;font-family:PingFangSC-Light,'Helvetica Neue',sans-serif;margin:0;padding:0;-webkit-user-select:none;user-select:none;visibility:visible}._picker-container a{outline:0;-webkit-tap-highlight-color:rgba(0,0,0,0)}._picker-mask{position:absolute;top:0;left:0;bottom:0;right:0;background-color:rgba(0,0,0,0.5);-webkit-transition:all .3s ease 0s;transition:all .3s ease 0s;opacity:1}._picker-wrapper{position:absolute;bottom:0;width:100%;-webkit-transition:all .3s ease;transition:all .3s ease}._picker-head{position:relative;height:50px;line-height:50px;background-color:#f4f4f4;overflow:hidden;text-align:center}._picker-title{font-size:16px;font-weight:bold;width:68%;margin:0 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}._picker-btn-cancel,._picker-btn-confirm{font-size:16px;color:#888;text-decoration:none;position:absolute;left:0;top:0;bottom:0;width:16%}._picker-btn-confirm{color:#0c86ff;left:initial;right:0}._picker-content{display:-webkit-box;display:-webkit-flex;display:flex;height:220px;background-color:#fff;font-size:18px;text-align:center;overflow:hidden;position:relative}._picker-content:before{content:'';position:absolute;left:0;right:0;bottom:120px;top:0;pointer-events:none;background:linear-gradient(180deg,hsla(0,0%,100%,.9),hsla(0,0%,100%,.6));border-bottom:solid 1px #ddd;z-index:2}._picker-content:after{content:'';position:absolute;left:0;right:0;bottom:0;top:130px;pointer-events:none;background:linear-gradient(0deg,hsla(0,0%,100%,.9),hsla(0,0%,100%,.6));border-top:solid 1px #ddd;z-index:2}._picker-col{-webkit-box-flex:1;-webkit-flex:1;flex:1;position:relative}._picker-col-inner{position:absolute;width:100%;height:100%;left:0;right:0;top:0;bottom:0}._picker-data-list{padding:0;margin:10px 0}._picker-data-list.animate{-webkit-transition:transform .3s ease 0s;transition:transform .3s ease 0s}._picker-data-list>li{list-style:none;height:30px;line-height:30px}._picker-container.hide{pointer-events:none;visibility:hidden}._picker-container.hide ._picker-mask{opacity:0}._picker-container.hide ._picker-wrapper{bottom:-100%}";
    document.body.appendChild(style);
    window.PickerView = PickerView;
}(window));

if (typeof define === "function" && define.amd) {
    define("pickerView", [], function () {
        return PickerView;
    });
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = PickerView;
} 
