/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  FlaskConical, 
  Video, 
  BarChart3, 
  Camera, 
  Filter, 
  Play, 
  Pause, 
  Edit3,
  Database,
  Search,
  Activity,
  Box,
  CheckCircle2,
  AlertCircle,
  Pencil,
  TrendingUp,
  PieChart as PieChartIcon,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { MOCK_GRID_ITEMS, MOCK_HISTORY_RECORDS, PILL_TYPES, NAV_ITEMS, PLACEHOLDER_IMAGE, PILL_DEFECT_MAPPING } from './constants';
import { InspectionItem } from './types';

// --- Types ---
interface TabProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

// --- Sub-components ---

const Sidebar: React.FC<TabProps> = ({ activeTab, onTabChange }) => (
  <aside className="w-[70px] flex flex-col bg-sidebar-bg py-4 transition-all overflow-y-auto shrink-0 items-center border-r border-white/5">
    <nav className="w-full flex flex-col gap-2">
      <div className="w-full py-4 flex justify-center text-primary">
        <Database className="w-6 h-6" />
      </div>
      
      <div className="flex flex-col w-full text-white/70">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={item.label}
              className={`w-full h-14 flex flex-col items-center justify-center gap-1 transition-all relative ${
                isActive ? 'nav-item-active text-white' : 'opacity-60 hover:opacity-100 hover:bg-white/5'
              }`}
            >
              {item.id === 'lab' ? (
                <Activity className="w-5 h-5" />
              ) : item.id === 'stats' ? (
                <BarChart3 className="w-5 h-5" />
              ) : item.id === 'camera' ? (
                <Camera className="w-5 h-5" />
              ) : (
                <Settings className="w-5 h-5" />
              )}
              <span className="text-[9px] font-bold tracking-tighter truncate w-full text-center px-1">
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
    
    <div className="mt-auto px-2 w-full flex flex-col items-center gap-4 py-4 border-t border-white/10 text-[10px] text-white/40 font-bold uppercase">
      <div className="flex flex-col items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_var(--color-success)]" />
        <span className="scale-[0.7] origin-top">系统正常</span>
      </div>
    </div>
  </aside>
);

const Header = () => (
  <header className="h-[54px] flex items-center justify-between px-6 bg-white border-b border-surface-highest sticky top-0 z-50 shrink-0">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Box className="w-5 h-5 text-primary" />
        <h2 className="text-base font-bold tracking-tight text-[#1A1A1A]">药品缺陷检测系统</h2>
      </div>
      <span className="bg-surface-high px-2 py-0.5 rounded text-[10px] font-mono font-bold text-gray-500 border border-surface-highest uppercase">
        检测站: LINE04-ST01
      </span>
    </div>
    
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1 px-3 py-1 bg-surface-high border border-surface-highest rounded-[4px] text-[11px] font-medium transition-all hover:bg-white">
        <Search className="w-3.5 h-3.5 text-gray-400" />
        <input type="text" placeholder="搜索批次/SN..." className="bg-transparent outline-none w-32 font-sans text-xs" />
      </div>

      <div className="text-[12px] text-gray-400 font-mono font-bold">
        产量: <span className="text-primary tracking-tighter">3,960 个/分</span>
      </div>
      
      <div className="flex gap-4 border-l border-surface-highest pl-6">
        <button className="p-1 text-gray-400 hover:text-primary transition-colors cursor-pointer">
          <Settings className="w-4.5 h-4.5" />
        </button>
        <button className="p-1 text-gray-400 hover:text-primary transition-colors relative cursor-pointer">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-error rounded-full ring-2 ring-white" />
        </button>
      </div>
    </div>
  </header>
);

interface GridCellProps {
  item: InspectionItem;
}

