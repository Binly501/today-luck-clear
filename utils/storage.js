/**
 * 本地存储工具函数
 */

// 获取今日剩余清除次数
export function getTodayRemaining() {
  const limit = uni.getStorageSync('daily_limit') || { date: '', count: 0 };
  const today = getTodayStr();
  
  if (limit.date !== today) {
    return 3; // 新的一天，重置为 3 次
  }
  
  return Math.max(0, 3 - limit.count);
}

// 消耗清除次数
export function useClearCount(count = 1) {
  const today = getTodayStr();
  const limit = uni.getStorageSync('daily_limit') || { date: today, count: 0 };
  
  if (limit.date !== today) {
    limit.date = today;
    limit.count = 0;
  }
  
  limit.count += count;
  uni.setStorageSync('daily_limit', limit);
  
  return Math.max(0, 3 - limit.count);
}

// 添加清除记录（只存日期，不存内容）
export function addClearRecord() {
  const records = uni.getStorageSync('clear_records') || [];
  const today = getTodayStr();
  const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  
  // 检查今天是否已有记录
  const exists = records.find(r => r.date === today);
  if (!exists) {
    records.unshift({
      date: today,
      time: time,
      count: 1
    });
  } else {
    exists.count += 1;
  }
  
  uni.setStorageSync('clear_records', records);
  return records;
}

// 获取清除记录
export function getClearRecords() {
  return uni.getStorageSync('clear_records') || [];
}

// 获取今日字符串 YYYY-MM-DD
export function getTodayStr() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 获取用户设置
export function getUserSettings() {
  const defaultSettings = {
    theme: 'default', // default, healing, simple
    soundEnabled: true,
    adRemoved: false,
    shareCount: 0
  };
  return uni.getStorageSync('user_settings') || defaultSettings;
}

// 保存用户设置
export function saveUserSettings(settings) {
  uni.setStorageSync('user_settings', { ...getUserSettings(), ...settings });
}

// 增加分享次数
export function addShareCount() {
  const settings = getUserSettings();
  const today = getTodayStr();
  
  if (settings.lastShareDate !== today) {
    settings.shareCount = 0;
    settings.lastShareDate = today;
  }
  
  if (settings.shareCount < 2) {
    settings.shareCount += 1;
    saveUserSettings(settings);
    return true; // 成功增加
  }
  return false; // 已达上限
}

// 获取分享增加的次数
export function getShareBonus() {
  const settings = getUserSettings();
  const today = getTodayStr();
  
  if (settings.lastShareDate !== today) {
    return 0;
  }
  return settings.shareCount;
}
