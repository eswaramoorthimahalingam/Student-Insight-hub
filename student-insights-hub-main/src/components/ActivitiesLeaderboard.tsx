import { useState, useMemo } from 'react';
import {
  Trophy, Medal, Dumbbell, Code2, BookOpen, Mic2,
  Star, ChevronDown, ChevronUp, Search, Users,
  Award, Zap, FlaskConical, Target,
} from 'lucide-react';
import { students, categoryBg } from '@/data/studentData';
import { activitiesData, activityById } from '@/data/activitiesData';
import type { ActivityCategory } from '@/data/activitiesData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';

// ─── Tab config ─────────────────────────────────────────────────────────────
const TABS: { id: ActivityCategory | 'overall'; label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }[] = [
  { id: 'overall',        label: 'Overall',        icon: Trophy,       color: '#f59e0b', bg: 'bg-yellow-100 text-yellow-800' },
  { id: 'sports',         label: 'Sports',         icon: Dumbbell,     color: '#22c55e', bg: 'bg-green-100 text-green-800' },
  { id: 'hackathon',      label: 'Hackathon',      icon: Code2,        color: '#3b82f6', bg: 'bg-blue-100 text-blue-800' },
  { id: 'project',        label: 'Projects',       icon: FlaskConical, color: '#8b5cf6', bg: 'bg-purple-100 text-purple-800' },
  { id: 'seminar',        label: 'Seminars',       icon: Mic2,         color: '#06b6d4', bg: 'bg-cyan-100 text-cyan-800' },
  { id: 'extracurricular',label: 'Extra-Curricular',icon: Star,        color: '#ec4899', bg: 'bg-pink-100 text-pink-800' },
];

// ─── Score bar mini component ────────────────────────────────────────────────
function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-bold w-7 text-right tabular-nums">{score}</span>
    </div>
  );
}

// ─── Rank badge ──────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="flex items-center gap-1 text-yellow-500 font-bold"><Trophy className="w-4 h-4" />1</span>;
  if (rank === 2) return <span className="flex items-center gap-1 text-slate-400 font-bold"><Medal className="w-4 h-4" />2</span>;
  if (rank === 3) return <span className="flex items-center gap-1 text-amber-700 font-bold"><Medal className="w-4 h-4" />3</span>;
  return <span className="text-muted-foreground font-medium text-sm">{rank}</span>;
}

// ─── Detail columns per tab ──────────────────────────────────────────────────
function DetailCells({ tab, studentId }: { tab: ActivityCategory | 'overall'; studentId: string }) {
  const a = activityById[studentId];
  if (!a) return null;

  if (tab === 'sports') return (
    <>
      <td className="px-3 py-3 text-center">
        {a.sports.participated
          ? <span className="text-xs font-medium text-foreground">{a.sports.sport}</span>
          : <span className="text-xs text-muted-foreground">–</span>}
      </td>
      <td className="px-3 py-3 text-center text-sm">{a.sports.eventsPlayed || '–'}</td>
      <td className="px-3 py-3 text-center">
        {a.sports.medals > 0
          ? <span className="font-bold text-yellow-500">{'🏅'.repeat(a.sports.medals)}</span>
          : <span className="text-muted-foreground text-xs">–</span>}
      </td>
    </>
  );

  if (tab === 'hackathon') return (
    <>
      <td className="px-3 py-3 text-center text-sm">{a.hackathon.participated ? a.hackathon.hackathonsEntered : '–'}</td>
      <td className="px-3 py-3 text-center text-sm">{a.hackathon.participated ? a.hackathon.projectsSubmitted : '–'}</td>
      <td className="px-3 py-3 text-center">
        {a.hackathon.wins > 0
          ? <span className="font-bold text-blue-500">{'🏆'.repeat(a.hackathon.wins)}</span>
          : <span className="text-muted-foreground text-xs">{a.hackathon.participated ? '0' : '–'}</span>}
      </td>
      <td className="px-3 py-3 text-center">
        {a.hackathon.participated
          ? <span className="text-xs font-medium text-muted-foreground truncate max-w-[90px] block">{a.hackathon.techStack}</span>
          : <span className="text-xs text-muted-foreground">–</span>}
      </td>
    </>
  );

  if (tab === 'project') return (
    <>
      <td className="px-3 py-3 text-center text-sm font-medium">{a.project.projectsDone}</td>
      <td className="px-3 py-3 text-center">
        <span className="font-semibold" style={{ color: a.project.avgGrade >= 8 ? '#22c55e' : a.project.avgGrade >= 6 ? '#f59e0b' : '#ef4444' }}>
          {a.project.avgGrade}
        </span>
      </td>
      <td className="px-3 py-3 text-center text-sm">{a.project.publications || '–'}</td>
    </>
  );

  if (tab === 'seminar') return (
    <>
      <td className="px-3 py-3 text-center text-sm">{a.seminar.seminarsAttended}</td>
      <td className="px-3 py-3 text-center text-sm">{a.seminar.presented}</td>
      <td className="px-3 py-3 text-center text-sm">{a.seminar.papersRead}</td>
    </>
  );

  if (tab === 'extracurricular') return (
    <>
      <td className="px-3 py-3 text-center text-sm">{a.extracurricular.clubMemberships}</td>
      <td className="px-3 py-3 text-center text-sm">{a.extracurricular.leadershipRoles}</td>
      <td className="px-3 py-3 text-center text-sm">{a.extracurricular.volunteeringHrs}h</td>
      <td className="px-3 py-3 text-center text-sm">{a.extracurricular.culturalEvents}</td>
    </>
  );

  // overall
  return (
    <>
      <td className="px-3 py-3 text-center"><ScoreBar score={a.sports.score} color="#22c55e" /></td>
      <td className="px-3 py-3 text-center"><ScoreBar score={a.hackathon.score} color="#3b82f6" /></td>
      <td className="px-3 py-3 text-center"><ScoreBar score={a.project.score} color="#8b5cf6" /></td>
      <td className="px-3 py-3 text-center"><ScoreBar score={a.seminar.score} color="#06b6d4" /></td>
    </>
  );
}

