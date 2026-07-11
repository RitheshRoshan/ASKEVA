import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Employee } from '../services/mockData';

interface Props {
  employees: Employee[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl shadow-lg text-xs text-white pointer-events-none">
        <p className="font-bold text-slate-250">{payload[0].payload.name}</p>
        <p className="text-indigo-400 mt-1 font-semibold">
          Joined: <span className="font-bold text-white text-sm">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function MonthlyJoinedChart({ employees }: Props) {
  // show last 12 months of joining data
  const counts: Record<string, number> = {};

  employees.forEach((emp) => {
    const d = new Date(emp.joiningDate);
    if (!isNaN(d.getTime())) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  // Get sorted unique months and take last 12
  const sortedKeys = Object.keys(counts).sort();
  const last12 = sortedKeys.slice(-12);

  const data = last12.map((key) => {
    const [year, month] = key.split('-');
    return {
      name: `${MONTHS[parseInt(month, 10) - 1]} ${year.slice(2)}`,
      count: counts[key],
    };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <h3 className="text-sm font-bold text-slate-800 mb-5">Monthly Joined Employees</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <filter id="shadowGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx={0} dy={4} stdDeviation={3} floodColor="#6366f1" floodOpacity={0.25} />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#64748b' }}
            tickLine={false}
            angle={-30}
            textAnchor="end"
            height={65}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#64748b' }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 3.5, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }}
            activeDot={{ r: 5.5, fill: '#fff', stroke: '#4f46e5', strokeWidth: 3 }}
            filter="url(#shadowGlow)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
