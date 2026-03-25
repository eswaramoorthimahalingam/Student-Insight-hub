import { TrendingUp, TrendingDown, Users, Award, BookOpen, BarChart2 } from 'lucide-react';
import { students } from '@/data/studentData';

export default function StatsCards() {
  const total = students.length;
  const high = students.filter(s => s.category === 'High').length;
  const critical = students.filter(s => s.category === 'Critical').length;
  const avgScore = Math.round(students.reduce((a, s) => a + s.predictedScore, 0) / total);
  const avgAttendance = Math.round(students.reduce((a, s) => a + s.attendanceAvg, 0) / total);
  const avgCerts = (students.reduce((a, s) => a + s.certifications, 0) / total).toFixed(1);

  const stats = [
    {
      label: 'Total Students',
      value: total.toLocaleString(),
      icon: Users,
      gradient: 'gradient-primary',
      sub: 'Across all departments',
    },
    {
      label: 'High Performers',
      value: `${high}`,
      icon: TrendingUp,
      gradient: 'gradient-green',
      sub: `${((high / total) * 100).toFixed(1)}% of total`,
    },
    {
      label: 'Avg Predicted Score',
      value: `${avgScore}`,
      icon: BarChart2,
      gradient: 'gradient-gold',
      sub: 'Out of 100',
    },
    {
      label: 'Avg Attendance',
      value: `${avgAttendance}%`,
      icon: BookOpen,
      gradient: 'gradient-purple',
      sub: 'Across all students',
    },
    {
      label: 'Avg Certifications',
      value: avgCerts,
      icon: Award,
      gradient: 'gradient-primary',
      sub: 'Per student',
    },
    {
      label: 'At Risk (Critical)',
      value: `${critical}`,
      icon: TrendingDown,
      gradient: 'gradient-red',
      sub: `${((critical / total) * 100).toFixed(1)}% need attention`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-card rounded-2xl p-4 card-shadow card-hover flex flex-col gap-3"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.gradient}`}>
            <s.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs font-semibold text-muted-foreground mt-0.5">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
