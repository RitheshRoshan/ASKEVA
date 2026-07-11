import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Employee } from '../services/mockData';

interface Props {
  employees: Employee[];
}

const COLORS = ['#10b981', '#cbd5e1'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl shadow-lg text-xs text-white pointer-events-none">
        <p className="font-bold text-slate-250">{payload[0].name}</p>
        <p className="text-emerald-400 mt-1 font-semibold">
          Count: <span className="font-bold text-white text-sm">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function StatusChart({ employees }: Props) {
  const active = employees.filter((e) => e.status === 'Active').length;
  const inactive = employees.filter((e) => e.status === 'Inactive').length;
  const total = employees.length || 1;
  const activePercentage = Math.round((active / total) * 100);

  const data = [
    { name: 'Active', value: active },
    { name: 'Inactive', value: inactive },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative flex flex-col justify-between">
      <h3 className="text-sm font-bold text-slate-800 mb-5">Status Distribution</h3>
      
      <div className="relative w-full h-[200px]">
        {/* Dynamic Center Metric Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{activePercentage}%</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Block */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-650">Active ({active})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="text-slate-650">Inactive ({inactive})</span>
        </div>
      </div>
    </div>
  );
}
