import axios from 'axios';
import { Student } from '../types';


const API_BASE = 'https://backendclearance.vercel.app'; // replace with your real backend URL

export const apiService = {
  getStudentById: async (id: string): Promise<Student> => {
    const res = await axios.get(`${API_BASE}/api/students/${id}`);
    return res.data;
  },

  getAllStudents: async (): Promise<Student[]> => {
    const res = await axios.get(`${API_BASE}/api/students`);
    return res.data;
  },

  updateStudentData: async (student: Student): Promise<Student> => {
    const res = await axios.put(`${API_BASE}/api/students/${student.id}`, student);
    return res.data;
  },
};


// // apiService.ts
// import { Student } from '../types';

// const API_BASE = 'https://your-backend.com/api';

// export const apiService = {
//   getAllStudents: async (): Promise<Student[]> => {
//     const res = await fetch(`${API_BASE}/students`);
//     if (!res.ok) throw new Error('Failed to fetch students');
//     return res.json();
//   },

//   getStudentById: async (id: string): Promise<Student> => {
//     const res = await fetch(`${API_BASE}/students/${id}`);
//     if (!res.ok) throw new Error('Failed to fetch student');
//     return res.json();
//   },

//   updateStudentData: async (student: Student): Promise<Student> => {
//     const res = await fetch(`${API_BASE}/students/${student.id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(student),
//     });
//     if (!res.ok) throw new Error('Failed to update student');
//     return res.json();
//   }
// };
