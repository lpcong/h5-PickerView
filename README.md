# h5-PickerView
原生Javascript实现的移动端多级选择器，可通过配置实现多级联动。压缩后JS文件只有3.96KB。

## 效果图：
##### 常用的多级联动选择：
![](http://okzuu09cn.bkt.clouddn.com/1.gif)

##### 普通日期选择：
![](http://okzuu09cn.bkt.clouddn.com/2.gif)

##### 多行多选择器：
![](http://okzuu09cn.bkt.clouddn.com/3.gif)

-------------

## 使用：
在页面中引入**pickerView.css**和**pickerView.js**
#####初始化：
```
var pickerView = new PickerView(opts);
```
opts是可选的配置参数，具体如下：

**selector：**
必填项，是触发选择器的dom元素id值。

**title**
选择器的标题。

**col**
col是选择器每一列的配置参数，具体格式如下：
```
{
	cols:[
            {
                values: ['广东']
            },{
                currVal: '佛山',   //currVal是默认当前项，可选
                values: ['深圳','佛山']
            },{
                currVal: '三水',
                values: ['顺德','三水','高明','禅城','南海']
            }
     ]
}
```
其中values数组里是参数列的每一个值，currVal是设置的默认当前项，必须是values数组里面的某一项值，可选，没设置默认第一项为当前项。另外，cols里面配置的对象项数，决定了选择器显示的列数。

**onOptionSelected**
选择器中某一列的项被选中后触发的回调函数，会回传三个参数：
* colIndex 被触发选中的列下标，从0开始计算
* selectedIndex 被触发选中的项下标，从0开始计算
* selectedValue 被触发选中的项的值
通过onOptionSelected结合pickerView.prototype.updateCol函数（下面介绍该函数），可以实现多级联动。

**onConfirm**
选择器确定按钮被点击后触发的回调函数，会回传一个参数：
* values 顺序返回的全部选中值数组

**onCancel**
选择器取消按钮被点击后触发的回调函数，无传参

**pickerView.prototype.updateCol(colIndex,colContent)**
是个可选的更新列内容的函数。其中：
* colIndex 需要更新的列下标，从0开始计算
* colContent 被替换的列的内容，格式可以参照上面的cols参数，例子如下：

```
pickerView.updateCol(2,{
        currVal: '宝安',
        values: ['南山','宝安','福田','罗湖','龙岗','盐田']
})；
```
上面是给新建的pickerView对象更新第三列的选择内容。

具体的完整demo，可以参照源码的demo1/2/3.html。
