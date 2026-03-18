<template>
  <view class="animation-container" :style="{ background: currentBg }">
    <!-- 动画内容 -->
    <view class="animation-content">
      <!-- 撕碎动画特殊处理 -->
      <view v-if="currentMethod === 5" class="tear-container" @touchstart="startTear" @touchmove="onTear" @touchend="endTear">
        <view class="tear-paper" :style="paperStyle">
          <text class="tear-text">滑动屏幕撕碎晦气</text>
        </view>
        <view class="tear-line" :style="tearLineStyle"></view>
      </view>

      <!-- 踩碎动画特殊处理 -->
      <view v-else-if="currentMethod === 6" class="step-container" @touchstart="startStep">
        <view class="step-paper" :style="{ opacity: paperOpacity }">
          <text class="step-text">点击屏幕踩碎晦气</text>
        </view>
        <view v-for="(foot, i) in footPrints" :key="i" class="foot-print" :style="foot.style">
          👟
        </view>
      </view>

      <!-- 其他动画 -->
      <view v-else class="effect-container">
        <!-- 火焰 -->
        <view v-if="currentMethod === 0" class="fire-effect">
          <view class="fire" v-for="i in 5" :key="i" :style="fireStyle(i)"></view>
        </view>
        
        <!-- 风吹 -->
        <view v-if="currentMethod === 1" class="wind-effect">
          <view class="wind-line" v-for="i in 10" :key="i" :style="windStyle(i)"></view>
        </view>
        
        <!-- 垃圾桶 -->
        <view v-if="currentMethod === 2" class="trash-effect">
          <view class="trash-can">🗑️</view>
          <view class="falling-paper" :style="fallStyle"></view>
        </view>
        
        <!-- 净化 -->
        <view v-if="currentMethod === 3" class="purify-effect">
          <view class="light-beam" v-for="i in 8" :key="i" :style="lightStyle(i)"></view>
          <view class="sparkle" v-for="i in 12" :key="i" :style="sparkleStyle(i)"></view>
        </view>
        
        <!-- 水流 -->
        <view v-if="currentMethod === 4" class="water-effect">
          <view class="water-wave" v-for="i in 5" :key="i" :style="waveStyle(i)"></view>
          <view class="floating-paper" :style="floatStyle"></view>
        </view>
      </view>
    </view>

    <!-- 完成后的结果页 -->
    <view v-if="animationComplete" class="result-section">
      <view class="success-icon">✅</view>
      <text class="success-text">晦气已清除</text>
      <text class="blessing-text">{{ blessing }}</text>
      
      <view class="result-buttons">
        <button class="btn-home" @click="goHome">返回首页</button>
        <button class="btn-save" @click="saveImage">保存图片</button>
      </view>
    </view>

    <!-- 下一个动画按钮（多动画时显示） -->
    <view v-if="animationComplete && hasMore" class="next-btn">
      <button class="btn-next" @click="nextAnimation">下一个清除方式 →</button>
    </view>
  </view>
</template>

<script>
import { playEffect, playSuccess } from '@/utils/audio.js';
import { getUserSettings } from '@/utils/storage.js';

