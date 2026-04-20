/**
 * Types for the Inspection Dashboard
 */

export type DefectType = 
  | '正常' 
  | '缺损' | '裂纹' | '破碎' | '黑点' | '崩边' | '混料' | '色差' | '气泡' | '包衣脱落'
  | '针孔' | '字体断裂'
  | '变形' | '破损' | '异物' | '空泡' | '顶凹' | '双帽'
  | '粘连' | '大小丸' | '漏液' | '异形';

export interface InspectionItem {
  id: string;
  timestamp: string;
  status: DefectType;
  defectLabel?: string;
  imageUrl?: string;
  confidence: number;
  smoothness: string;
  position: { x: number; y: number };
}

export interface MachineStatus {
  fps: number;
  cpu: number;
  temp: number;
  isConnected: boolean;
}
