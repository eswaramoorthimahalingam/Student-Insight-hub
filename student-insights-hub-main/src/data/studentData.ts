export interface Student {
  id: string;
  name: string;
  department: string;
  year: number;
  attendanceAvg: number;
  certifications: number;
  predictedScore: number;
  category: 'High' | 'Medium' | 'Low' | 'Critical';
  gpa1: number | null;
  gpa2: number | null;
  gpa3: number | null;
}

const raw = `S20240001,Jack Singh,Mechanical,1,71,5,68,Medium,4.3,-,-
S20240002,Eva Singh,Computer Science,2,85,4,92,High,9.3,7.3,-
S20240003,Uma Singh,Information Technology,3,64,4,65,Medium,3.6,6.5,4.8
S20240004,Liam Singh,Information Technology,2,95,2,72,Medium,3.1,8.1,-
S20240005,Tom Singh,Information Technology,2,71,2,72,Medium,8.9,5.8,-
S20240006,Tom Nair,Computer Science,4,90,4,95,High,7.7,6.5,4.5
S20240007,Liam Raj,Information Technology,1,57,6,93,High,8,-,-
S20240008,Alice Kumar,Information Technology,4,86,6,100,High,9.1,6.3,5.4
S20240009,Henry Kumar,Electronics,1,50,3,85,High,8.1,-,-
S20240010,Rahul Kumar,Mechanical,1,88,6,88,High,4.4,-,-
S20240011,Alice Das,AI & DS,2,60,6,87,High,9.4,5.3,-
S20240012,Nina Raj,Information Technology,3,66,0,65,Medium,10,3.8,5.4
S20240013,Owen Das,AI & DS,2,82,3,86,High,8.3,7.2,-
S20240014,Maya Singh,Electronics,1,76,2,85,High,7.7,-,-
S20240015,Alice Das,Electronics,4,93,5,96,High,7.1,5.9,8.1
S20240016,Alice Kumar,Chemistry,1,81,4,97,High,8.2,-,-
S20240017,Maya Nair,AI & DS,3,60,2,69,Medium,7.5,6.5,8.4
S20240018,Sara Singh,Electronics,2,65,0,61,Medium,6.5,6.1,-
S20240019,Tom Singh,Mechanical,4,95,0,79,Medium,8.5,7.9,7.8
S20240020,David Singh,Chemistry,4,93,4,93,High,3.6,9.1,6.3
S20240021,Liam Raj,Information Technology,2,83,2,59,Low,3.5,3.5,-
S20240022,Tom Nair,Information Technology,4,78,4,82,Medium,7.6,3.6,9.1
S20240023,Frank Nair,Electronics,4,61,1,83,Medium,9.8,9.8,9.6
S20240024,Henry Das,Computer Science,3,72,5,93,High,8.1,6.3,8.9
S20240025,Tom Kumar,Electronics,3,93,4,92,High,8.3,7.2,8
S20240026,David Nair,Computer Science,3,67,5,91,High,8.1,7.8,6.7
S20240027,Tom Singh,Mechanical,2,91,0,70,Medium,6.6,7.9,-
S20240028,Sara Raj,Electronics,1,78,1,64,Medium,6.7,-,-
S20240029,Uma Das,Civil,3,92,5,100,High,8.2,8.6,9.8
S20240030,Zara Raj,Mechanical,2,91,5,87,High,5.4,5.7,-
S20240031,Henry Kumar,Computer Science,1,57,0,50,Low,5.3,-,-
S20240032,Tom Das,AI & DS,1,64,0,51,Low,4.2,-,-
S20240033,Grace Nair,Chemistry,1,64,5,64,Medium,4.6,-,-
S20240034,Jack Nair,Computer Science,4,96,6,100,High,10,8.2,10
S20240035,Rahul Nair,AI & DS,2,78,0,52,Low,3.9,7.3,-
S20240036,Nina Singh,Civil,2,51,1,67,Medium,6.3,7,-
S20240037,Grace Kumar,Civil,4,55,1,56,Low,7.2,5.9,10
S20240038,Nina Das,Civil,3,55,1,53,Low,5.3,4.4,7.3
S20240039,Alice Singh,Chemistry,4,69,4,90,High,9.6,8.9,5.7
S20240040,Uma Singh,AI & DS,3,86,0,64,Medium,9.5,6.1,8.3
S20240041,Nina Nair,AI & DS,2,69,2,62,Medium,6.1,5.7,-
S20240042,Rahul Raj,AI & DS,2,50,5,69,Medium,5.2,4.9,-
S20240043,Nina Nair,Computer Science,2,91,4,91,High,9,4.5,-
S20240044,Grace Singh,Chemistry,4,77,4,88,High,6,9.4,10
S20240045,Kiran Singh,Chemistry,3,75,6,100,High,4.6,7.6,7
S20240046,Ivy Das,Chemistry,4,100,2,77,Medium,6.6,7.4,6.2
S20240047,Nina Kumar,Civil,2,51,6,95,High,8.5,8.8,-
S20240048,Sara Das,Information Technology,2,66,1,70,Medium,4,7.6,-
S20240049,Nina Das,Mechanical,2,61,2,57,Low,3.9,3.8,-
S20240050,Jack Kumar,Civil,4,68,3,75,Medium,5.8,5.1,9.6
S20240051,Rahul Nair,Chemistry,4,82,1,65,Medium,5.8,7.9,3
S20240052,Grace Das,Civil,3,99,6,100,High,6.4,8.8,5.9
S20240053,Jack Das,Electronics,4,68,1,59,Low,4.7,10,3
S20240054,Sara Raj,Mechanical,4,83,4,92,High,8.2,6.2,8.3
S20240055,Carol Das,Civil,1,71,0,61,Medium,5.7,-,-
S20240056,Owen Das,Mechanical,2,55,0,43,Critical,7.2,3.6,-
S20240057,Henry Kumar,Mechanical,1,88,1,77,Medium,8.9,-,-
S20240058,Sara Raj,Chemistry,4,85,5,99,High,5.2,10,7.4
S20240059,Henry Kumar,Information Technology,1,51,4,83,Medium,7.8,-,-
S20240060,Uma Kumar,Electronics,4,95,0,82,Medium,6.7,8.4,3.5
S20240061,David Kumar,Civil,3,66,3,77,Medium,6.2,9.1,10
S20240062,Kiran Das,Electronics,3,52,6,93,High,10,7.6,5.9
S20240063,David Das,AI & DS,3,54,5,93,High,8,7.9,10
S20240064,Sara Das,Chemistry,1,94,4,91,High,8.1,-,-
S20240065,Eva Raj,AI & DS,4,56,4,64,Medium,5.1,5.4,5.1
S20240066,Bob Das,Civil,4,90,2,86,High,6.5,6.4,5.7
S20240067,Kiran Nair,Computer Science,4,96,4,95,High,5.3,6.7,7.5
S20240068,Bob Nair,Information Technology,2,81,1,69,Medium,7.2,3.8,-
S20240069,Nina Raj,Civil,3,70,3,72,Medium,4.8,6.1,8
S20240070,Carol Raj,Computer Science,3,94,1,83,Medium,6.6,7.4,8.3
S20240071,Zara Raj,Electronics,1,68,5,77,Medium,5.1,-,-
S20240072,Frank Singh,Information Technology,4,59,3,67,Medium,7,4.8,5.8
S20240073,Zara Singh,Electronics,4,56,4,67,Medium,6,5.6,4.4
S20240074,Owen Singh,Electronics,2,82,3,95,High,9.4,7.5,-
S20240075,Maya Raj,Information Technology,2,70,0,61,Medium,7.7,6.5,-
S20240076,Henry Nair,Information Technology,1,84,3,75,Medium,5.4,-,-
S20240077,Ivy Singh,Electronics,2,63,3,75,Medium,7.7,5,-
S20240078,Grace Nair,Mechanical,1,73,5,89,High,6.9,-,-
S20240079,Frank Nair,AI & DS,4,71,6,95,High,8.8,7.3,7
S20240080,Ivy Singh,Computer Science,4,84,4,93,High,6.5,10,5.7
S20240081,Uma Raj,Electronics,1,84,2,81,Medium,8.1,-,-
S20240082,Jack Singh,Computer Science,3,91,0,71,Medium,5.9,8.1,10
S20240083,Frank Raj,Chemistry,3,63,3,71,Medium,7.2,5.5,10
S20240084,Ivy Raj,Computer Science,1,73,6,91,High,5.9,-,-
S20240085,Rahul Das,Electronics,4,51,4,81,Medium,8.5,7.6,10
S20240086,Tom Das,Civil,2,94,2,85,High,6.5,7.8,-
S20240087,Nina Singh,Electronics,3,57,0,41,Critical,4.5,10,3
S20240088,Eva Kumar,AI & DS,3,65,2,69,Medium,7,5.9,6.5
S20240089,Sara Singh,Civil,3,87,6,98,High,8,3.9,7.9
S20240090,Henry Das,Chemistry,4,93,1,74,Medium,9.3,4.8,5.3
S20240091,Eva Das,Civil,2,65,4,76,Medium,4.1,6.4,-
S20240092,Priya Raj,Computer Science,4,99,3,99,High,8.8,9.2,6.5
S20240093,Owen Das,Civil,1,100,5,93,High,6.7,-,-
S20240094,Grace Raj,Mechanical,1,91,6,92,High,4.5,-,-
S20240095,Uma Das,Computer Science,4,89,3,78,Medium,7.1,7.7,3
S20240096,Grace Raj,Mechanical,3,65,5,79,Medium,8.3,5.8,6.3
S20240097,Frank Singh,Mechanical,1,100,1,72,Medium,5.1,-,-
S20240098,Uma Singh,Electronics,1,65,3,80,Medium,8,-,-
S20240099,Tom Das,Electronics,2,70,6,94,High,9.5,6.1,-
S20240100,Frank Kumar,AI & DS,2,64,2,75,Medium,6.8,7.4,-
S20240101,Maya Singh,Civil,3,77,4,83,Medium,8.3,8,5.5
S20240102,Jack Raj,Mechanical,2,56,4,71,Medium,7.3,7.4,-
S20240103,Priya Kumar,AI & DS,2,84,4,82,Medium,5.4,7,-
S20240104,Ivy Nair,Civil,1,61,1,68,Medium,7.5,-,-
S20240105,Alice Nair,Civil,4,66,5,82,Medium,6.6,8.8,8.7
S20240106,Kiran Kumar,Mechanical,4,85,2,84,Medium,9.8,7.5,5.5
S20240107,Jack Das,Civil,2,68,5,84,High,7.5,8,-
S20240108,Rahul Singh,AI & DS,3,56,2,68,Medium,6.6,7.9,7.5
S20240109,Frank Das,Information Technology,4,98,5,97,High,8.2,5.3,5.3
S20240110,Tom Raj,AI & DS,3,97,6,100,High,10,10,7
S20240111,Rahul Kumar,Information Technology,4,60,0,57,Low,3.4,4.7,5.8
S20240112,Bob Kumar,Information Technology,3,70,5,92,High,5.7,6,5.7
S20240113,Nina Kumar,Mechanical,2,79,4,82,Medium,7.6,7,-
S20240114,Henry Singh,AI & DS,3,55,6,87,High,7.3,8.6,9.8
S20240115,Henry Das,Mechanical,4,55,2,63,Medium,4.9,7.9,5.8
S20240116,Carol Singh,AI & DS,3,86,5,88,High,6,8.3,6.1
S20240117,Uma Singh,Civil,2,53,2,62,Medium,7.7,5.2,-
S20240118,Alice Kumar,Mechanical,3,100,1,84,Medium,8.5,6.8,9.3
S20240119,Vikram Singh,Computer Science,3,79,3,72,Medium,6.5,8.5,6.3
S20240120,Bob Nair,Civil,3,70,3,80,Medium,7.3,7.5,7.3
S20240121,Maya Kumar,Mechanical,2,91,3,83,Medium,5.2,9.5,-
S20240122,Kiran Raj,Computer Science,1,68,5,91,High,8,-,-
S20240123,Ivy Singh,AI & DS,2,74,6,95,High,9.8,9.4,-
S20240124,Rahul Nair,Electronics,1,90,5,90,High,7.6,-,-
S20240125,Zara Das,Chemistry,3,90,3,86,High,4.7,8.8,8.5
S20240126,Henry Nair,Chemistry,4,79,2,77,Medium,7.1,7.8,9.5
S20240127,Bob Das,Chemistry,3,95,5,98,High,9.3,6.3,8.9
S20240128,Frank Nair,Chemistry,1,58,3,63,Medium,7.1,-,-
S20240129,Priya Das,Computer Science,2,61,1,66,Medium,5.3,8.2,-
S20240130,Eva Raj,Mechanical,3,58,3,70,Medium,4.8,8.8,5
S20240131,Priya Kumar,Computer Science,4,77,4,92,High,7.9,4.8,9.2
S20240132,Grace Das,Mechanical,4,58,2,65,Medium,3.3,8.7,5.2
S20240133,Vikram Nair,Information Technology,4,73,4,85,High,7,5,8.8
S20240134,Jack Das,AI & DS,2,74,3,79,Medium,7.7,7.9,-
S20240135,Owen Singh,AI & DS,1,72,6,96,High,9.8,-,-
S20240136,Rahul Singh,Electronics,1,69,3,69,Medium,5.2,-,-
S20240137,Priya Singh,Electronics,4,67,6,93,High,7.2,8.4,8.7
S20240138,Henry Raj,Computer Science,4,85,6,100,High,6.9,6.8,5.5
S20240139,Kiran Raj,Electronics,3,74,6,97,High,9.7,9.3,7
S20240140,Uma Raj,Mechanical,2,71,4,77,Medium,7.9,5.8,-
S20240141,Bob Raj,Computer Science,1,90,5,97,High,9.1,-,-
S20240142,Bob Kumar,Computer Science,1,62,5,87,High,9.6,-,-
S20240143,Carol Raj,AI & DS,3,81,5,94,High,8.1,6.3,6.8
S20240144,Eva Nair,Civil,1,86,4,83,Medium,5.7,-,-
S20240145,Frank Singh,Chemistry,1,83,5,82,Medium,5.7,-,-
S20240146,Kiran Raj,AI & DS,3,66,0,61,Medium,6.1,8.9,7.8
S20240147,Priya Raj,Chemistry,2,87,2,82,Medium,4.8,8.1,-
S20240148,Rahul Das,Mechanical,4,65,2,68,Medium,7.8,6.3,5
S20240149,Henry Singh,Electronics,1,67,3,68,Medium,5.7,-,-
S20240150,Jack Raj,AI & DS,2,52,4,76,Medium,9.4,6.7,-`;

