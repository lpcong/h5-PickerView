# h5-PickerView - 轻量移动端级联选择器
原生Javascript实现的移动端多级选择器，通过配置实现多级联动。支持AMD模块化加载方式。压缩后JS文件仅5K+！

## 效果图：
### 常用的级联选择器：
![常用的级联选择器](example/image/1.gif)

### 日期选择器：
![日期选择器](example/image/2.gif)

### 多级选择器：
![多级选择器](example/image/3.gif)


## 使用：
### 引用：
方法一：页面引入**dest/js/pickerView.style.min.js**，脚本中已包含样式动态注入
``` javascript
// 样式&脚本
<script type="text/javascript" src="../dest/js/pickerView.style.min.js"></script>
```
方法二：页面引入**dest/css/pickerView.min.css**和**dest/js/pickerView.min.js**，脚本与样式分离
``` javascript
// 样式
<link rel="stylesheet" href="../dest/css/pickerView.min.css" />

// 脚本
<script type="text/javascript" src="../dest/js/pickerView.min.js"></script>
```

### 初始化：
``` javascript
var pickerView = new PickerView(opts);
```
opts是可选的配置参数，具体如下：

#### cols
cols是选择器每一列的配置参数，具体格式如下：
``` javascript
{
    cols: [
            {
                values: ['广东']
            }, {
                curVal: '佛山',   // curVal是默认当前项，选填
                values: ['深圳','佛山']
            }, {
                curVal: '三水',
                values: ['顺德','三水','高明','禅城','南海']
            }
     ]
}
```
其中values数组里是参数列的值，curVal设置的是默认当前项，必须是values数组里面的某一项值，选填，不设置默认第一项为当前项。另外，cols数组的长度，决定了选择器显示的列数。

#### selector：
触发选择器的DOM元素id值，选填

#### title
选择器的标题，选填

#### type
选择器类型 选填
* 默认是常规多级选择器
* date 日期选择器，当类型为date是，附带几个额外的参数
  * start 起始年份，选填，默认1990
  * end 结束年份，选填，默认当前年份
  * curYear, curMonth, curDay 分别是当前默认选中年月日，均选填
``` javascript
var pickerView = new PickerView({
    type: 'date',
    start: 2000,
    end: 2019,
    curYear: 2018,
    onConfirm: function(values) {}
});
``` 

#### onSelected
选择器中某一列的项被选中后触发的回调函数，会回传三个参数：
* colIndex 被触发选中的列下标，从0开始计算
* selectedIndex 被触发选中的项下标，从0开始计算
* selectedValue 被触发选中的项的值
通过onSelected结合PickerView.prototype.updateCol函数（下面介绍该函数），来实现多级联动。

#### onConfirm
确定按钮被点击后的回调函数，会回传一个参数：
* values 顺序返回的全部选中值数组

#### onCancel
取消按钮被点击后的回调函数

#### PickerView.prototype.show()
主动触发选择器的显示
``` javascript
// 唤起选择器
pickerView.show();
``` 

#### PickerView.prototype.updateCol(colIndex, colContent)
是个可选的更新列内容的函数。其中：
* colIndex 需要更新的列下标，从0开始计算
* colContent 被替换的列的内容，格式可以参照上面的cols参数，例子如下：

``` javascript
// 更新第三列的选择内容
pickerView.updateCol(2, {
        curVal: '宝安',
        values: ['南山','宝安','福田','罗湖','龙岗','盐田']
})；
```

具体的完整demo，可以参照example内demo。
