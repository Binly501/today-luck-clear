/**
 * 祝福语库
 */
export const blessings = [
  '晦气退散，好运降临 🌟',
  '烦恼清空，万事顺心 ✨',
  '坏情绪消失，好事发生 🌈',
  '往事清零，来日可期 🦋',
  '丢掉不开心，迎接小幸运 🍀',
  '轻装上阵，越来越好 🌱',
  '所有不顺，到此为止 🎋',
  '心若向阳，无畏悲伤 ☀️',
  '放过自己，拥抱温柔 🌸',
  '今天的不开心就止于此吧 🌙',
  '你值得所有美好 💫',
  '深呼吸，一切都会好的 🌬️',
  '明天会是新的一天 🌅',
  '保持热爱，奔赴山海 🏔️',
  '温柔待自己，世界也会温柔待你 💕'
];

// 随机获取一条祝福语
export function getRandomBlessing() {
  const index = Math.floor(Math.random() * blessings.length);
  return blessings[index];
}
