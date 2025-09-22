import { Role, ClearanceStatus, type Student, type Staff, type User } from '../types';

// Fix: Explicitly type the subjectTeachers array to ensure role is correctly typed.
const subjectTeachers: (Staff & { subject: string })[] = [
  { id: 'staff-5', email: 'bopape@ala.org', name: 'Dr. Bopape', role: Role.SubjectTeacher, subject: 'Entrepreneurial Leadership' },
  { id: 'staff-6', email: 'nkosi@ala.org', name: 'Ms. Nkosi', role: Role.SubjectTeacher, subject: 'African Studies' },
  { id: 'staff-7', email: 'williams@ala.org', name: 'Mr. Williams', role: Role.SubjectTeacher, subject: 'Writing & Rhetoric' },
  { id: 'staff-8', email: 'pdavis@ala.org', name: 'Prof. Davis', role: Role.SubjectTeacher, subject: 'Mathematics' },
  { id: 'staff-9', email: 'einstein@ala.org', name: 'Dr. Einstein', role: Role.SubjectTeacher, subject: 'Physics' },
  { id: 'staff-10', email: 'ada@ala.org', name: 'Prof. Ada', role: Role.SubjectTeacher, subject: 'Computer Science' }
];

let students: Student[] = [
  {
    id: 'student-1',
    studentId: 'ALA2025-001',
    email: 'jdoe25@alastudents.org',
    name: 'John Doe',
    role: Role.Student,
    hall: 'Mandela Hall',
    room: '101A',
    hallHeadName: 'Mr. Jones',
    books: [
      { id: 'book-1', title: 'Calculus I', bookCode: 'MATH101', returned: true },
      { id: 'book-2', title: 'Intro to Physics', bookCode: 'PHY101', returned: false },
    ],
    fines: [
      { id: 'fine-1', reason: 'Late Library Book', amount: 15.00, paid: true, receiptUrl: 'https://picsum.photos/200' },
      { id: 'fine-2', reason: 'Damaged Lab Equipment', amount: 50.00, paid: false },
    ],
    subjectClearances: [
        { id: 'sc-1', subjectName: 'Entrepreneurial Leadership', teacherId: 'staff-5', teacherName: 'Dr. Bopape', status: ClearanceStatus.Approved, comment: '', updatedAt: new Date().toISOString() },
        { id: 'sc-2', subjectName: 'African Studies', teacherId: 'staff-6', teacherName: 'Ms. Nkosi', status: ClearanceStatus.Approved, comment: '', updatedAt: new Date().toISOString() },
        { id: 'sc-3', subjectName: 'Writing & Rhetoric', teacherId: 'staff-7', teacherName: 'Mr. Williams', status: ClearanceStatus.Pending, comment: '', updatedAt: new Date().toISOString() },
        { id: 'sc-4', subjectName: 'Mathematics', teacherId: 'staff-8', teacherName: 'Prof. Davis', status: ClearanceStatus.Approved, comment: '', updatedAt: new Date().toISOString() },
        { id: 'sc-5', subjectName: 'Physics', teacherId: 'staff-9', teacherName: 'Dr. Einstein', status: ClearanceStatus.Flagged, comment: 'Missed final lab submission.', updatedAt: new Date().toISOString() },
        { id: 'sc-6', subjectName: 'Computer Science', teacherId: 'staff-10', teacherName: 'Prof. Ada', status: ClearanceStatus.Approved, comment: 'Excellent project work.', updatedAt: new Date().toISOString() }
    ],
    approvals: [
      { id: 'appr-1', department: 'HallHead', status: ClearanceStatus.Approved, approverName: 'Mr. Jones', comment: 'Room clean, no issues.', updatedAt: new Date().toISOString() },
      { id: 'appr-2', department: 'Finance', status: ClearanceStatus.Flagged, approverName: 'Mrs. Davis', comment: 'Outstanding fine for lab equipment.', updatedAt: new Date().toISOString() },
      { id: 'appr-3', department: 'Security', status: ClearanceStatus.Pending, approverName: 'Officer Mike', comment: '', updatedAt: new Date().toISOString() },
    ],
  },
   {
    id: 'student-2',
    studentId: 'ALA2025-002',
    email: 'asmith25@alastudents.org',
    name: 'Alice Smith',
    role: Role.Student,
    hall: 'Tutu Hall',
    room: '202B',
    hallHeadName: 'Ms. Pearl',
    books: [
      { id: 'book-3', title: 'Organic Chemistry', bookCode: 'CHEM202', returned: true },
    ],
    fines: [],
    subjectClearances: [
        { id: 'sc-7', subjectName: 'Entrepreneurial Leadership', teacherId: 'staff-5', teacherName: 'Dr. Bopape', status: ClearanceStatus.Approved, comment: 'All clear.', updatedAt: new Date().toISOString() },
        { id: 'sc-8', subjectName: 'African Studies', teacherId: 'staff-6', teacherName: 'Ms. Nkosi', status: ClearanceStatus.Approved, comment: 'All clear.', updatedAt: new Date().toISOString() },
        { id: 'sc-9', subjectName: 'Writing & Rhetoric', teacherId: 'staff-7', teacherName: 'Mr. Williams', status: ClearanceStatus.Approved, comment: 'All clear.', updatedAt: new Date().toISOString() },
        { id: 'sc-10', subjectName: 'Mathematics', teacherId: 'staff-8', teacherName: 'Prof. Davis', status: ClearanceStatus.Approved, comment: 'All clear.', updatedAt: new Date().toISOString() },
        { id: 'sc-11', subjectName: 'Physics', teacherId: 'staff-9', teacherName: 'Dr. Einstein', status: ClearanceStatus.Approved, comment: 'All clear.', updatedAt: new Date().toISOString() },
        { id: 'sc-12', subjectName: 'Computer Science', teacherId: 'staff-10', teacherName: 'Prof. Ada', status: ClearanceStatus.Approved, comment: 'All clear.', updatedAt: new Date().toISOString() }
    ],
    approvals: [
      { id: 'appr-4', department: 'HallHead', status: ClearanceStatus.Approved, approverName: 'Ms. Pearl', comment: 'All clear.', updatedAt: new Date().toISOString() },
      { id: 'appr-5', department: 'Finance', status: ClearanceStatus.Approved, approverName: 'Mrs. Davis', comment: 'No outstanding payments.', updatedAt: new Date().toISOString() },
      { id: 'appr-6', department: 'Security', status: ClearanceStatus.Approved, approverName: 'Officer Mike', comment: 'ID card returned.', updatedAt: new Date().toISOString() },
    ],
  },
  {
    id: 'student-3',
    studentId: 'ALA2025-003',
    email: 'bchan25@alastudents.org',
    name: 'Bob Chan',
    role: Role.Student,
    hall: 'Soyinka Hall',
    room: '303C',
    hallHeadName: 'Mr. Kevin',
    books: [],
    fines: [],
    subjectClearances: Array(6).fill(null).map((_, i) => ({
        id: `sc-${13+i}`,
        subjectName: subjectTeachers[i].subject,
        teacherId: subjectTeachers[i].id,
        teacherName: subjectTeachers[i].name,
        status: ClearanceStatus.Pending,
        comment: '',
        updatedAt: new Date().toISOString()
    })),
    approvals: [
      { id: 'appr-7', department: 'HallHead', status: ClearanceStatus.Pending, approverName: 'Mr. Kevin', comment: '', updatedAt: new Date().toISOString() },
      { id: 'appr-8', department: 'Finance', status: ClearanceStatus.Pending, approverName: 'Mrs. Davis', comment: '', updatedAt: new Date().toISOString() },
      { id: 'appr-9', department: 'Security', status: ClearanceStatus.Pending, approverName: 'Officer Mike', comment: '', updatedAt: new Date().toISOString() },
    ],
  }
];