function DetailHeaders({ tab }: { tab: ActivityCategory | 'overall' }) {
  if (tab === 'sports')          return <><th className="px-3 py-3 text-center">Sport</th><th className="px-3 py-3 text-center">Events</th><th className="px-3 py-3 text-center">Medals</th></>;
  if (tab === 'hackathon')       return <><th className="px-3 py-3 text-center">Entered</th><th className="px-3 py-3 text-center">Submitted</th><th className="px-3 py-3 text-center">Wins</th><th className="px-3 py-3 text-center">Tech Stack</th></>;
  if (tab === 'project')         return <><th className="px-3 py-3 text-center">Projects</th><th className="px-3 py-3 text-center">Avg Grade</th><th className="px-3 py-3 text-center">Publications</th></>;
  if (tab === 'seminar')         return <><th className="px-3 py-3 text-center">Attended</th><th className="px-3 py-3 text-center">Presented</th><th className="px-3 py-3 text-center">Papers Read</th></>;
  if (tab === 'extracurricular') return <><th className="px-3 py-3 text-center">Clubs</th><th className="px-3 py-3 text-center">Leader Roles</th><th className="px-3 py-3 text-center">Volunteering</th><th className="px-3 py-3 text-center">Cultural</th></>;
  return <><th className="px-3 py-3 text-center">Sports</th><th className="px-3 py-3 text-center">Hackathon</th><th className="px-3 py-3 text-center">Projects</th><th className="px-3 py-3 text-center">Seminars</th></>;
}

function getScore(studentId: string, tab: ActivityCategory | 'overall'): number {
  const a = activityById[studentId];
  if (!a) return 0;
  if (tab === 'overall')          return a.overallActivityScore;
  if (tab === 'sports')           return a.sports.score;
  if (tab === 'hackathon')        return a.hackathon.score;
  if (tab === 'project')          return a.project.score;
  if (tab === 'seminar')          return a.seminar.score;
  if (tab === 'extracurricular')  return a.extracurricular.score;
  return 0;
}

