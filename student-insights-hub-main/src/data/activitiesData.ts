import { students } from './studentData';

export type ActivityCategory = 'sports' | 'hackathon' | 'project' | 'seminar' | 'extracurricular';

export interface SportActivity {
  participated: boolean;
  sport: string;
  eventsPlayed: number;   // 1-6
  medals: number;         // 0-3  (gold=3, silver=2, bronze=1 pts each)
  score: number;          // 0-100
}

export interface HackathonActivity {
  participated: boolean;
  hackathonsEntered: number;  // 0-5
  projectsSubmitted: number;  // 0-5
  wins: number;               // 0-3
  techStack: string;
  score: number;              // 0-100
}

export interface ProjectActivity {
  projectsDone: number;    // 1-6
  avgGrade: number;        // 0-10
  publications: number;    // 0-2
  score: number;           // 0-100
}

export interface SeminarActivity {
  seminarsAttended: number;    // 0-10
  presented: number;           // 0-4
  papersRead: number;          // 0-8
  score: number;               // 0-100
}

export interface ExtraCurricular {
  clubMemberships: number;  // 0-4
  leadershipRoles: number;  // 0-2
  volunteeringHrs: number;  // 0-50
  culturalEvents: number;   // 0-5
  score: number;            // 0-100
}

export interface StudentActivity {
  studentId: string;
  sports: SportActivity;
  hackathon: HackathonActivity;
  project: ProjectActivity;
  seminar: SeminarActivity;
  extracurricular: ExtraCurricular;
  overallActivityScore: number;
}

// Deterministic seeded random using student index
function sr(seed: number, salt: number = 0): number {
  const x = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453123;
  return x - Math.floor(x);
}
function rng(seed: number, salt: number, min: number, max: number): number {
  return Math.floor(sr(seed, salt) * (max - min + 1)) + min;
}

const SPORTS = [
  'Football', 'Cricket', 'Basketball', 'Badminton',
  'Table Tennis', 'Swimming', 'Athletics', 'Volleyball',
  'Chess', 'Kabaddi',
];

const TECH_STACKS = [
  'React + Node', 'Python + ML', 'Flutter + Firebase',
  'Java Spring', 'Vue + Django', 'Next.js + Supabase',
  'Arduino + IoT', 'TensorFlow + FastAPI',
];

function buildActivity(idx: number): StudentActivity {
  const s = students[idx];
  const sid = idx;

  // ── Sports ──────────────────────────────────────────────
  const sParticipated = sr(sid, 1) > 0.35;
  const sEvents = sParticipated ? rng(sid, 2, 1, 6) : 0;
  const sMedals = sParticipated ? rng(sid, 3, 0, Math.min(3, sEvents)) : 0;
  const sScore = sParticipated
    ? Math.min(100, Math.round(sEvents * 8 + sMedals * 18 + sr(sid, 4) * 30))
    : 0;

  // ── Hackathon ────────────────────────────────────────────
  const hParticipated = sr(sid, 5) > 0.40;
  const hEntered = hParticipated ? rng(sid, 6, 1, 5) : 0;
  const hSubmitted = hParticipated ? rng(sid, 7, 1, hEntered) : 0;
  const hWins = hParticipated ? rng(sid, 8, 0, Math.min(2, hSubmitted)) : 0;
  const hScore = hParticipated
    ? Math.min(100, Math.round(hEntered * 6 + hSubmitted * 10 + hWins * 22 + sr(sid, 9) * 20))
    : 0;

  // ── Project ──────────────────────────────────────────────
  const pDone = rng(sid, 10, 1, 6);
  const pGrade = parseFloat((sr(sid, 11) * 4 + 6).toFixed(1));  // 6.0–10.0
  const pPubs = rng(sid, 12, 0, 2);
  const pScore = Math.min(100, Math.round(pDone * 9 + pGrade * 3.5 + pPubs * 12 + sr(sid, 13) * 15));

  // ── Seminar ──────────────────────────────────────────────
  const semAttended = rng(sid, 14, 1, 10);
  const semPresented = rng(sid, 15, 0, Math.min(4, Math.floor(semAttended / 2)));
  const semPapers = rng(sid, 16, 0, 8);
  const semScore = Math.min(100, Math.round(semAttended * 4 + semPresented * 14 + semPapers * 3 + sr(sid, 17) * 15));

  // ── Extra-Curricular ─────────────────────────────────────
  const eClubs = rng(sid, 18, 0, 4);
  const eLeader = rng(sid, 19, 0, Math.min(2, eClubs));
  const eVolunteer = rng(sid, 20, 0, 50);
  const eCultural = rng(sid, 21, 0, 5);
  const eScore = Math.min(100, Math.round(eClubs * 10 + eLeader * 15 + eVolunteer * 0.6 + eCultural * 5 + sr(sid, 22) * 10));

  const overallActivityScore = Math.round(
    (sScore * 0.20 + hScore * 0.25 + pScore * 0.25 + semScore * 0.15 + eScore * 0.15)
  );

  return {
    studentId: s.id,
    sports: {
      participated: sParticipated,
      sport: SPORTS[rng(sid, 23, 0, SPORTS.length - 1)],
      eventsPlayed: sEvents,
      medals: sMedals,
      score: sScore,
    },
    hackathon: {
      participated: hParticipated,
      hackathonsEntered: hEntered,
      projectsSubmitted: hSubmitted,
      wins: hWins,
      techStack: TECH_STACKS[rng(sid, 24, 0, TECH_STACKS.length - 1)],
      score: hScore,
    },
    project: {
      projectsDone: pDone,
      avgGrade: pGrade,
      publications: pPubs,
      score: pScore,
    },
    seminar: {
      seminarsAttended: semAttended,
      presented: semPresented,
      papersRead: semPapers,
      score: semScore,
    },
    extracurricular: {
      clubMemberships: eClubs,
      leadershipRoles: eLeader,
      volunteeringHrs: eVolunteer,
      culturalEvents: eCultural,
      score: eScore,
    },
    overallActivityScore,
  };
}

export const activitiesData: StudentActivity[] = students.map((_, i) => buildActivity(i));

// Lookup map by student ID
export const activityById: Record<string, StudentActivity> = Object.fromEntries(
  activitiesData.map(a => [a.studentId, a])
);
