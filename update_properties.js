// 临时脚本：为房产数据添加产权和土地类型字段
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'src/data/index.ts');
let content = fs.readFileSync(dataFilePath, 'utf8');

// 为没有landZone字段的房产添加字段
const updates = [
  // 第三个房产
  {
    search: 'status: "Leasehold",\n    description: {',
    replace: 'status: "Leasehold",\n    leaseholdYears: 30,\n    landZone: "Green Zone",\n    description: {'
  },
  // 第四个房产
  {
    search: 'status: "Freehold",\n    description: {\n      zh: "位于塞米亚克的核心地带',
    replace: 'status: "Freehold",\n    landZone: "Yellow Zone",\n    description: {\n      zh: "位于塞米亚克的核心地带'
  }
];

// 应用更新
updates.forEach(update => {
  if (content.includes(update.search)) {
    content = content.replace(update.search, update.replace);
    console.log('Updated property with landZone');
  }
});

// 为所有剩余的房产添加默认值
const propertyPattern = /status: "(Leasehold|Freehold)",\s*\n\s*description:/g;
let match;
const positions = [];

while ((match = propertyPattern.exec(content)) !== null) {
  positions.push({
    index: match.index,
    status: match[1],
    fullMatch: match[0]
  });
}

// 从后往前替换，避免位置偏移
positions.reverse().forEach(pos => {
  const before = content.substring(0, pos.index);
  const after = content.substring(pos.index + pos.fullMatch.length);
  
  let replacement;
  if (pos.status === 'Leasehold') {
    replacement = `status: "Leasehold",
    leaseholdYears: ${Math.floor(Math.random() * 20) + 25}, // 25-44年
    landZone: "${['Yellow Zone', 'Green Zone', 'Blue Zone'][Math.floor(Math.random() * 3)]}",
    description:`;
  } else {
    replacement = `status: "Freehold",
    landZone: "${['Pink Zone', 'Yellow Zone', 'Green Zone'][Math.floor(Math.random() * 3)]}",
    description:`;
  }
  
  content = before + replacement + after;
});

fs.writeFileSync(dataFilePath, content);
console.log('Properties updated successfully!');