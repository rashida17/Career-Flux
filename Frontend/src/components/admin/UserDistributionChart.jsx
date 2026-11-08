
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const data = [
  { name: 'Job Seekers', value: 842, color: '#C84B31' },
  { name: 'Companies', value: 286, color: '#E48D76' },
];

export default function UserDistributionChart() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 font-sans text-slate-900 shadow-soft transition duration-200 hover:border-brand-200 hover:shadow-soft">
      <h3 className="text-lg font-bold text-slate-900">
        User Distribution
      </h3>

      <p className="mt-1 mb-4 text-sm text-slate-500">
        Users by account type
      </p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              stroke="#FFFFFF"
              strokeWidth={3}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E5E4',
                borderRadius: '12px',
                color: '#0F172A',
                fontSize: '12px',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
              }}
              itemStyle={{
                color: '#C84B31',
              }}
            />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span
                  style={{
                    color: '#64748B',
                    fontSize: '12px',
                  }}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

  );

}
