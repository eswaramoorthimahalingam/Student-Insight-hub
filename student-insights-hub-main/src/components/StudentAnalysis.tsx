import { X, Award, BookOpen, TrendingUp, BarChart2, GraduationCap, Calendar } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';
import type { Student } from '@/data/studentData';
import { students, categoryBg, categoryColors, getAvgGpa } from '@/data/studentData';

interface Props {
  student: Student;
  onClose: () => void;
}

export default function StudentAnalysis({ student, onClose }: Props) {
  const sorted = [...students].sort((a, b) => b.predictedScore - a.predictedScore);
  const rank = sorted.findIndex(s => s.id === student.id) + 1;
  const percentile = Math.round(((students.length - rank) / students.length) * 100);
  const avgGpa = getAvgGpa(student);

  const deptStudents = students.filter(s => s.department === student.department);
  const deptAvgScore = Math.round(deptStudents.reduce((a, s) => a + s.predictedScore, 0) / deptStudents.length);
  const deptAvgAttendance = Math.round(deptStudents.reduce((a, s) => a + s.attendanceAvg, 0) / deptStudents.length);
  const overallAvgScore = Math.round(students.reduce((a, s) => a + s.predictedScore, 0) / students.length);

  const radarData = [
    { metric: 'Predicted Score', value: student.predictedScore, full: 100 },
    { metric: 'Attendance', value: student.attendanceAvg, full: 100 },
    { metric: 'Certifications', value: student.certifications * 16.67, full: 100 },
    { metric: 'GPA1', value: avgGpa ? avgGpa * 10 : 0, full: 100 },
    { metric: 'Percentile', value: percentile, full: 100 },
  ];

  const gpaBars = [
    { sem: 'GPA 1', gpa: student.gpa1 },
    { sem: 'GPA 2', gpa: student.gpa2 },
    { sem: 'GPA 3', gpa: student.gpa3 },
  ].filter(g => g.gpa !== null);

  const comparisonData = [
    { label: 'This Student', score: student.predictedScore, dept: deptAvgScore, overall: overallAvgScore },
  ];

  const scoreColor = student.predictedScore >= 85 ? '#22c55e' : student.predictedScore >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/20 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-card w-full max-w-3xl rounded-2xl card-shadow max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="gradient-primary p-6 rounded-t-2xl text-white relative">
          <button onClick={onClose} className="absolute right-4 top-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-white/80 text-sm">{student.id} · {student.department}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs bg-white/20 rounded-full px-3 py-1">Year {student.year}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${categoryBg[student.category]}`}>
                  {student.category} Performer
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{student.predictedScore}</div>
              <div className="text-white/70 text-xs">Predicted Score</div>
              <div className="text-white/90 text-xs mt-1">Rank #{rank} · Top {100 - percentile}%</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: BarChart2, label: 'Predicted Score', value: student.predictedScore, color: scoreColor },
              { icon: BookOpen, label: 'Attendance', value: `${student.attendanceAvg}%`, color: student.attendanceAvg >= 75 ? '#22c55e' : '#ef4444' },
              { icon: Award, label: 'Certifications', value: student.certifications, color: '#8b5cf6' },
              { icon: GraduationCap, label: 'Avg GPA', value: avgGpa ?? 'N/A', color: '#06b6d4' },
            ].map(stat => (
              <div key={stat.label} className="bg-secondary/40 rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '20' }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="font-bold text-lg" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Radar */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Performance Profile</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={75}>
                  <PolarGrid stroke="hsl(220 20% 88%)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
                  <Radar dataKey="value" stroke={categoryColors[student.category]} fill={categoryColors[student.category]} fillOpacity={0.3} />
                  <Tooltip formatter={(v: any) => [`${Math.round(v)}`, '']} contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* GPA trend */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">GPA Trend</h3>
              {gpaBars.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={gpaBars} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 93%)" />
                    <XAxis dataKey="sem" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 10]} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="gpa" radius={[6, 6, 0, 0]}>
                      {gpaBars.map((_, i) => (
                        <Cell key={i} fill={['#3b82f6', '#8b5cf6', '#06b6d4'][i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  No GPA data available
                </div>
              )}
            </div>
          </div>

          {/* Comparison */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Score Comparison</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'This Student', val: student.predictedScore, max: 100, color: '#3b82f6' },
                { label: `${student.department} Avg`, val: deptAvgScore, max: 100, color: '#8b5cf6' },
                { label: 'Overall Avg', val: overallAvgScore, max: 100, color: '#f59e0b' },
              ].map(c => (
                <div key={c.label} className="bg-secondary/40 rounded-xl p-4">
                  <div className="text-2xl font-bold mb-1" style={{ color: c.color }}>{c.val}</div>
                  <div className="text-xs text-muted-foreground mb-2">{c.label}</div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.val}%`, backgroundColor: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Rank */}
          <div className="bg-secondary/30 rounded-xl p-4 flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <div className="font-semibold text-sm">
                Ranked <span className="text-primary font-bold">#{sorted.filter(s => s.department === student.department).findIndex(s => s.id === student.id) + 1}</span> in {student.department}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Global Rank #{rank} out of {students.length} students · {percentile}th percentile
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
