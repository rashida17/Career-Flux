
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const data = [
  { month: 'May', users: 120 },
  { month: 'Jun', users: 180 },
  { month: 'Jul', users: 160 },
  { month: 'Aug', users: 250 },
  { month: 'Sep', users: 320 },
  { month: 'Oct', users: 420 },
];

export default function PlatformChart() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 font-sans shadow-soft transition duration-200">
      <h3 className="text-lg font-semibold text-slate-900">
        Platform Growth
      </h3>

      <p className="mb-5 mt-1 text-sm text-slate-500">
        User growth over the last six months
      </p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              stroke="#E7E5E4"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: '#64748B',
                fontSize: 12,
                fontFamily: 'inherit',
              }}
              axisLine={{ stroke: '#E7E5E4' }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: '#64748B',
                fontSize: 12,
                fontFamily: 'inherit',
              }}
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E5E4',
                borderRadius: '12px',
                color: '#0F172A',
                fontSize: '12px',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
              }}
              labelStyle={{
                color: '#0F172A',
                fontWeight: 600,
                marginBottom: '4px',
              }}
              itemStyle={{
                color: '#C84B31',
              }}
              cursor={{
                stroke: '#C84B31',
                strokeDasharray: '4 4',
              }}
            />

            <Line
              type="monotone"
              dataKey="users"
              name="Users"
              stroke="#C84B31"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: '#C84B31',
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: '#B23B22',
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