const GridCell: React.FC<GridCellProps> = ({ item }) => {
  const isDefect = item.status !== '正常';
  const labelText = item.defectLabel || item.status;
  
  return (
    <div 
      className={`relative aspect-square rounded-[2px] overflow-hidden border transition-all bg-white group cursor-pointer ${
        isDefect ? 'border-error border-2 shadow-[0_0_12px_rgba(245,34,45,0.15)]' : 'border-surface-highest hover:border-primary/40 shadow-sm'
      }`}
    >
      <div className="w-full h-full p-0.5">
        <div className={`w-full h-full ${isDefect ? 'bg-[#FFF1F0]' : 'bg-[#F2F4F6]'} relative flex flex-col justify-center items-center overflow-hidden`}>
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={labelText} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover absolute inset-0 opacity-100 transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // If the real image fails (e.g. wrong path), fallback to placeholder
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              }}
            />
          ) : (
            <div className="text-[10px] text-gray-300 font-mono">LOADING...</div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
      </div>

      {isDefect && (
        <div className="absolute top-1 right-1 bg-error text-white text-[9px] px-1.5 py-0.5 rounded-[1px] font-bold z-10 uppercase tracking-tighter shadow-sm flex items-center gap-1">
          <AlertCircle className="w-2.5 h-2.5" />
          {labelText}
        </div>
      )}
      
    </div>
  );
};

