(function(){
	require(['pickerView'],function(PickerView){
		// 初始化选择器
		var pickerView  = new PickerView({
			selector: 'bindPicker',
			title: '选择城市',
			cols:[
                {
                    values: ['广东']
                },
                {
                    currVal: '佛山',  //currVal是默认当前项，可选
                    values: ['深圳','佛山']
                },
                {
                    currVal: '三水',
                    values: ['顺德','三水','高明','禅城','南海']
                }
            ],
            onOptionSelected: function(colIndex, selectedIndex, selectedValue) {
                // 在这里更新列以达到多级联动目的
			    if(colIndex === 1) {
			        switch(selectedIndex) {
                        case 0:
                            // 深圳
                            pickerView.updateCol(colIndex+1,{
                                currVal: '宝安',
                                values: ['南山','宝安','福田','罗湖','龙岗','盐田']
                            })
                            break;
                        case 1:
                            // 佛山
                            pickerView.updateCol(colIndex+1,{
                                values: ['顺德','三水','高明','禅城','南海']
                            })
                            break;
                    }
                }
                console.log(colIndex,selectedIndex,selectedValue);
            },
            onConfirm: function(values) {
                document.getElementById('bindPicker').innerText = values;
            },
            onCancel: function() {
                console.log('cancel');
            }
		});
	});
}());