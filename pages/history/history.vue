<template>
  <view class="container">
    <view class="header">
      <text class="title">清除记录</text>
      <text class="subtitle">记录每一次放下</text>
    </view>

    <!-- 记录列表 -->
    <view v-if="records.length > 0" class="records-list">
      <view 
        v-for="(record, index) in records" 
        :key="index"
        class="record-item"
      >
        <view class="record-date">{{ record.date }}</view>
        <view class="record-info">
          <text class="record-status">✅ 已清除</text>
          <text class="record-count">{{ record.count }}次</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <text class="empty-icon">📝</text>
      <text class="empty-text">暂无清除记录</text>
      <text class="empty-hint">去首页写下你的不开心吧</text>
      <button class="btn-go-home" @click="goHome">去清除</button>
    </view>

    <!-- 底部说明 -->
    <view class="footer-note">
      <text class="note-text">💡 为保护隐私，仅记录日期和次数，不保存具体内容</text>
    </view>
  </view>
</template>

<script>
import { getClearRecords } from '@/utils/storage.js';

export default {
  data() {
    return {
      records: []
    };
  },
  onShow() {
    this.loadRecords();
  },
  methods: {
    loadRecords() {
      this.records = getClearRecords();
    },
    goHome() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F4F8 0%, #F5F9FC 100%);
  padding: 40rpx 30rpx;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #2D3748;
  display: block;
}

.subtitle {
  font-size: 28rpx;
  color: #718096;
  margin-top: 10rpx;
  display: block;
}

.records-list {
  margin-bottom: 40rpx;
}

.record-item {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);
}

.record-date {
  font-size: 32rpx;
  font-weight: bold;
  color: #2D3748;
  margin-bottom: 10rpx;
}

.record-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-status {
  font-size: 28rpx;
  color: #48BB78;
}

.record-count {
  font-size: 26rpx;
  color: #718096;
}

.empty-state {
  text-align: center;
  padding: 80rpx 30rpx;
  background: white;
  border-radius: 24rpx;
  margin-bottom: 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 36rpx;
  color: #4A5568;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: #718096;
  display: block;
  margin-bottom: 30rpx;
}

.btn-go-home {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 40rpx;
  font-size: 30rpx;
  padding: 20rpx 60rpx;
}

.footer-note {
  background: rgba(255,255,255,0.6);
  border-radius: 16rpx;
  padding: 24rpx;
}

.note-text {
  font-size: 24rpx;
  color: #718096;
  line-height: 1.6;
}
</style>
