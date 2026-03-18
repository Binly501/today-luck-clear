/**
 * 音效管理系统
 * 支持微信小程序音频播放
 */

// 音效文件映射
const audioMap = {
  0: 'fire.mp3',      // 烧掉 - 燃烧音效
  1: 'wind.mp3',      // 吹走 - 风声
  2: 'trash.mp3',     // 垃圾桶 - 丢入 + 盖盖
  3: 'purify.mp3',    // 净化 - 治愈音效
  4: 'water.mp3',     // 冲走 - 水声
  5: 'tear.mp3',      // 撕碎 - 撕纸声
  6: 'step.mp3'       // 踩碎 - 踩踏声
};

// 成功音效
const successAudio = 'success.mp3';

// 音频实例缓存
const audioInstances = {};

/**
 * 播放音效
 * @param {number} methodIndex - 清除方式索引
 * @param {boolean} enabled - 是否启用音效
 */
export function playEffect(methodIndex, enabled = true) {
  if (!enabled) return;
  
  const audioName = audioMap[methodIndex];
  if (!audioName) return;
  
  playAudio(`/static/audio/${audioName}`);
}

/**
 * 播放成功音效
 * @param {boolean} enabled 
 */
export function playSuccess(enabled = true) {
  if (!enabled) return;
  playAudio(`/static/audio/${successAudio}`);
}

/**
 * 播放音频
 * @param {string} src - 音频文件路径
 */
function playAudio(src) {
  try {
    // 检查是否已有实例在播放
    if (audioInstances[src]) {
      audioInstances[src].stop();
      audioInstances[src].destroy();
    }
    
    // 创建新的音频实例
    const audio = uni.createInnerAudioContext();
    audio.src = src;
    audio.autoplay = true;
    
    // 错误处理
    audio.onError((err) => {
      console.log('音频播放失败:', err);
      delete audioInstances[src];
    });
    
    // 播放完成后清理
    audio.onEnded(() => {
      audio.stop();
      audio.destroy();
      delete audioInstances[src];
    });
    
    // 缓存实例
    audioInstances[src] = audio;
    
  } catch (e) {
    console.log('创建音频失败:', e);
  }
}

/**
 * 预加载所有音效
 * 在应用启动时调用，减少首次播放延迟
 */
export function preloadAll() {
  const allAudios = [...Object.values(audioMap), successAudio];
  
  allAudios.forEach(audioName => {
    const src = `/static/audio/${audioName}`;
    const audio = uni.createInnerAudioContext();
    audio.src = src;
    
    // 预加载但不播放
    audio.onCanplay(() => {
      // 加载完成后可以选择不播放
      // audio.stop();
    });
    
    audio.onError((err) => {
      console.log(`音频 ${audioName} 预加载失败:`, err);
    });
  });
}

/**
 * 停止所有正在播放的音频
 */
export function stopAll() {
  Object.values(audioInstances).forEach(audio => {
    audio.stop();
    audio.destroy();
  });
  Object.keys(audioInstances).forEach(key => {
    delete audioInstances[key];
  });
}

/**
 * 获取音效文件列表
 * 用于检查哪些音效缺失
 */
export function getAudioList() {
  return {
    effects: audioMap,
    success: successAudio,
    total: Object.keys(audioMap).length + 1
  };
}