const ControlPanel = () => {
  const [activeTab, setActiveTab] = useState('圆形');
  
  return (
    <aside className="w-[300px] border-l border-surface-highest bg-white overflow-y-auto no-scrollbar shrink-0 flex flex-col">
      <div className="p-5 flex flex-col gap-6 flex-1">
        <div>
          <div className="text-[14px] font-bold text-gray-500 mb-4 flex items-center gap-2">药品种类选择</div>
          <div className="flex border-b border-surface-highest mb-4">
            {PILL_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex-1 pb-2.5 text-[14px] font-bold transition-all relative ${
                  activeTab === type 
                    ? 'text-primary' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {type}
                {activeTab === type && (
                  <motion.div 
                    layoutId="pill-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-[14px] font-bold text-gray-700">当前启用检测</div>
            <button className="text-primary hover:opacity-80 transition-opacity">
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <AnimatePresence mode="popLayout">
              {(PILL_DEFECT_MAPPING[activeTab] || []).map((label) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={label}
                  className="px-3 py-2 bg-[#F0F2F5] rounded-[3px] text-[13px] font-medium text-[#1A1A1A] flex items-center gap-2 transition-all hover:bg-[#E8EAED] cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {label}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4 font-mono border-b border-surface-highest pb-2">视觉控制参数</div>
          <div className="space-y-6">
            {[
              { label: '算法灵敏度', val: '0.85', percent: '85%' },
              { label: '动态曝光调节', val: '+0.5 EV', percent: '50%' },
              { label: '流水线同步线速度', val: '1.2 m/s', percent: '40%' }
            ].map(p => (
              <div key={p.label} className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase font-mono">
                  <span className="text-gray-500">{p.label}</span>
                  <span className="text-primary font-bold">{p.val}</span>
                </div>
                <div className="h-1 bg-surface-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: p.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="border-t border-surface-highest p-5 bg-surface-high/20">
        <div className="bg-white rounded-lg p-3 border border-surface-highest shadow-sm mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">累计吞吐量</span>
            <span className="text-[12px] font-mono font-bold">852,904</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">异常检出率</span>
            <span className="text-[12px] font-mono font-bold text-error">0.18%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button className="py-2.5 bg-white border border-surface-highest text-gray-600 rounded-[3px] font-bold text-[11px] hover:bg-surface-high transition-all flex items-center justify-center gap-2">
            <Pause className="w-3.5 h-3.5" /> 暂停流水
          </button>
          <button className="py-2.5 bg-primary text-white rounded-[3px] font-bold text-[11px] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20">
            <Play className="w-3.5 h-3.5" /> 恢复检测
          </button>
        </div>
      </div>
    </aside>
  );
};

const QualityAnalysis = () => {
  const trendData = [
    { time: '08:00', yield: 99.8, defects: 12 },
    { time: '09:00', yield: 99.7, defects: 18 },
    { time: '10:00', yield: 99.9, defects: 8 },
    { time: '11:00', yield: 99.6, defects: 24 },
    { time: '12:00', yield: 99.8, defects: 15 },
    { time: '13:00', yield: 99.7, defects: 19 },
    { time: '14:00', yield: 99.9, defects: 5 },
  ];

  const defectDistData = [
    { name: '裂纹', value: 45, color: '#F5222D' },
    { name: '崩边', value: 25, color: '#FA8C16' },
    { name: '色差', value: 15, color: '#FADB14' },
    { name: '黑点', value: 10, color: '#13C2C2' },
    { name: '其他', value: 5, color: '#8C8C8C' },
  ];

  return (
    <div className="p-1 space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: '综合良率', value: '99.82%', change: '+0.05%', isUp: true, icon: TrendingUp, color: 'text-success' },
          { label: '缺陷报警数', value: '142', change: '-12%', isUp: false, icon: AlertCircle, color: 'text-error' },
          { label: '误判率 (FRR)', value: '0.02%', change: '-0.01%', isUp: false, icon: CheckCircle2, color: 'text-success' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-surface-highest shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{kpi.label}</span>
              <kpi.icon className={`w-4 h-4 ${kpi.color} opacity-80`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono tracking-tighter">{kpi.value}</span>
              <div className={`flex items-center text-[10px] font-bold ${kpi.isUp ? 'text-success' : 'text-error'}`}>
                {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-surface-highest shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> 生产率与缺陷趋势
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> 良率趋势</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-error" /> 缺陷计数</div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#999' }} 
                />
                <YAxis 
                  yAxisId="left"
                  domain={[99, 100]}
                  hide
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #eee', fontSize: '12px' }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="yield" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3} 
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-surface-highest shadow-sm">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-6">
            <PieChartIcon className="w-4 h-4 text-primary" /> 缺陷分布比例
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defectDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {defectDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {defectDistData.map((d, i) => (
              <div key={i} className="flex justify-between items-center text-[11px] font-bold">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </div>
                <span className="font-mono text-gray-700">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-surface-highest shadow-sm overflow-hidden mb-10">
        <div className="px-6 py-4 border-b border-surface-highest flex justify-between items-center bg-surface-high/20">
          <h3 className="text-sm font-bold">批次历史质量回顾</h3>
          <button className="text-[11px] font-bold text-primary flex items-center gap-1">
            导出报表 <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-high/30 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-surface-highest font-mono">
                <th className="px-6 py-3">批次 ID</th>
                <th className="px-6 py-3">合格数</th>
                <th className="px-6 py-3">不合格数</th>
                <th className="px-6 py-3">一等品率</th>
                <th className="px-6 py-3 text-right">结果</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-highest">
              {Array.from({ length: 20 }).map((_, i) => {
                const total = Math.floor(40000 + Math.random() * 20000);
                const fail = Math.floor(Math.random() * 200);
                const pass = total - fail;
                const yieldVal = ((pass / total) * 100).toFixed(2);
                const lotId = `LOT-2404${(20 - i).toString().padStart(2, '0')}-${['A', 'B', 'C'][i % 3]}`;
                
                return (
                  <tr key={i} className="hover:bg-surface-high transition-colors text-[12px] font-medium font-mono text-gray-600">
                    <td className="px-6 py-4 font-bold text-gray-800 tracking-tight">{lotId}</td>
                    <td className="px-6 py-4 text-success">{pass.toLocaleString()}</td>
                    <td className="px-6 py-4 text-error">{fail.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{yieldVal}%</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold border ${
                        parseFloat(yieldVal) > 99.8 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-warning/10 text-warning border-warning/20'
                      }`}>
                        {parseFloat(yieldVal) > 99.8 ? '优' : '合格'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [items] = useState(MOCK_GRID_ITEMS);
  const [history] = useState(MOCK_HISTORY_RECORDS);
  const [activeNav, setActiveNav] = useState('lab');

  return (
    <div className="flex flex-col h-screen bg-surface selection:bg-primary/10">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeNav} onTabChange={setActiveNav} />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5 overflow-y-auto no-scrollbar flex-1">
            
            <AnimatePresence mode="wait">
              {activeNav === 'lab' ? (
                <motion.div
                  key="lab-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Legend & Stats Bar */}
                  <div className="flex items-center gap-4 mb-4 bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-white/20 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 flex items-center justify-center">
                         <div className="w-2.5 h-2.5 rounded-full bg-success ring-2 ring-success/20" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-500">合格品监测 ({items.filter(i => i.status === '正常').length})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-error ring-2 ring-error/20" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-500">拦截废弃品 ({items.filter(i => i.status !== '正常').length})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                    {items.map((item) => (
                      <GridCell key={item.id} item={item} />
                    ))}
                  </div>
                  
                  <div className="mt-8 rounded-[3px] overflow-hidden border border-surface-highest bg-white shadow-sm mb-10">
                    <div className="flex justify-between items-center bg-surface-high/50 px-5 py-3.5 border-b border-surface-highest">
                      <div className="panel-title-bar flex items-center gap-3">
                        <h3 className="font-bold text-[12px] uppercase tracking-wider text-gray-700">实时检测流水</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono opacity-60">状态: 运行中</span>
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_var(--color-success)]" />
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-surface-high/30 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-surface-highest font-mono">
                            <th className="px-5 py-4">检测时间</th>
                            <th className="px-5 py-4">设备编号</th>
                            <th className="px-5 py-4">批次 ID</th>
                            <th className="px-5 py-4 text-center">药丸坐标 (MM)</th>
                            <th className="px-5 py-4">检测结果</th>
                            <th className="px-5 py-4">缺陷类别</th>
                            <th className="px-5 py-4">置信度</th>
                            <th className="px-5 py-4 text-right">审计状态</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-highest">
                          {history.map((record) => {
                            const isNormal = record.status === '正常';
                            return (
                              <tr key={record.id} className="hover:bg-surface-high transition-colors text-[12px] group">
                                <td className="px-5 py-3.5 text-gray-400 font-mono">{record.timestamp}</td>
                                <td className="px-5 py-3.5 font-bold font-mono tracking-tighter text-gray-700">#{record.id.split('-').pop()}</td>
                                <td className="px-5 py-3.5 text-gray-500 font-mono text-[11px]">{record.id.split('-').slice(0, 2).join('-')}</td>
                                <td className="px-5 py-3.5 text-center font-mono font-bold">
                                  <span className={isNormal ? 'text-[#08979C]' : 'text-error animate-pulse'}>
                                    ({record.position.x.toFixed(2)}, {record.position.y.toFixed(2)})
                                  </span>
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold border uppercase tracking-widest ${
                                    isNormal 
                                      ? 'bg-[#F6FFED] border-[#B7EB8F] text-success' 
                                      : 'bg-[#FFF1F0] border-[#FFA39E] text-error'
                                  }`}>
                                    {isNormal ? '合格' : '不合格'}
                                  </span>
                                </td>
                                <td className={`px-5 py-3.5 font-bold ${isNormal ? 'text-gray-300' : 'text-error'}`}>
                                  {isNormal ? '无' : record.status}
                                </td>
                                <td className="px-5 py-3.5 font-bold font-mono text-primary">{record.confidence.toFixed(2)}%</td>
                                <td className="px-5 py-3.5 text-right">
                                  <span className={`text-[10px] font-bold uppercase transition-all ${
                                    isNormal ? 'text-gray-400 group-hover:text-gray-600' : 'text-error animate-pulse'
                                  }`}>
                                    {isNormal ? '已转序' : '已拦截'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              ) : activeNav === 'stats' ? (
                <motion.div
                  key="stats-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <QualityAnalysis />
                </motion.div>
              ) : (
                <motion.div 
                  key="empty-view"
                  className="flex-1 flex flex-col items-center justify-center h-full text-gray-400 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Box className="w-16 h-16 opacity-20" />
                  <p className="font-bold text-sm tracking-widest uppercase">该模块正在接入中...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        
        <ControlPanel />
      </div>
    </div>
  );
}
