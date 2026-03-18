<script>
export default {
  onLaunch: function() {
    console.log('App Launch');
    // 初始化每日次数
    this.initDailyLimit();
  },
  onShow: function() {
    console.log('App Show');
    // 检查是否跨天，重置次数
    this.checkDayReset();
  },
  onHide: function() {
    console.log('App Hide');
  },
  methods: {
    initDailyLimit() {
      const today = this.getTodayStr();
      const stored = uni.getStorageSync('daily_limit');
      if (!stored || stored.date !== today) {
        uni.setStorageSync('daily_limit', {
          date: today,
          count: 0
        });
      }
    },
    checkDayReset() {
      const today = this.getTodayStr();
      const stored = uni.getStorageSync('daily_limit');
      if (stored && stored.date !== today) {
        uni.setStorageSync('daily_limit', {
          date: today,
          count: 0
        });
      }
    },
    getTodayStr() {
      const date = new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #E8F4F8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.container {
  padding: 20rpx;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 40rpx;
}
</style>
