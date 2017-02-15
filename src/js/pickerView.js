/*
 * @author 梁沛聪
 * @email t-cong@163.com
 * @description 移动端多级联动选择器 
 * @version 0.0.1
 */
'use strict';

;(function(window){
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
				currY: 0,
				itemStartY: 0,
				top: 0,
				bottom: 0
			};
	    	// 生成选择器Dom结构
	    	this.createPickerDom(this.pickerOpts);

			// 记录选择器对应的dom
			this._pMaks = document.querySelector('.' + this.prefix);
			this.cols = document.querySelectorAll('.' + this.prefix + ' ._picker-col');
			this.col_list = document.querySelectorAll('.' + this.prefix + ' ._picker-data-list');
			this.btnCancel = document.querySelector('.' + this.prefix + ' ._picker-btn-cancel');
			this.btnConfirm = document.querySelector('.' + this.prefix + ' ._picker-btn-confirm');
			this.selector = document.getElementById(this.pickerOpts.selector);

			// 绑定选择器的事件
			this.bind();
	}

	PickerView.prototype = {
		bind: function() {
			var _self = this;

			// 选择取消事件
			this.btnCancel.addEventListener('touchend',function() {
	            if(typeof _self.pickerOpts.onCancel == "function") {
	                _self.pickerOpts.onCancel();
	            }
	            _self._pMaks.className = '_picker-mask hide';
			},false);

			// 选择确定事件
			this.btnConfirm.addEventListener('touchend',function() {
				if(typeof _self.pickerOpts.onConfirm == "function") {
	                var values = [];
	                // 获取每一个当前选中值 没有的话默认第一个
	                for(var i = 0; i < _self.pickerOpts.cols.length; i++) {
	                    if(_self.pickerOpts.cols[i].currVal) {
	                        values.push(_self.pickerOpts.cols[i].currVal);
	                    } else {
	                        values.push(_self.pickerOpts.cols[i].values[0]);
	                    }
	                }
	                _self.pickerOpts.onConfirm(values);
				}
	            _self._pMaks.className = '_picker-mask hide';
			},false);

			// 唤起选择器事件
			this.selector.addEventListener('touchend',function() {
	            _self._pMaks.className = '_picker-mask ' + _self.prefix;
			},false);

	        // 绑定选项滑动事件
	        for(var i = 0; i < this.cols.length; i++) {
	            this.cols[i].addEventListener('touchstart',_self.touchEventCallBack(i,'touchstart',_self.pos),false);

	            this.cols[i].addEventListener('touchmove',_self.touchEventCallBack(i,'touchmove',_self.pos),false);

	            this.cols[i].addEventListener('touchend',_self.touchEventCallBack(i,'touchend',_self.pos),false);
	        }
		},
		touchEventCallBack: function(index,event,pos) {
	        var _self = this;

			// 闭包形式以传参
			return function(e) {
				e.preventDefault();
	            switch(event) {
					case 'touchstart':
						// 计算起始每个值的位置
						pos.startY = e.touches[0].clientY;
						pos.currY = pos.itemStartY =  (3-_self.pickerOpts.cols[index].currIndex)*_self.itemHeight;
						pos.top = 3*_self.itemHeight;
						pos.bottom = (3-(_self.pickerOpts.cols[index].values.length - 1))*_self.itemHeight;
						break;
					case 'touchmove':
	                    // 移动的位置
	                    pos.moveY = e.changedTouches[0].clientY;
	                    // 动态计算当前位置
	                    pos.currY = pos.itemStartY + (pos.moveY - pos.startY);
						_self.col_list[index].setAttribute('style','-webkit-transform:translateY(' + pos.currY + 'px);transform:translateY(' + pos.currY + 'px)');
						break;
					case 'touchend':
	                    // 结束的位置
	                    pos.endY = e.changedTouches[0].clientY;
	                    var
							currIndex = Math.round((pos.startY - pos.endY)/_self.itemHeight) + _self.pickerOpts.cols[index].currIndex,
							len = _self.pickerOpts.cols[index].values.length;
						if(currIndex < 0) {
							currIndex = 0;
						} else if(currIndex >= len) {
							currIndex = len - 1;
						}
	                    // 更新当前选中值
	                    _self.pickerOpts.cols[index].currIndex = currIndex;
	                    _self.pickerOpts.cols[index].currVal = _self.pickerOpts.cols[index].values[currIndex];
	                    _self.col_list[index].setAttribute('style','-webkit-transform:translateY('+(3-currIndex)*_self.itemHeight+'px);transform:translateY('+(3-currIndex)*_self.itemHeight+'px);');
	                    // 选中事件回调
						if(typeof _self.pickerOpts.onOptionSelected == 'function') {
	                        _self.pickerOpts.onOptionSelected(index,_self.pickerOpts.cols[index].currIndex,_self.pickerOpts.cols[index].currVal);
						}
						break;
				}
			}
		},
	    // 创建选择器的Dom结构
	    createPickerDom: function(opts) {
			var mainDom = '';
			for(var i = 0; i < opts.cols.length; i++) {
				// 如果有当前项
				if(opts.cols[i].currVal) {
	                var temp = opts.cols[i].values.indexOf(opts.cols[i].currVal);
	                if(temp === -1) {
	                    opts.cols[i].currIndex = 0;
	                    opts.cols[i].currVal = opts.cols[i].values[0];
					} else {
	                    opts.cols[i].currIndex = temp;
					}
				} else {
	                // 如果没有当前项 默认第一项
	                opts.cols[i].currIndex = 0;
					opts.cols[i].currVal = opts.cols[i].values[0];
				}
				mainDom += '<div class="_picker-col">';

	            mainDom += this.setOptions(opts.cols[i]);

				mainDom += '</div>';
			}
			var
				dom = '<div class="_picker-mask hide ' + this.prefix + '">' +
							'<div class="_picker-wrapper">' +
								'<div class="_picker-head">' +
									'<h3 class="_picker-title">' + opts.title + '</h3>' +
									'<a class="_picker-btn-cancel" href="javascript:;">取消</a>' +
									'<a class="_picker-btn-confirm" href="javascript:;">确定</a>' +
								'</div>' +
								'<div class="_picker-content">' + mainDom + '</div>' +
							'</div>' +
					  '</div>';

			// 外层加个容器再append到body上，以免直接追加到body的innerHTML会把body里的dom重新构建，绑定事件也会被清除掉
			var wrapper = document.createElement('div');
			wrapper.innerHTML = dom;
			document.body.appendChild(wrapper);
		},
		// 设置选择器里的列内容
		setOptions: function(col) {
			if(col.currVal) {
				var temp = col.values.indexOf(col.currVal);
				if(temp === -1) {
	                col.currVal = col.values[0];
	                col.currIndex = 0;
				} else {
	                col.currIndex = temp;
				}
			} else {
	            // 如果没有当前项 默认第一个
	            col.currVal = col.values[0];
	            col.currIndex = 0;
			}
			var
				dom  = '<ul class="_picker-data-list" style="-webkit-transform:translateY(' + (3-col.currIndex)*this.itemHeight + 'px);transform:translateY(' + (3-col.currIndex)*this.itemHeight + 'px)">';

			for(var i = 0; i < col.values.length; i++) {
				dom += '<li>' + col.values[i] + '</li>';
			}

			return dom + '</ul>';
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

	window.PickerView = PickerView;

}(window));

	
if (typeof define === "function" && define.amd) {
    define("pickerView", [], function () {
        return PickerView;
    });
}