const staff: Staff[] = [
  { id: 'staff-1', email: 'jones@ala.org', name: 'Mr. Jones', role: Role.HallHead },
  { id: 'staff-2', email: 'davis@ala.org', name: 'Mrs. Davis', role: Role.Finance },
  { id: 'staff-3', email: 'mike@ala.org', name: 'Officer Mike', role: Role.Security },
  { id: 'staff-4', email: 'admin@ala.org', name: 'Admin User', role: Role.Admin },
  ...subjectTeachers,
];


const users: (Student | Staff)[] = [...students, ...staff];

export const mockApiService = {
  authenticate: async (email: string, password: string, role: Role): Promise<User | null> => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (password !== 'password123') {
          resolve(null);
          return;
        } 
        const user = users.find(u => (u.email === email || u.id === email || (u.role === Role.Student && (u as Student).studentId === email)) && u.role === role);
        resolve(user || null);
      }, 500);
    });
  },

  getStudentById: async (id: string): Promise<Student | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const student = students.find(s => s.id === id);
            resolve(student ? JSON.parse(JSON.stringify(student)) : null);
        }, 200);
    });
  },

  getAllStudents: async (): Promise<Student[]> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(JSON.parse(JSON.stringify(students))), 200);
    });
  },

  updateStudentData: async (updatedStudent: Student): Promise<Student> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = students.findIndex(s => s.id === updatedStudent.id);
            if(index !== -1) {
                students[index] = updatedStudent;
                resolve(JSON.parse(JSON.stringify(updatedStudent)));
            } else {
                reject(new Error("Student not found"));
            }
        }, 300);
    });
  }
};