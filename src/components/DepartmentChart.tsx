import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Employee } from '../services/mockData';

interface Props {
  employees: Employee[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl shadow-lg text-xs text-white pointer-events-none">
        <p className="font-bold text-slate-250">{payload[0].payload.name}</p>
        <p className="text-blue-400 mt-1 font-semibold">
          Count: <span className="font-bold text-white text-sm">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function DepartmentChart({ employees }: Props) {
  const data = Object.entries(
    employees.reduce<Record<string, number>>((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <h3 className="text-sm font-bold text-slate-800 mb-5">Employees by Department</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 10, left: 15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="deptBarGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: '#64748b' }}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
            tickLine={false}
            width={75}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.03)' }} />
          <Bar dataKey="count" fill="url(#deptBarGrad)" radius={[0, 6, 6, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
