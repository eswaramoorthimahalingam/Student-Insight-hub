import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ScatterChart, Scatter,
  CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line,
} from 'recharts';
import { students, departments, departmentColors, categoryColors } from '@/data/studentData';

const RADIAN = Math.PI / 180;

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function ChartCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-2xl p-5 card-shadow ${className ?? ''}`}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

// 1. Department distribution bar chart
function DepartmentChart() {
  const data = departments.map((dept, i) => ({
    dept: dept.replace('Information Technology', 'IT').replace('Computer Science', 'CS'),
    fullName: dept,
    count: students.filter(s => s.department === dept).length,
    fill: departmentColors[i % departmentColors.length],
  }));

  return (
    <ChartCard title="Students by Department">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 93%)" />
          <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v, _n, props) => [v, props.payload.fullName]}
            contentStyle={{ borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 2. Category distribution pie chart
function CategoryPieChart() {
  const cats = ['High', 'Medium', 'Low', 'Critical'];
  const data = cats.map(cat => ({
    name: cat,
    value: students.filter(s => s.category === cat).length,
    fill: categoryColors[cat],
  }));

  return (
    <ChartCard title="Performance Category Split">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={90}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Legend formatter={(value) => <span style={{ fontSize: 12, fontWeight: 500 }}>{value}</span>} />
          <Tooltip formatter={(v) => [v, 'Students']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 3. Score distribution bar chart
function ScoreDistributionChart() {
  const buckets = [
    { range: '0–40', min: 0, max: 40 },
    { range: '41–55', min: 41, max: 55 },
    { range: '56–70', min: 56, max: 70 },
    { range: '71–85', min: 71, max: 85 },
    { range: '86–100', min: 86, max: 100 },
  ];
  const data = buckets.map(b => ({
    range: b.range,
    count: students.filter(s => s.predictedScore >= b.min && s.predictedScore <= b.max).length,
  }));

  return (
    <ChartCard title="Predicted Score Distribution">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 93%)" />
          <XAxis dataKey="range" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
          <Bar dataKey="count" fill="hsl(224 76% 48%)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 4. Attendance vs Predicted Score scatter
function AttendanceScatterChart() {
  const sample = students.filter((_, i) => i % 5 === 0).map(s => ({
    attendance: s.attendanceAvg,
    score: s.predictedScore,
    category: s.category,
    name: s.name,
    fill: categoryColors[s.category],
  }));

  return (
    <ChartCard title="Attendance vs Predicted Score">
      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 93%)" />
          <XAxis dataKey="attendance" name="Attendance" tick={{ fontSize: 11 }} label={{ value: 'Attendance %', position: 'insideBottom', offset: -2, fontSize: 10 }} />
          <YAxis dataKey="score" name="Score" tick={{ fontSize: 11 }} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ payload }) => {
              if (!payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-card border border-border rounded-xl p-3 shadow text-xs">
                  <div className="font-semibold mb-1">{d.name}</div>
                  <div>Attendance: {d.attendance}%</div>
                  <div>Score: {d.score}</div>
                  <div>Category: {d.category}</div>
                </div>
              );
            }}
          />
          <Scatter data={sample} fill="#3b82f6">
            {sample.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 5. Certifications + Score Radar by dept
function DeptRadarChart() {
  const data = departments.map(dept => {
    const dStudents = students.filter(s => s.department === dept);
    const avgScore = Math.round(dStudents.reduce((a, s) => a + s.predictedScore, 0) / dStudents.length);
    const avgCerts = Math.round(dStudents.reduce((a, s) => a + s.certifications, 0) / dStudents.length * 10);
    return {
      dept: dept.replace('Information Technology', 'IT').replace('Computer Science', 'CS'),
      score: avgScore,
      certs: avgCerts,
    };
  });

  return (
    <ChartCard title="Avg Score by Department (Radar)">
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius={80}>
          <PolarGrid stroke="hsl(220 20% 88%)" />
          <PolarAngleAxis dataKey="dept" tick={{ fontSize: 10 }} />
          <Radar name="Avg Score" dataKey="score" stroke="hsl(224 76% 48%)" fill="hsl(224 76% 48%)" fillOpacity={0.3} />
          <Radar name="Certs×10" dataKey="certs" stroke="hsl(43 96% 56%)" fill="hsl(43 96% 56%)" fillOpacity={0.3} />
          <Legend formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
          <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 6. Year-wise avg predicted score
function YearBarChart() {
  const data = [1, 2, 3, 4].map(yr => {
    const yrStudents = students.filter(s => s.year === yr);
    return {
      year: `Year ${yr}`,
      avgScore: Math.round(yrStudents.reduce((a, s) => a + s.predictedScore, 0) / yrStudents.length),
      count: yrStudents.length,
    };
  });

  return (
    <ChartCard title="Avg Predicted Score by Year">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 93%)" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={[60, 90]} />
          <Tooltip
            contentStyle={{ borderRadius: 12, fontSize: 12 }}
            formatter={(v: any, n: any, p: any) => [v, n, `(${p.payload.count} students)`]}
          />
          <Bar dataKey="avgScore" fill="hsl(267 57% 58%)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 7. GPA Trend Line Chart ── NEW
function GpaTrendChart() {
  const [view, setView] = useState<'all' | 'dept'>('all');

  const semData = ['GPA 1', 'GPA 2', 'GPA 3'].map((label, idx) => {
    const key = (['gpa1', 'gpa2', 'gpa3'] as const)[idx];
    const vals = students.map(s => s[key]).filter((v): v is number => v !== null);
    return {
      sem: label,
      overall: parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)),
      count: vals.length,
    };
  });

  const deptShort = departments.map(d =>
    d.replace('Information Technology', 'IT').replace('Computer Science', 'CS')
  );

  const deptSemData = ['GPA 1', 'GPA 2', 'GPA 3'].map((label, idx) => {
    const key = (['gpa1', 'gpa2', 'gpa3'] as const)[idx];
    const entry: Record<string, any> = { sem: label };
    departments.forEach((dept, di) => {
      const vals = students.filter(s => s.department === dept).map(s => s[key]).filter((v): v is number => v !== null);
      entry[deptShort[di]] = vals.length
        ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
        : null;
    });
    return entry;
  });

  return (
    <ChartCard title="GPA Trend Across Semesters">
      <div className="flex items-center gap-2 mb-3">
        {(['all', 'dept'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              view === v
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {v === 'all' ? 'All Students' : 'By Department'}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        {view === 'all' ? (
          <LineChart data={semData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 93%)" />
            <XAxis dataKey="sem" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[5.5, 8]} />
            <Tooltip
              contentStyle={{ borderRadius: 12, fontSize: 12 }}
              formatter={(v: any, _: any, p: any) => [
                `${v}  (n=${p.payload.count})`,
                'Avg GPA',
              ]}
            />
            <Line
              type="monotone"
              dataKey="overall"
              stroke="hsl(224 76% 48%)"
              strokeWidth={3}
              dot={{ r: 6, fill: 'hsl(224 76% 48%)', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        ) : (
          <LineChart data={deptSemData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 93%)" />
            <XAxis dataKey="sem" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[5, 9]} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            <Legend formatter={(v) => <span style={{ fontSize: 10 }}>{v}</span>} />
            {deptShort.map((d, i) => (
              <Line
                key={d}
                type="monotone"
                dataKey={d}
                stroke={departmentColors[i % departmentColors.length]}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: departmentColors[i % departmentColors.length] }}
                connectNulls
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 8. Dept × Category Heatmap ── NEW
const CATS = ['High', 'Medium', 'Low', 'Critical'] as const;

function DeptCategoryHeatmap() {
  const [metric, setMetric] = useState<'count' | 'pct'>('count');

  const matrix = departments.map((dept, di) => {
    const dStudents = students.filter(s => s.department === dept);
    const total = dStudents.length;
    return {
      dept: dept.replace('Information Technology', 'IT').replace('Computer Science', 'CS'),
      fullDept: dept,
      counts: Object.fromEntries(
        CATS.map(cat => [cat, dStudents.filter(s => s.category === cat).length])
      ) as Record<string, number>,
      total,
      color: departmentColors[di % departmentColors.length],
    };
  });

  const maxCount = Math.max(...matrix.flatMap(r => CATS.map(c => r.counts[c])));

  function cellBg(cat: string, count: number, total: number) {
    const base: Record<string, [number, number, number]> = {
      High: [34, 197, 94],
      Medium: [245, 158, 11],
      Low: [239, 68, 60],
      Critical: [124, 58, 237],
    };
    const intensity = metric === 'count'
      ? (maxCount > 0 ? count / maxCount : 0)
      : (total > 0 ? count / total : 0);
    const [r, g, b] = base[cat] ?? [99, 102, 241];
    return `rgba(${r},${g},${b},${0.07 + intensity * 0.85})`;
  }

  function cellText(cat: string, count: number, total: number) {
    const intensity = metric === 'count'
      ? (maxCount > 0 ? count / maxCount : 0)
      : (total > 0 ? count / total : 0);
    if (intensity > 0.42) return '#ffffff';
    const dark: Record<string, string> = {
      High: '#15803d', Medium: '#92400e', Low: '#991b1b', Critical: '#5b21b6',
    };
    return dark[cat] ?? '#1e293b';
  }

  return (
    <ChartCard title="Dept × Category Heatmap" className="xl:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        {(['count', 'pct'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              metric === m
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {m === 'count' ? 'Count' : '% of Dept'}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          · hover cells for detail
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-1.5">
          <thead>
            <tr>
              <th className="text-left text-muted-foreground font-semibold pb-1 pr-3 w-14">Dept</th>
              {CATS.map(cat => (
                <th key={cat} className="text-center font-bold pb-1 px-1 text-sm" style={{ color: categoryColors[cat] }}>
                  {cat}
                </th>
              ))}
              <th className="text-center text-muted-foreground font-semibold pb-1 px-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map(row => (
              <tr key={row.dept}>
                <td className="pr-3 py-0.5 font-semibold whitespace-nowrap" style={{ color: row.color }}>
                  {row.dept}
                </td>
                {CATS.map(cat => {
                  const count = row.counts[cat];
                  const pct = row.total > 0 ? Math.round((count / row.total) * 100) : 0;
                  return (
                    <td key={cat} className="text-center py-0.5 px-0.5">
                      <div
                        className="rounded-xl py-2 px-1 font-bold transition-all duration-150 hover:scale-110 cursor-default select-none"
                        style={{
                          backgroundColor: cellBg(cat, count, row.total),
                          color: cellText(cat, count, row.total),
                          minWidth: 44,
                        }}
                        title={`${row.fullDept} — ${cat}: ${count} students (${pct}%)`}
                      >
                        {metric === 'count' ? count : `${pct}%`}
                      </div>
                    </td>
                  );
                })}
                <td className="text-center py-0.5 px-0.5">
                  <div className="rounded-xl py-2 px-1 font-semibold bg-secondary text-muted-foreground" style={{ minWidth: 44 }}>
                    {row.total}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Gradient legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-3 border-t border-border">
        {CATS.map(cat => {
          const rgb: Record<string, string> = {
            High: '34,197,94', Medium: '245,158,11', Low: '239,68,60', Critical: '124,58,237',
          };
          return (
            <div key={cat} className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[0.1, 0.35, 0.6, 0.9].map((a, i) => (
                  <div key={i} className="w-4 h-3 rounded-sm" style={{ background: `rgba(${rgb[cat]},${a})` }} />
                ))}
              </div>
              <span className="text-xs font-medium" style={{ color: categoryColors[cat] }}>{cat}</span>
            </div>
          );
        })}
        <span className="text-xs text-muted-foreground ml-auto">Low → High</span>
      </div>
    </ChartCard>
  );
}

export default function ChartsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <DepartmentChart />
      <CategoryPieChart />
      <ScoreDistributionChart />
      <AttendanceScatterChart />
      <DeptRadarChart />
      <YearBarChart />
      {/* NEW: Full-width row */}
      <GpaTrendChart />
      <DeptCategoryHeatmap />
    </div>
  );
}
