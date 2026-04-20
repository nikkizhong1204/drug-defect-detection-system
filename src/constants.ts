import { InspectionItem, DefectType } from './types';

const DEFECT_POOL: DefectType[] = [
  '裂纹', '崩边', '缺损', '气泡', '黑点', '混料', '包衣脱落', '色差', '破碎', 
  '针孔', '字体断裂', '变形', '破损', '异物', '空泡', '顶凹', '双帽',
  '粘连', '大小丸', '漏液', '异形'
];

/**
 * 统一浅灰占位图 (SVG Base64)
 */
export const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNGNEY2RjkiLz48cGF0aCBkPSJNNjAgNDBMMzAgOTBIOXBNNjAgNDBMODAgOTAiIHN0cm9rZT0iI0QxRDVEQiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+";

/**
 * 模拟工业级检测数据
 * 每一项都包含唯一的 ID、时间戳、检测状态、置信度以及位置坐标。
 */
export const MOCK_GRID_ITEMS: InspectionItem[] = Array.from({ length: 60 }).map((_, i) => {
  const isDefect = Math.random() > 0.9;
  const status: DefectType = isDefect ? DEFECT_POOL[Math.floor(Math.random() * DEFECT_POOL.length)] : '正常';
  
  // 仅对前几个样本使用“真实”图片路径
  let imageUrl = PLACEHOLDER_IMAGE;
  let defectLabel: string | undefined = status !== '正常' ? status : undefined;

  if (i === 0) {
    imageUrl = '/tablet_normal_1.jpg'; 
  } else if (i === 1) {
    imageUrl = '/tablet_defect_crack.jpg'; 
    defectLabel = '表面裂纹';
  } else if (i === 2) {
    imageUrl = '/tablet_defect_chip.jpg'; 
    defectLabel = '明显崩边';
  }

  return {
    id: `LOT-${240401 + i}-SN${i.toString().padStart(3, '0')}`,
    timestamp: `2026-04-20 14:20:${(i % 60).toString().padStart(2, '0')}`,
    status,
    defectLabel,
    imageUrl,
    confidence: isDefect ? 88.5 + Math.random() * 8 : 99.1 + Math.random() * 0.8,
    smoothness: isDefect ? `${(1.1 + Math.random() * 0.5).toFixed(2)}μm` : `${(0.01 + Math.random() * 0.05).toFixed(2)}μm`,
    position: { 
      x: 150 + Math.random() * 700, 
      y: 120 + Math.random() * 1200 
    }
  };
});

export const MOCK_HISTORY_RECORDS = [
  // 强制插入几个异常样本示例，确保在流水表格顶部可见
  {
    ...MOCK_GRID_ITEMS[1], // 裂纹示例
    timestamp: '2026-04-20 14:21:05',
    status: '裂纹' as DefectType,
    confidence: 89.2
  },
  {
    ...MOCK_GRID_ITEMS[2], // 崩边示例
    timestamp: '2026-04-20 14:21:02',
    status: '崩边' as DefectType,
    confidence: 91.5
  },
  ...MOCK_GRID_ITEMS
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 10)
];

export const NAV_ITEMS = [
  { id: 'lab', label: '工位监控', icon: 'science' },
  { id: 'stats', label: '质量分析', icon: 'bar_chart' },
  { id: 'camera', label: '相机配置', icon: 'photo_camera' },
];

export const PILL_TYPES = ['圆形', '椭圆', '硬胶囊', '软胶囊'];

export const PILL_DEFECT_MAPPING: Record<string, string[]> = {
  '圆形': ['缺损', '裂纹', '破碎', '黑点', '崩边', '混料', '色差', '气泡', '包衣脱落'],
  '椭圆': ['破碎', '崩边', '包衣脱落', '针孔', '气泡', '裂纹', '色差', '字体断裂'],
  '硬胶囊': ['变形', '混料', '破损', '异物', '空泡', '顶凹', '双帽'],
  '软胶囊': ['粘连', '大小丸', '气泡', '黑点', '漏液', '异形', '破损']
};