function parseGpa(v: string): number | null {
  if (v === '-' || v === '' || v === undefined) return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function parseRow(line: string): Student {
  const parts = line.split(',');
  // Handle "AI & DS" department which has a comma-less comma in name
  // Fields: id,name,dept,year,attendance,certs,score,category,gpa1,gpa2,gpa3
  return {
    id: parts[0],
    name: parts[1],
    department: parts[2],
    year: parseInt(parts[3]),
    attendanceAvg: parseInt(parts[4]),
    certifications: parseInt(parts[5]),
    predictedScore: parseInt(parts[6]),
    category: parts[7] as Student['category'],
    gpa1: parseGpa(parts[8]),
    gpa2: parseGpa(parts[9]),
    gpa3: parseGpa(parts[10]),
  };
}

export const students: Student[] = raw.trim().split('\n').map(parseRow);

export const departments = [...new Set(students.map(s => s.department))].sort();

export const categoryColors: Record<string, string> = {
  High: '#22c55e',
  Medium: '#f59e0b',
  Low: '#ef4444',
  Critical: '#7c3aed',
};

export const categoryBg: Record<string, string> = {
  High: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-red-100 text-red-800',
  Critical: 'bg-purple-100 text-purple-800',
};

export const departmentColors = [
  '#3b82f6', '#f59e0b', '#22c55e', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#f97316',
];

export function getAvgGpa(s: Student): number | null {
  const vals = [s.gpa1, s.gpa2, s.gpa3].filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
}
