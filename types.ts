export enum Role {
  Student = 'Student',
  HallHead = 'Hall Head',
  SubjectTeacher = 'Subject Teacher',
  Finance = 'Finance Staff',
  Security = 'Security',
  Admin = 'System Admin',
}

export enum ClearanceStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Flagged = 'Flagged',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Book {
  id: string;
  title: string;
  bookCode: string;
  returned: boolean;
  imageUrl?: string;
}

export interface Fine {
  id: string;
  reason: string;
  amount: number;
  paid: boolean;
  receiptUrl?: string;
}

export interface SubjectClearance {
  id: string;
  subjectName: string;
  teacherName: string;
  teacherId: string;
  status: ClearanceStatus;
  comment: string;
  updatedAt: string;
}

export interface Approval {
  id: string;
  department: 'HallHead' | 'Finance' | 'Security';
  status: ClearanceStatus;
  approverName: string;
  comment: string;
  updatedAt: string;
}

export interface Student extends User {
  role: Role.Student;
  studentId: string; // e.g., 'ALA2025-001'
  hall: string;
  room: string;
  hallHeadName: string;
  books: Book[];
  fines: Fine[];
  subjectClearances: SubjectClearance[];
  approvals: Approval[];
}

export interface Staff extends User {
  role: Role.HallHead | Role.SubjectTeacher | Role.Finance | Role.Security | Role.Admin;
}
