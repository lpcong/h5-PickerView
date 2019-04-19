# h5-PickerView - 轻量移动端级联选择器
原生Javascript实现的移动端多级选择器，可通过配置实现多级联动。支持AMD模块化加载方式。压缩后JS文件仅5.23KB！

## 效果图：
##### 常用的级联选择器：
![常用的级联选择器](example/image/1.gif)

##### 日期选择器：
![日期选择器](example/image/2.gif)

##### 多级选择器：
![多级选择器](example/image/3.gif)

-------------

## 使用：
#### 引用：
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

#### 初始化：
``` javascript
var pickerView = new PickerView(opts);
```
opts是可选的配置参数，具体如下：

##### selector：
必填项，是触发选择器的dom元素id值。

##### title
选择器的标题。

##### col
col是选择器每一列的配置参数，具体格式如下：
``` javascript
{
    cols:[
            {
                values: ['广东']
            },{
                curVal: '佛山',   // curVal是默认当前项，可选
                values: ['深圳','佛山']
            },{
                curVal: '三水',
                values: ['顺德','三水','高明','禅城','南海']
            }
     ]
}
```
其中values数组里是参数列的每一个值，curVal是设置的默认当前项，必须是values数组里面的某一项值，可选，没设置默认第一项为当前项。另外，cols里面配置的对象项数，决定了选择器显示的列数。

##### onSelected
选择器中某一列的项被选中后触发的回调函数，会回传三个参数：
* colIndex 被触发选中的列下标，从0开始计算
* selectedIndex 被触发选中的项下标，从0开始计算
* selectedValue 被触发选中的项的值
通过onSelected结合pickerView.prototype.updateCol函数（下面介绍该函数），可以实现多级联动。

##### onConfirm
选择器确定按钮被点击后触发的回调函数，会回传一个参数：
* values 顺序返回的全部选中值数组

##### onCancel
选择器取消按钮被点击后触发的回调函数，无传参。

##### pickerView.prototype.updateCol(colIndex, colContent)
是个可选的更新列内容的函数。其中：
* colIndex 需要更新的列下标，从0开始计算
* colContent 被替换的列的内容，格式可以参照上面的cols参数，例子如下：

``` javascript
pickerView.updateCol(2,{
        curVal: '宝安',
        values: ['南山','宝安','福田','罗湖','龙岗','盐田']
})；
```
上面例子是给新建的pickerView对象更新第三列的选择内容。

具体的完整demo，可以参照源码的demo1/2/3.html。
