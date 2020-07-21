const app = getApp()

Page({
    data: {
        healthy_array: ['健康', '有发热症状', '感冒', '咳嗽'],
        healthy_index: 0,
        username: '',
        age: '',
        adress: '',
        healthy: '',
        submit_time: '',
        imgUrl: ''
    },


    onShow: function () {
        const db = wx.cloud.database()
        // 查询当前用户所有的 counters
        db.collection('user_info').where({
            _openid: this.data.openid,
        }).orderBy('submit_time', 'desc').get({
            success: res => {
                console.log(res)
                this.setData({
                    age: res.data[0].age,
                    adress: res.data[0].adress,
                    username: res.data[0].username,
                    healthy: res.data[0].healthy,
                    imgUrl:  res.data[0].file_ID,
                    submit_time: this.formatTime(res.data[0].submit_time),
                })
                console.log('[数据库] [查询记录] 成功: ', res)
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
            }
        })
    },
    /**
     * new Date() ---> 转化为 年 月 日 时 分 秒
     * let date = new Date();
     * date: 传入参数日期 Date
     */
    formatTime: function (date) {
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
    },

    formatNumber: function (n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }

})
