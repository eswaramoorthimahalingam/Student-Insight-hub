import { useState } from 'react';
import { GraduationCap, LayoutDashboard, Trophy, BarChart3, Flame } from 'lucide-react';
import StatsCards from '@/components/StatsCards';
import ChartsGrid from '@/components/ChartsGrid';
import Leaderboard from '@/components/Leaderboard';
import StudentAnalysis from '@/components/StudentAnalysis';
import ActivitiesLeaderboard from '@/components/ActivitiesLeaderboard';
import type { Student } from '@/data/studentData';

type Tab = 'overview' | 'charts' | 'leaderboard' | 'activities';

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
    { id: 'charts',      label: 'Analytics',   icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'activities',  label: 'Activities',  icon: Flame },
  ];

  const headings: Record<Tab, { title: string; sub: string }> = {
    overview:    { title: 'Performance Overview',        sub: 'Key metrics across 150 student records' },
    charts:      { title: 'Analytics & Insights',        sub: 'Visual breakdown of performance patterns' },
    leaderboard: { title: 'Academic Leaderboard',        sub: 'Click any student row to view individual analysis' },
    activities:  { title: 'Extra-Curricular Leaderboard',sub: 'Rankings by Sports, Hackathon, Projects, Seminars & more' },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="bg-card border-b border-border sticky top-0 z-40 card-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">EduPredict</h1>
              <p className="text-xs text-muted-foreground leading-tight">Student Performance Dashboard</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === t.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <div className="mb-3">
            <h2 className="text-xl font-bold">{headings[activeTab].title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{headings[activeTab].sub}</p>
          </div>
          <StatsCards />
        </div>

        {activeTab === 'overview' && (
          <>
            <ChartsGrid />
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top Performers
              </h2>
              <Leaderboard onSelectStudent={setSelectedStudent} />
            </div>
          </>
        )}

        {activeTab === 'charts' && <ChartsGrid />}

        {activeTab === 'leaderboard' && (
          <Leaderboard onSelectStudent={setSelectedStudent} />
        )}

        {activeTab === 'activities' && <ActivitiesLeaderboard />}
      </main>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentAnalysis student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}