export default {
  data() {
    return {
      methodIndices: [],
      currentIndex: 0,
      currentMethod: 0,
      blessing: '',
      animationComplete: false,
      hasMore: false,
      currentBg: '#1a1a2e',
      
      // 撕碎动画
      tearStartY: 0,
      tearProgress: 0,
      
      // 踩碎动画
      paperOpacity: 1,
      footPrints: [],
      
      // 其他动画样式
      animState: 0
    };
  },
  computed: {
    paperStyle() {
      return {
        transform: `translateY(${this.tearProgress * 2}px) rotate(${this.tearProgress}deg)`,
        opacity: 1 - this.tearProgress / 200
      };
    },
    tearLineStyle() {
      return {
        top: `${this.tearStartY + this.tearProgress}px`
      };
    },
    fallStyle() {
      return {
        animation: `fallDown 1.5s ease-in ${this.animState}s`
      };
    },
    floatStyle() {
      return {
        animation: `floatAway 2s ease-out ${this.animState}s`
      };
    }
  },
  onLoad(options) {
    if (options.methods) {
      this.methodIndices = JSON.parse(decodeURIComponent(options.methods));
    }
    if (options.blessing) {
      this.blessing = decodeURIComponent(options.blessing);
    }
    
    if (this.methodIndices.length > 0) {
      this.currentMethod = this.methodIndices[0];
      this.hasMore = this.methodIndices.length > 1;
      this.playAnimation();
    }
  },
  methods: {
    playAnimation() {
      this.animationComplete = false;
      this.currentBg = this.getBgColor();
      
      // 播放音效（如果开启）
      const settings = getUserSettings();
      playEffect(this.currentMethod, settings.soundEnabled);
      
      // 根据动画类型设置时长
      const duration = this.getAnimationDuration();
      
      setTimeout(() => {
        this.animationComplete = true;
        // 播放成功音效
        playSuccess(settings.soundEnabled);
      }, duration);
    },
    
    getBgColor() {
      const colors = ['#1a1a2e', '#1e3a5f', '#2d3436', '#2c3e50', '#1a365d', '#2d2d2d', '#1a1a1a'];
      return colors[this.currentMethod] || '#1a1a2e';
    },
    
    getAnimationDuration() {
      const durations = [2500, 2000, 2000, 2500, 2500, 3000, 3000];
      return durations[this.currentMethod] || 2500;
    },
    
    playSound() {
      // 实际开发需要添加音效文件
      // const audio = uni.createInnerAudioContext();
      // audio.src = `/static/audio/${this.currentMethod}.mp3`;
      // audio.play();
    },
    
    // 撕碎动画
    startTear(e) {
      this.tearStartY = e.touches[0].clientY;
    },
    onTear(e) {
      const currentY = e.touches[0].clientY;
      this.tearProgress = Math.min(200, Math.max(0, currentY - this.tearStartY));
      
      if (this.tearProgress >= 180) {
        this.animationComplete = true;
      }
    },
    endTear() {
      if (this.tearProgress < 180) {
        this.tearProgress = 0;
      }
    },
    
    // 踩碎动画
    startStep() {
      this.paperOpacity = Math.max(0, this.paperOpacity - 0.2);
      this.footPrints.push({
        style: {
          top: `${Math.random() * 60 + 20}%`,
          left: `${Math.random() * 60 + 20}%`,
          transform: `rotate(${Math.random() * 360}deg)`
        }
      });
      
      if (this.paperOpacity <= 0) {
        this.animationComplete = true;
      }
    },
    
    // 动画样式生成
    fireStyle(i) {
      return {
        left: `${20 + i * 15}%`,
        animationDelay: `${i * 0.1}s`,
        height: `${60 + Math.random() * 40}rpx`
      };
    },
    windStyle(i) {
      return {
        top: `${i * 10}%`,
        animationDelay: `${i * 0.15}s`,
        width: `${100 + Math.random() * 100}rpx`
      };
    },
    lightStyle(i) {
      return {
        transform: `rotate(${i * 45}deg)`,
        animationDelay: `${i * 0.1}s`
      };
    },
    sparkleStyle(i) {
      return {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`
      };
    },
    waveStyle(i) {
      return {
        top: `${20 + i * 15}%`,
        animationDelay: `${i * 0.3}s`
      };
    },
    
    nextAnimation() {
      if (this.currentIndex < this.methodIndices.length - 1) {
        this.currentIndex++;
        this.currentMethod = this.methodIndices[this.currentIndex];
        this.hasMore = this.currentIndex < this.methodIndices.length - 1;
        this.resetAnimation();
        this.playAnimation();
      }
    },
    
    resetAnimation() {
      this.tearProgress = 0;
      this.paperOpacity = 1;
      this.footPrints = [];
      this.animState++;
    },
    
    goHome() {
      uni.navigateBack({
        delta: 1
      });
    },
    
    saveImage() {
      // 生成分享图
      uni.showLoading({ title: '生成中...' });
      
      setTimeout(() => {
        uni.hideLoading();
        uni.showModal({
          title: '保存图片',
          content: '图片已保存到相册（实际开发需实现 canvas 绘图）',
          confirmText: '好的'
        });
      }, 1000);
    }
  }
}
</script>

<style scoped>
.animation-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background 0.5s;
}

.animation-content {
  width: 100%;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 撕碎动画 */
.tear-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.tear-paper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f5f5f5;
  padding: 40rpx 60rpx;
  border-radius: 8rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.3);
}

.tear-text {
  font-size: 32rpx;
  color: #333;
}

.tear-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2rpx;
  background: rgba(255,255,255,0.5);
}

/* 踩碎动画 */
.step-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.step-paper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f5f5f5;
  padding: 40rpx 60rpx;
  border-radius: 8rpx;
  transition: opacity 0.3s;
}

.step-text {
  font-size: 32rpx;
  color: #333;
}

.foot-print {
  position: absolute;
  font-size: 60rpx;
  animation: stepIn 0.3s ease-out;
}

@keyframes stepIn {
  0% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* 火焰动画 */
.fire-effect {
  display: flex;
  gap: 10rpx;
}

.fire {
  width: 40rpx;
  background: linear-gradient(to top, #ff6b35, #f7c548, transparent);
  border-radius: 50% 50% 0 0;
  animation: fireBurn 0.8s ease-in-out infinite;
}

@keyframes fireBurn {
  0%, 100% { height: 60rpx; opacity: 0.8; }
  50% { height: 100rpx; opacity: 1; }
}

/* 风吹动画 */
.wind-effect {
  position: relative;
  width: 100%;
  height: 100%;
}

.wind-line {
  position: absolute;
  height: 2rpx;
  background: rgba(255,255,255,0.3);
  border-radius: 2rpx;
  animation: windBlow 1.5s linear infinite;
  left: -200rpx;
}

@keyframes windBlow {
  0% { left: -200rpx; opacity: 0; }
  50% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

/* 垃圾桶动画 */
.trash-effect {
  text-align: center;
}

.trash-can {
  font-size: 120rpx;
  margin-bottom: 40rpx;
}

.falling-paper {
  width: 80rpx;
  height: 100rpx;
  background: #f5f5f5;
  position: absolute;
  top: -100rpx;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4rpx;
}

@keyframes fallDown {
  0% { top: -100rpx; opacity: 1; }
  100% { top: 300rpx; opacity: 0; }
}

/* 净化动画 */
.purify-effect {
  position: relative;
  width: 300rpx;
  height: 300rpx;
}

.light-beam {
  position: absolute;
  width: 4rpx;
  height: 150rpx;
  background: linear-gradient(to bottom, #fff, transparent);
  top: 50%;
  left: 50%;
  transform-origin: top center;
  animation: lightPulse 1.5s ease-in-out infinite;
}

@keyframes lightPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.sparkle {
  position: absolute;
  width: 20rpx;
  height: 20rpx;
  background: #fff;
  border-radius: 50%;
  animation: sparkle 1s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}

/* 水流动画 */
.water-effect {
  position: relative;
  width: 100%;
  height: 100%;
}

.water-wave {
  position: absolute;
  width: 100%;
  height: 40rpx;
  background: rgba(100, 180, 255, 0.3);
  border-radius: 50%;
  animation: waveFlow 2s ease-in-out infinite;
}

@keyframes waveFlow {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}

.floating-paper {
  width: 80rpx;
  height: 100rpx;
  background: #f5f5f5;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4rpx;
}

@keyframes floatAway {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(200%, -50%) scale(0.5); opacity: 0; }
}

/* 结果页 */
.result-section {
  text-align: center;
  padding: 40rpx;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.success-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.success-text {
  font-size: 48rpx;
  color: white;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.blessing-text {
  font-size: 32rpx;
  color: rgba(255,255,255,0.9);
  display: block;
  margin-bottom: 60rpx;
  line-height: 1.6;
}

.result-buttons {
  display: flex;
  gap: 30rpx;
  justify-content: center;
}

.btn-home, .btn-save {
  padding: 24rpx 48rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
  border: none;
}

.btn-home {
  background: rgba(255,255,255,0.2);
  color: white;
}

.btn-save {
  background: white;
  color: #1a1a2e;
}

.next-btn {
  margin-top: 40rpx;
}

.btn-next {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 20rpx 40rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
}
</style>
