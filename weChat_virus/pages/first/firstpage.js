const app = getApp()

Page({
    data: {
        healthy_array: ['健康', '有发热症状', '感冒', '咳嗽'],
        healthy_index: 0,
        username: '',
        age: '',
        adress: '',
        healthy: '',
        file_ID: ''
    },

    // 上传图片
    doUpload: function () {
        var that = this;
        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {

                wx.showLoading({
                    title: '上传中',
                })
                const filePath = res.tempFilePaths[0]
                // 上传图片
                const cloudPath = 'my-image' + that.wxuuid() + filePath.match(/\.[^.]+?$/)[0]
                wx.cloud.uploadFile({
                    cloudPath,
                    filePath,
                    success: res => {
                        console.log('[健康码上传] 成功：', res)
                        wx.showToast({
                            icon: 'none',
                            title: '上传成功',
                        })
                        app.globalData.fileID = res.fileID
                        app.globalData.cloudPath = cloudPath
                        app.globalData.imagePath = filePath
                        that.setData({
                            file_ID: res.fileID
                        })
                    },
                    fail: e => {
                        console.error('[健康码上传] 失败：', e)
                        wx.showToast({
                            icon: 'none',
                            title: '上传失败',
                        })
                    },
                    complete: () => {
                        wx.hideLoading()
                    }
                })

            },
            fail: e => {
                console.error(e)
            }
        })
    },
    getusernameInput: function (e) {
        this.setData({
            username: e.detail.value,
        })
    },
    getageInput: function (e) {
        this.setData({
            age: e.detail.value,
        })
    },
    getadressInput: function (e) {
        this.setData({
            adress: e.detail.value,
        })
    },
    gethealthyInput: function (e) {
        this.setData({
            healthy: e.detail.value,
        })
    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            healthy_index: e.detail.value,
            healthy: this.data.healthy_array[e.detail.value]
        })
    }

    ,
    // 本人健康申报
    user_submit: function () {
        if (this.data.file_ID == '') {
            wx.showToast({
                icon: 'none',
                title: '请上传健康码'
            })
            return;
        }
        if (this.data.username == '' || this.data.age == ''
            || this.data.adress == '' || this.data.healthy == '') {
            wx.showToast({
                icon: 'none',
                title: '请将信息全部填写完成'
            })
            return;
        }
        const db = wx.cloud.database()
        db.collection('user_info').add({
            data: {
                username: this.data.username,
                age: this.data.age,
                adress: this.data.adress,
                healthy: this.data.healthy,
                file_ID: this.data.file_ID,
                submit_time: new Date()
            },
            success: res => {
                // 在返回结果中会包含新创建的记录的 _id
                wx.showToast({
                    title: '申报成功',
                })
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
                console.log(res);
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '新增记录失败'
                })
                console.error('[数据库] [新增记录] 失败：', err)
            }
        })
    },
    onQueryUser: function () {
        wx.navigateTo({
            url: '../healthy/healthy'
        })
    },
// 生成uuid
    wxuuid: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid
    }
})
