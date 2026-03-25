import { useState, useMemo } from 'react';
import { Trophy, Medal, ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';
import { students, categoryBg, departments } from '@/data/studentData';
import type { Student } from '@/data/studentData';

interface LeaderboardProps {
  onSelectStudent: (s: Student) => void;
}

export default function Leaderboard({ onSelectStudent }: LeaderboardProps) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [catFilter, setCatFilter] = useState('All');
  const [sortKey, setSortKey] = useState<'predictedScore' | 'attendanceAvg' | 'certifications'>('predictedScore');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const filtered = useMemo(() => {
    let list = [...students];
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()));
    if (deptFilter !== 'All') list = list.filter(s => s.department === deptFilter);
    if (catFilter !== 'All') list = list.filter(s => s.category === catFilter);
    list.sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
    return list;
  }, [search, deptFilter, catFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const globalRanks = useMemo(() => {
    const sorted = [...students].sort((a, b) => b.predictedScore - a.predictedScore);
    const ranks: Record<string, number> = {};
    sorted.forEach((s, i) => { ranks[s.id] = i + 1; });
    return ranks;
  }, []);

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  function SortIcon({ k }: { k: typeof sortKey }) {
    if (sortKey !== k) return <ChevronUp className="w-3 h-3 opacity-30" />;
    return sortDir === 'desc' ? <ChevronDown className="w-3 h-3 text-primary" /> : <ChevronUp className="w-3 h-3 text-primary" />;
  }

  function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) return <span className="text-yellow-500 font-bold flex items-center gap-1"><Trophy className="w-4 h-4" />1</span>;
    if (rank === 2) return <span className="text-slate-400 font-bold flex items-center gap-1"><Medal className="w-4 h-4" />2</span>;
    if (rank === 3) return <span className="text-amber-700 font-bold flex items-center gap-1"><Medal className="w-4 h-4" />3</span>;
    return <span className="text-muted-foreground font-medium text-sm">{rank}</span>;
  }

  return (
    <div className="bg-card rounded-2xl card-shadow overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Student Leaderboard
            <span className="text-sm text-muted-foreground font-normal ml-1">({filtered.length} students)</span>
          </h2>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name or ID..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-secondary rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={deptFilter}
            onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm bg-secondary rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="All">All Departments</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
          <select
            value={catFilter}
            onChange={e => { setCatFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm bg-secondary rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="All">All Categories</option>
            {['High', 'Medium', 'Low', 'Critical'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left font-semibold">Rank</th>
              <th className="px-4 py-3 text-left font-semibold">Student</th>
              <th className="px-4 py-3 text-left font-semibold">Department</th>
              <th className="px-4 py-3 text-center font-semibold">Year</th>
              <th
                className="px-4 py-3 text-center font-semibold cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => toggleSort('predictedScore')}
              >
                <span className="flex items-center gap-1 justify-center">Score <SortIcon k="predictedScore" /></span>
              </th>
              <th
                className="px-4 py-3 text-center font-semibold cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => toggleSort('attendanceAvg')}
              >
                <span className="flex items-center gap-1 justify-center">Attendance <SortIcon k="attendanceAvg" /></span>
              </th>
              <th
                className="px-4 py-3 text-center font-semibold cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => toggleSort('certifications')}
              >
                <span className="flex items-center gap-1 justify-center">Certs <SortIcon k="certifications" /></span>
              </th>
              <th className="px-4 py-3 text-center font-semibold">Category</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((s, i) => {
              const globalRank = globalRanks[s.id];
              return (
                <tr
                  key={s.id}
                  onClick={() => onSelectStudent(s)}
                  className="border-t border-border/50 hover:bg-secondary/40 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 w-12">
                    <RankBadge rank={globalRank} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-xs">{s.department}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs bg-secondary rounded-full px-2 py-0.5">Y{s.year}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${s.predictedScore}%` }}
                        />
                      </div>
                      <span className="font-semibold text-foreground w-7 text-right">{s.predictedScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-medium ${s.attendanceAvg >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                      {s.attendanceAvg}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-medium">{s.certifications}</td>
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
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-40 font-medium text-xs transition-colors"
          >
            Prev
          </button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  p === page ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-40 font-medium text-xs transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