// ─── Top 3 Hero Cards ────────────────────────────────────────────────────────
function TopThree({ ranked, tab }: { ranked: typeof students; tab: ActivityCategory | 'overall' }) {
  const tabInfo = TABS.find(t => t.id === tab)!;
  const medals = [
    { label: '🥇 1st', bg: 'from-yellow-400 to-yellow-600', ring: 'ring-yellow-400', size: 'scale-110' },
    { label: '🥈 2nd', bg: 'from-slate-300 to-slate-500', ring: 'ring-slate-400', size: '' },
    { label: '🥉 3rd', bg: 'from-amber-600 to-amber-800', ring: 'ring-amber-600', size: '' },
  ];
  const top3 = ranked.slice(0, 3);

  return (
    <div className="flex items-end justify-center gap-4 py-6">
      {[top3[1], top3[0], top3[2]].map((s, pos) => {
        if (!s) return <div key={pos} className="w-28" />;
        const realPos = pos === 0 ? 1 : pos === 1 ? 0 : 2;
        const m = medals[realPos];
        const score = getScore(s.id, tab);
        return (
          <div key={s.id} className={`flex flex-col items-center gap-2 ${m.size}`}>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.bg} ring-4 ${m.ring} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-foreground leading-tight">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.department.replace('Information Technology', 'IT').replace('Computer Science', 'CS')}</div>
              <div className="mt-1 text-lg font-black" style={{ color: tabInfo.color }}>{score}</div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Summary bar charts ──────────────────────────────────────────────────────
function ActivitySummaryCharts({ tab }: { tab: ActivityCategory | 'overall' }) {
  const tabInfo = TABS.find(t => t.id === tab)!;

  if (tab === 'sports') {
    const sportCounts: Record<string, number> = {};
    activitiesData.filter(a => a.sports.participated).forEach(a => {
      sportCounts[a.sports.sport] = (sportCounts[a.sports.sport] || 0) + 1;
    });
    const data = Object.entries(sportCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([sport, count]) => ({ sport, count }));
    const participated = activitiesData.filter(a => a.sports.participated).length;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-secondary/40 rounded-xl p-4 text-center">
          <Dumbbell className="w-6 h-6 mx-auto mb-1" style={{ color: tabInfo.color }} />
          <div className="text-2xl font-bold" style={{ color: tabInfo.color }}>{participated}</div>
          <div className="text-xs text-muted-foreground">Students Participated</div>
        </div>
        <div className="bg-secondary/40 rounded-xl p-4 text-center">
          <Award className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
          <div className="text-2xl font-bold text-yellow-500">{activitiesData.reduce((s, a) => s + a.sports.medals, 0)}</div>
          <div className="text-xs text-muted-foreground">Total Medals Won</div>
        </div>
        <div className="bg-card rounded-xl p-3 col-span-1 md:col-span-1">
          <p className="text-xs text-muted-foreground mb-2 font-semibold">Top Sports</p>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="sport" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="count" fill={tabInfo.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (tab === 'hackathon') {
    const participated = activitiesData.filter(a => a.hackathon.participated).length;
    const totalWins = activitiesData.reduce((s, a) => s + a.hackathon.wins, 0);
    const techCounts: Record<string, number> = {};
    activitiesData.filter(a => a.hackathon.participated).forEach(a => {
      techCounts[a.hackathon.techStack] = (techCounts[a.hackathon.techStack] || 0) + 1;
    });
    const data = Object.entries(techCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([tech, count]) => ({ tech: tech.split(' + ')[0], count }));
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-secondary/40 rounded-xl p-4 text-center">
          <Code2 className="w-6 h-6 mx-auto mb-1" style={{ color: tabInfo.color }} />
          <div className="text-2xl font-bold" style={{ color: tabInfo.color }}>{participated}</div>
          <div className="text-xs text-muted-foreground">Participated</div>
        </div>
        <div className="bg-secondary/40 rounded-xl p-4 text-center">
          <Trophy className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
          <div className="text-2xl font-bold text-yellow-500">{totalWins}</div>
          <div className="text-xs text-muted-foreground">Total Wins</div>
        </div>
        <div className="bg-card rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-2 font-semibold">Top Tech Stacks</p>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="tech" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="count" fill={tabInfo.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (tab === 'overall') {
    const avgScores = TABS.filter(t => t.id !== 'overall').map(t => ({
      name: t.label,
      avg: Math.round(activitiesData.reduce((s, a) => s + getScore(a.studentId, t.id as ActivityCategory), 0) / activitiesData.length),
      color: t.color,
    }));
    return (
      <div className="bg-card rounded-xl p-4 mb-5">
        <p className="text-xs text-muted-foreground font-semibold mb-3 uppercase tracking-wider">Average Score by Activity</p>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={avgScores} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 93%)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 80]} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="avg" radius={[5, 5, 0, 0]}>
              {avgScores.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Generic summary for project, seminar, extracurricular
  const avg = Math.round(activitiesData.reduce((s, a) => s + getScore(a.studentId, tab), 0) / activitiesData.length);
  const high = activitiesData.filter(a => getScore(a.studentId, tab) >= 70).length;
  const IconComp = tabInfo.icon;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
      <div className="bg-secondary/40 rounded-xl p-4 text-center">
        <div className="flex justify-center mb-1" style={{ color: tabInfo.color }}>
          <IconComp className="w-6 h-6" />
        </div>
        <div className="text-2xl font-bold" style={{ color: tabInfo.color }}>{avg}</div>
        <div className="text-xs text-muted-foreground">Avg Score</div>
      </div>
      <div className="bg-secondary/40 rounded-xl p-4 text-center">
        <Zap className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
        <div className="text-2xl font-bold text-yellow-500">{high}</div>
        <div className="text-xs text-muted-foreground">Scored ≥70</div>
      </div>
      <div className="bg-secondary/40 rounded-xl p-4 text-center">
        <Target className="w-6 h-6 mx-auto mb-1 text-primary" />
        <div className="text-2xl font-bold text-primary">{activitiesData.length}</div>
        <div className="text-xs text-muted-foreground">Total Students</div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ActivitiesLeaderboard() {
  const [activeTab, setActiveTab] = useState<ActivityCategory | 'overall'>('overall');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const PER_PAGE = 15;

  const tabInfo = TABS.find(t => t.id === activeTab)!;
  const ActiveIcon = tabInfo.icon;

  const ranked = useMemo(() => {
    let list = [...students].sort((a, b) =>
      sortDir === 'desc'
        ? getScore(b.id, activeTab) - getScore(a.id, activeTab)
        : getScore(a.id, activeTab) - getScore(b.id, activeTab)
    );
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [activeTab, sortDir, search]);

  const totalPages = Math.ceil(ranked.length / PER_PAGE);
  const paginated = ranked.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // The full sorted list (without search filter) for ranks
  const globalRanked = useMemo(() =>
    [...students].sort((a, b) => getScore(b.id, activeTab) - getScore(a.id, activeTab)),
    [activeTab]
  );

  const unfiltered = useMemo(() =>
    [...students].sort((a, b) =>
      sortDir === 'desc'
        ? getScore(b.id, activeTab) - getScore(a.id, activeTab)
        : getScore(a.id, activeTab) - getScore(b.id, activeTab)
    ),
    [activeTab, sortDir]
  );

  return (
    <div className="space-y-5">
      {/* Tab pills */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setPage(1); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              activeTab === t.id
                ? 'text-white border-transparent shadow-md'
                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            }`}
            style={activeTab === t.id ? { backgroundColor: t.color, borderColor: t.color } : {}}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Main card */}
      <div className="bg-card rounded-2xl card-shadow overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border" style={{ borderTop: `3px solid ${tabInfo.color}` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: tabInfo.color + '20', color: tabInfo.color }}>
                <ActiveIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{tabInfo.label} Leaderboard</h2>
                <p className="text-xs text-muted-foreground">{ranked.length} students ranked</p>
              </div>
            </div>
            <button
              onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-sm font-medium hover:bg-secondary/70 transition-colors"
            >
              {sortDir === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              {sortDir === 'desc' ? 'Highest First' : 'Lowest First'}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search student name or ID..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-secondary rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Top 3 podium (only when no search, page 1) */}
        {!search && page === 1 && sortDir === 'desc' && (
          <div className="border-b border-border bg-secondary/20 px-5">
            <TopThree ranked={unfiltered} tab={activeTab} />
          </div>
        )}

        {/* Summary charts */}
        <div className="px-5 pt-5">
          <ActivitySummaryCharts tab={activeTab} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-semibold">Rank</th>
                <th className="px-4 py-3 text-left font-semibold">Student</th>
                <th className="px-4 py-3 text-left font-semibold">Dept</th>
                <th className="px-4 py-3 text-center font-semibold">Yr</th>
                <DetailHeaders tab={activeTab} />
                <th className="px-4 py-3 text-center font-semibold">Score</th>
                <th className="px-4 py-3 text-center font-semibold">Academic</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(s => {
                const score = getScore(s.id, activeTab);
                const globalRank = globalRanked.findIndex(r => r.id === s.id) + 1;
                return (
                  <tr key={s.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3"><RankBadge rank={globalRank} /></td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {s.department.replace('Information Technology', 'IT').replace('Computer Science', 'CS')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs bg-secondary rounded-full px-2 py-0.5">Y{s.year}</span>
                    </td>
                    <DetailCells tab={activeTab} studentId={s.id} />
                    <td className="px-4 py-3 text-center">
                      <ScoreBar score={score} color={tabInfo.color} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${categoryBg[s.category]}`}>
                        {s.category}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-secondary/20 text-sm text-muted-foreground">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-40 font-medium text-xs transition-colors">
              Prev
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-40 font-medium text-xs transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
