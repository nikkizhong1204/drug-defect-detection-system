import { InspectionItem, DefectType } from './types';

/**
 * 统一浅灰占位图 (SVG Base64)
 */
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNGNEY2RjkiLz48cGF0aCBkPSJNNjAgNDBMMzAgOTBIOXBNNjAgNDBMODAgOTAiIHN0cm9rZT0iI0QxRDVEQiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+";

/**
 * 统一“未接入相机”状态图
 * 请把图片放到：
 * public/assets/pills/camera-not-connected.png
 */
const CAMERA_NOT_CONNECTED_IMAGE = '/assets/pills/camera-not-connected.png';

const TOTAL_ITEMS = 60;

const pad = (num: number) => String(num).padStart(3, '0');

/**
 * 60 个检测位统一显示“未接入相机”图
 */
export const MOCK_GRID_ITEMS: InspectionItem[] = Array.from({ length: TOTAL_ITEMS }).map((_, i) => ({
  id: `LOT-${240401 + i}-SN${pad(i)}`,
  timestamp: `2026-04-20 14:20:${(i % 60).toString().padStart(2, '0')}`,
  status: '正常' as DefectType,
  defectLabel: undefined,
  imageUrl: CAMERA_NOT_CONNECTED_IMAGE,
  confidence: 99.1 + Math.random() * 0.8,
  smoothness: `${(0.01 + Math.random() * 0.05).toFixed(2)}μm`,
  position: {
    x: 150 + Math.random() * 700,
    y: 120 + Math.random() * 1200,
  },
}));

/**
 * 历史流水：直接取最近 12 条，不再强制插入异常样本
 */
export const MOCK_HISTORY_RECORDS = MOCK_GRID_ITEMS
  .slice()
  .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  .slice(0, 12);

export const NAV_ITEMS = [
  { id: 'lab', label: '工位监控', icon: 'science' },
  { id: 'stats', label: '质量分析', icon: 'bar_chart' },
  { id: 'camera', label: '相机配置', icon: 'photo_camera' },
];

export const PILL_TYPES = ['圆形', '椭圆', '硬胶囊', '软胶囊'];

export const PILL_DEFECT_MAPPING: Record<string, string[]> = {
  圆形: ['缺损', '裂纹', '破碎', '黑点', '崩边', '混料', '色差', '气泡', '包衣脱落'],
  椭圆: ['破碎', '崩边', '包衣脱落', '针孔', '气泡', '裂纹', '色差', '字体断裂'],
  硬胶囊: ['变形', '混料', '破损', '异物', '空泡', '顶凹', '双帽'],
  软胶囊: ['粘连', '大小丸', '气泡', '黑点', '漏液', '异形', '破损'],
};
