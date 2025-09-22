import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockApiService } from '../services/mockData';
import { Role, ClearanceStatus, type Student, type Book, type Fine, type Approval, type SubjectClearance } from '../types';
import { apiService } from "../services/apiService";

// Declare jsPDF and QRCode to satisfy TypeScript since they are loaded from CDN
declare const jspdf: any;
declare const QRCode: any;

// --- SHARED ICONS ---
const icons = {
  logout: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  bell: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  user: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  book: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  finance: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01v.01M12 18v-2m0-2v-2m0-2v-2m0-2V9m0-2V7m0-2V4m7 11c0 2.209-1.791 4-4 4H8c-2.209 0-4-1.791-4-4V9c0-2.209 1.791-4 4-4h5l4 4v6z" /></svg>,
  approval: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  academic: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v6" /></svg>,
  camera: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  upload: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  qr: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 21h8v-8h-8v8zm2-6h4v4h-4v-4z"/></svg>,
};


// --- SHARED COMPONENTS ---

const Header: React.FC<{ name: string }> = ({ name }) => {
    const { logout } = useAuth();
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-indigo-600">Digital Clearance System</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">{icons.bell}</span>
                        <div className="flex items-center space-x-2">
                             <span className="text-gray-500">{icons.user}</span>
                             <span className="text-sm font-medium text-gray-700">{name}</span>
                        </div>
                        <button onClick={logout} className="text-gray-500 hover:text-red-600" title="Logout">
                            {icons.logout}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const ProgressBar: React.FC<{ value: number, text: string }> = ({ value, text }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-indigo-700">{text}</span>
            <span className="text-sm font-medium text-indigo-700">{value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: ClearanceStatus }> = ({ status }) => {
    const colors = {
        [ClearanceStatus.Approved]: 'bg-green-100 text-green-800',
        [ClearanceStatus.Pending]: 'bg-yellow-100 text-yellow-800',
        [ClearanceStatus.Flagged]: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>{status}</span>;
};

const Card: React.FC<{ children: React.ReactNode, title?: string, className?: string }> = ({ children, title, className = '' }) => (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
        {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
        {children}
    </div>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};


// --- STUDENT DASHBOARD COMPONENTS ---

const CameraCaptureModal: React.FC<{ book: Book; onClose: () => void; onCapture: (bookId: string, dataUrl: string) => void; }> = ({ book, onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        let isMounted = true;
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (isMounted && videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setStream(stream);
                }
            })
            .catch(err => console.error("Error accessing camera:", err));
        
        return () => {
            isMounted = false;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context?.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
            const dataUrl = canvasRef.current.toDataURL('image/png');
            onCapture(book.id, dataUrl);
            onClose();
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Return Book: ${book.title}`}>
            <div className="flex flex-col items-center">
                <video ref={videoRef} autoPlay playsInline className="w-full rounded-md shadow-lg mb-4"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                <button onClick={handleCapture} className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center">
                    {icons.camera} Capture & Return
                </button>
            </div>
        </Modal>
    );
};


const StudentBooksSection: React.FC<{ student: Student; onUpdate: (student: Student) => void }> = ({ student, onUpdate }) => {
    const [capturingBook, setCapturingBook] = useState<Book | null>(null);
    const progress = Math.round((student.books.filter(b => b.returned).length / (student.books.length || 1)) * 100);

    const handleCapture = (bookId: string, imageUrl: string) => {
        const updatedStudent = { ...student };
        const book = updatedStudent.books.find(b => b.id === bookId);
        if (book) {
            book.returned = true;
            book.imageUrl = imageUrl;
        }
        onUpdate(updatedStudent);
    };

    return (
        <Card title="Books Clearance">
            <ProgressBar value={progress} text="Books Returned" />
            <div className="mt-4 flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {student.books.length > 0 ? student.books.map(book => (
                        <li key={book.id} className="py-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    {book.returned && book.imageUrl ? 
                                     <img className="h-10 w-10 rounded-full" src={book.imageUrl} alt="Captured book" /> :
                                     <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">{icons.book}</div>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                                    <p className="text-sm text-gray-500 truncate">{book.bookCode}</p>
                                </div>
                                <div>
                                    {book.returned ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Returned</span>
                                    ) : (
                                        <button onClick={() => setCapturingBook(book)} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200">Return</button>
                                    )}
                                </div>
                            </div>
                        </li>
                    )) : <p className="text-sm text-gray-500">No books to return.</p>}
                </ul>
            </div>
            {capturingBook && <CameraCaptureModal book={capturingBook} onClose={() => setCapturingBook(null)} onCapture={handleCapture} />}
        </Card>
    );
};


const StudentFinanceSection: React.FC<{ student: Student; onUpdate: (student: Student) => void }> = ({ student, onUpdate }) => {
    const progress = Math.round((student.fines.filter(f => f.paid).length / (student.fines.length || 1)) * 100);

    const handleReceiptUpload = (fineId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedStudent = { ...student };
                const fine = updatedStudent.fines.find(f => f.id === fineId);
                if (fine) {
                    fine.receiptUrl = reader.result as string;
                }
                onUpdate(updatedStudent);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card title="Finance Clearance">
            <ProgressBar value={progress} text="Fines Paid" />
            <div className="mt-4 flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {student.fines.map(fine => (
                        <li key={fine.id} className="py-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{fine.reason}</p>
                                    <p className="text-sm text-gray-500 truncate">${fine.amount.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {fine.paid ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>
                                    ) : (
                                        <>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
                                            <label className="cursor-pointer inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                                                {icons.upload} Upload Receipt
                                                <input type="file" className="hidden" onChange={(e) => handleReceiptUpload(fine.id, e)} accept="image/*,.pdf" />
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                    {student.fines.length === 0 && <p className="text-sm text-gray-500">No outstanding fines.</p>}
                </ul>
            </div>
        </Card>
    );
};

const StudentSubjectsSection: React.FC<{ student: Student }> = ({ student }) => {
    const progress = Math.round((student.subjectClearances.filter(s => s.status === ClearanceStatus.Approved).length / (student.subjectClearances.length || 1)) * 100);

    return (
        <Card title="Academic Clearance">
            <ProgressBar value={progress} text="Subjects Cleared" />
            <div className="mt-4 flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {student.subjectClearances.map(sc => (
                        <li key={sc.id} className="py-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{sc.subjectName}</p>
                                    <p className="text-sm text-gray-500 truncate">
                                      Teacher: {sc.teacherName} - <span className="italic">{sc.comment || 'No comments.'}</span>
                                    </p>
                                </div>
                                <StatusBadge status={sc.status} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
};

const StudentApprovalsSection: React.FC<{ student: Student }> = ({ student }) => {
    const progress = Math.round((student.approvals.filter(a => a.status === ClearanceStatus.Approved).length / student.approvals.length) * 100);

    return (
        <Card title="Final Department Approvals">
            <ProgressBar value={progress} text="Approvals Received" />
            <div className="mt-4 flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {student.approvals.map(approval => (
                        <li key={approval.id} className="py-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{approval.department} Office</p>
                                    <p className="text-sm text-gray-500 truncate">{approval.comment || 'No comments yet.'}</p>
                                </div>
                                <StatusBadge status={approval.status} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
};

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [studentData, setStudentData] = useState<Student | null>(null);
    const [activeTab, setActiveTab] = useState('books');
    const [isCleared, setIsCleared] = useState(false);
    const [showClearedModal, setShowClearedModal] = useState(false);

    // const fetchData = useCallback(async () => {
    //     if (user) {
    //         const data = await apiService.getStudentById(user.id);
    //         setStudentData(data);
    //     }
    // }, [user]);

    // useEffect(() => {
    //     fetchData();
    // }, [fetchData]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await apiService.getStudentById(user.id);
                setStudentData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);


    useEffect(() => {
        if (studentData) {
            const allBooksReturned = studentData.books.every(b => b.returned);
            const allFinesPaid = studentData.fines.every(f => f.paid);
            const allSubjectsCleared = studentData.subjectClearances.every(s => s.status === ClearanceStatus.Approved);
            const allApproved = studentData.approvals.every(a => a.status === ClearanceStatus.Approved);
            
            const currentlyCleared = allBooksReturned && allFinesPaid && allSubjectsCleared && allApproved;
            
            if (currentlyCleared && !isCleared) {
              setShowClearedModal(true);
            }
            setIsCleared(currentlyCleared);
        }
    }, [studentData, isCleared]);

    const handleUpdateStudent = async (updatedStudent: Student) => {
        const savedData = await apiService.updateStudentData(updatedStudent);
        setStudentData(savedData);
    };

    const handleDownloadPDF = () => {
        if (!studentData) return;
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.text("Student Clearance Form", 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Name: ${studentData.name}`, 20, 40);
        doc.text(`Student ID: ${studentData.studentId}`, 20, 50);
        doc.text(`Hall/Room: ${studentData.hall} / ${studentData.room}`, 20, 60);
        doc.text(`Status: CLEARED`, 20, 70);

        const qrData = JSON.stringify({
            name: studentData.name,
            studentId: studentData.studentId,
            status: "Cleared"
        });

        QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, function (err: Error, url: string) {
            if (err) throw err;
            doc.addImage(url, 'PNG', 75, 90, 60, 60);
            doc.save(`clearance-${studentData.studentId}.pdf`);
        });
    };

    if (!studentData) {
        return <div className="flex justify-center items-center h-screen">Loading student data...</div>;
    }

    const totalItems = studentData.books.length + studentData.fines.length + studentData.subjectClearances.length + studentData.approvals.length;
    const clearedItems = studentData.books.filter(b => b.returned).length + 
                       studentData.fines.filter(f => f.paid).length +
                       studentData.subjectClearances.filter(s => s.status === ClearanceStatus.Approved).length +
                       studentData.approvals.filter(a => a.status === ClearanceStatus.Approved).length;
    const overallProgress = totalItems > 0 ? Math.round((clearedItems / totalItems) * 100) : 100;

    return (
        <div className="min-h-screen bg-gray-100">
            <Header name={studentData.name} />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Card className="mb-6">
                    <div className="md:flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">{studentData.name} ({studentData.studentId})</h2>
                            <p className="text-gray-600">{studentData.hall} / {studentData.room} | Hall Head: {studentData.hallHeadName}</p>
                        </div>
                        <div className="mt-4 md:mt-0 md:w-1/2">
                            <ProgressBar value={overallProgress} text="Overall Clearance Progress" />
                        </div>
                    </div>
                </Card>

                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('books')} className={`${activeTab === 'books' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>{icons.book}<span className="ml-2">Books</span></button>
                        <button onClick={() => setActiveTab('academic')} className={`${activeTab === 'academic' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>{icons.academic}<span className="ml-2">Academic</span></button>
                        <button onClick={() => setActiveTab('finance')} className={`${activeTab === 'finance' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>{icons.finance}<span className="ml-2">Finance</span></button>
                        <button onClick={() => setActiveTab('approvals')} className={`${activeTab === 'approvals' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>{icons.approval}<span className="ml-2">Approvals</span></button>
                    </nav>
                </div>
                
                {activeTab === 'books' && <StudentBooksSection student={studentData} onUpdate={handleUpdateStudent} />}
                {activeTab === 'academic' && <StudentSubjectsSection student={studentData} />}
                {activeTab === 'finance' && <StudentFinanceSection student={studentData} onUpdate={handleUpdateStudent} />}
                {activeTab === 'approvals' && <StudentApprovalsSection student={studentData} />}

                <Modal isOpen={showClearedModal} onClose={() => setShowClearedModal(false)} title="Congratulations!">
                    <div className="text-center">
                        <p className="text-lg text-gray-700 mb-4">You have been successfully cleared!</p>
                        <p className="text-sm text-gray-500 mb-6">You can now download your final clearance form.</p>
                        <button onClick={handleDownloadPDF} className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700">Download PDF with QR</button>
                    </div>
                </Modal>
            </main>
        </div>
    );
};


// --- STAFF DASHBOARDS ---
const StaffStudentDetailModal: React.FC<{ student: Student; onUpdate: (student: Student) => void; onClose: () => void; userRole: Role }> = ({ student, onUpdate, onClose, userRole }) => {
    const [comment, setComment] = useState("");
    
    const handleAction = (status: ClearanceStatus) => {
        const updatedStudent = { ...student };
        let approval: Approval | undefined;
        if(userRole === Role.HallHead) approval = updatedStudent.approvals.find(a => a.department === 'HallHead');
        if(userRole === Role.Finance) approval = updatedStudent.approvals.find(a => a.department === 'Finance');
        if(userRole === Role.Security) approval = updatedStudent.approvals.find(a => a.department === 'Security');

        if (approval) {
            approval.status = status;
            approval.comment = comment;
            approval.updatedAt = new Date().toISOString();
        }
        onUpdate(updatedStudent);
        onClose();
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title={`Clearance for ${student.name}`}>
            <div>
                <p><strong>ID:</strong> {student.studentId}</p>
                <p><strong>Hall:</strong> {student.hall}, Room {student.room}</p>
                <h4 className="font-bold mt-4">Checklist:</h4>
                <ul className="list-disc list-inside">
                    <li>Books Returned: {student.books.every(b => b.returned) ? 'Yes' : 'No'}</li>
                    <li>Fines Paid: {student.fines.every(f => f.paid) ? 'Yes' : 'No'}</li>
                    <li>Subjects Cleared: {student.subjectClearances.every(s => s.status === ClearanceStatus.Approved) ? 'Yes' : 'No'}</li>
                </ul>
                <div className="mt-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comments</label>
                    <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2" placeholder="e.g., Room not clean"></textarea>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={() => handleAction(ClearanceStatus.Flagged)} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Flag</button>
                    <button onClick={() => handleAction(ClearanceStatus.Approved)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Approve</button>
                </div>
            </div>
        </Modal>
    );
};

const BaseStaffDashboard: React.FC<{ userRole: Role, pageTitle: string, approvalDepartment: 'HallHead' | 'Finance' | 'Security' | 'Admin' }> = ({ userRole, pageTitle, approvalDepartment }) => {
    const { user } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<ClearanceStatus | 'All'>('All');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const fetchData = useCallback(async () => {
        const data = await apiService.getAllStudents();
        setStudents(data);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdate = async (updatedStudent: Student) => {
        const saved = await apiService.updateStudentData(updatedStudent);
        setStudents(prev => prev.map(s => s.id === saved.id ? saved : s));
    };

    const filteredStudents = students
        .filter(s => {
            if (filter === 'All') return true;
            if(approvalDepartment === 'Admin') return true;
            const approval = s.approvals.find(a => a.department === approvalDepartment);
            return approval?.status === filter;
        })
        .filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.hall.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-gray-100">
            <Header name={user?.name || 'Staff'} />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Card title={`${pageTitle} Dashboard`}>
                    <div className="md:flex justify-between items-center mb-4">
                        <div className="relative text-gray-600">
                            <input
                                className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                                type="search"
                                name="search"
                                placeholder="Search Name, ID, Dorm..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            {(['All', ...Object.values(ClearanceStatus)]).map(f => (
                                <button key={f} onClick={() => setFilter(f as ClearanceStatus | 'All')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{f}</button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hall/Room</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Details</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                            <div className="text-sm text-gray-500">{student.studentId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={approvalDepartment !== 'Admin' ? student.approvals.find(a => a.department === approvalDepartment)?.status || ClearanceStatus.Pending : (student.approvals.every(a => a.status === 'Approved') ? ClearanceStatus.Approved : student.approvals.some(a=> a.status === 'Flagged') ? ClearanceStatus.Flagged : ClearanceStatus.Pending) } />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.hall} / {student.room}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => setSelectedStudent(student)} className="text-indigo-600 hover:text-indigo-900">View/Action</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
            {selectedStudent && (
              <StaffStudentDetailModal 
                student={selectedStudent} 
                onClose={() => setSelectedStudent(null)} 
                onUpdate={handleUpdate}
                userRole={userRole}
              />
            )}
        </div>
    );
};


export const HallHeadDashboard: React.FC = () => <BaseStaffDashboard userRole={Role.HallHead} pageTitle="Hall Head" approvalDepartment="HallHead" />;
export const FinanceDashboard: React.FC = () => <BaseStaffDashboard userRole={Role.Finance} pageTitle="Finance" approvalDepartment="Finance" />;


// --- SUBJECT TEACHER DASHBOARD ---
const TeacherActionModal: React.FC<{ student: Student; subjectClearance: SubjectClearance; onUpdate: (student: Student) => void; onClose: () => void; }> = ({ student, subjectClearance, onUpdate, onClose }) => {
    const [comment, setComment] = useState(subjectClearance.comment || "");

    const handleAction = (status: ClearanceStatus) => {
        const updatedStudent = { ...student };
        const scToUpdate = updatedStudent.subjectClearances.find(sc => sc.id === subjectClearance.id);
        if (scToUpdate) {
            scToUpdate.status = status;
            scToUpdate.comment = comment;
            scToUpdate.updatedAt = new Date().toISOString();
        }
        onUpdate(updatedStudent);
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Clearance for ${student.name}`}>
            <div>
                <p><strong>ID:</strong> {student.studentId}</p>
                <p><strong>Subject:</strong> {subjectClearance.subjectName}</p>
                <div className="mt-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comments</label>
                    <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2" placeholder="e.g., Missing final assignment"></textarea>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={() => handleAction(ClearanceStatus.Flagged)} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Flag</button>
                    <button onClick={() => handleAction(ClearanceStatus.Approved)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Approve</button>
                </div>
            </div>
        </Modal>
    );
};

export const SubjectTeacherDashboard: React.FC = () => {
    const { user } = useAuth();
    const [myStudents, setMyStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<ClearanceStatus | 'All'>('All');
    const [selectedStudentInfo, setSelectedStudentInfo] = useState<{ student: Student; sc: SubjectClearance } | null>(null);

    const fetchData = useCallback(async () => {
        if (!user) return;
        const allStudents = await apiService.getAllStudents();
        const filtered = allStudents.filter(s => s.subjectClearances.some(sc => sc.teacherId === user.id));
        setMyStudents(filtered);
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdate = async (updatedStudent: Student) => {
        const saved = await apiService.updateStudentData(updatedStudent);
        setMyStudents(prev => prev.map(s => s.id === saved.id ? saved : s));
    };
    
    if (!user) return null;

    const filteredStudents = myStudents
        .filter(s => {
            if (filter === 'All') return true;
            const sc = s.subjectClearances.find(sc => sc.teacherId === user.id);
            return sc?.status === filter;
        })
        .filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-gray-100">
            <Header name={user.name} />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Card title="Subject Teacher Dashboard">
                    <div className="md:flex justify-between items-center mb-4">
                        <input
                            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                            type="search"
                            placeholder="Search by Name or ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            {(['All', ...Object.values(ClearanceStatus)]).map(f => (
                                <button key={f} onClick={() => setFilter(f as ClearanceStatus | 'All')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{f}</button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.map(student => {
                                    const sc = student.subjectClearances.find(sc => sc.teacherId === user.id);
                                    if (!sc) return null;
                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                <div className="text-sm text-gray-500">{student.studentId}</div>
                                            </td>
                                            <td className="px-6 py-4"><StatusBadge status={sc.status} /></td>
                                            <td className="px-6 py-4 text-sm text-gray-500 truncate" style={{maxWidth: '200px'}}>{sc.comment || '-'}</td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <button onClick={() => setSelectedStudentInfo({ student, sc })} className="text-indigo-600 hover:text-indigo-900">View/Action</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
            {selectedStudentInfo && (
              <TeacherActionModal 
                student={selectedStudentInfo.student} 
                subjectClearance={selectedStudentInfo.sc}
                onClose={() => setSelectedStudentInfo(null)} 
                onUpdate={handleUpdate}
              />
            )}
        </div>
    );
};


// --- SECURITY DASHBOARD ---
export const SecurityDashboard: React.FC = () => {
    const { user } = useAuth();
    const [searchId, setSearchId] = useState('');
    const [foundStudent, setFoundStudent] = useState<Student | null | undefined>(undefined);
    const [isScanning, setIsScanning] = useState(false);

    const handleSearch = async () => {
        setFoundStudent(undefined);
        const allStudents = await apiService.getAllStudents();
        const student = allStudents.find(s => s.studentId === searchId);
        setFoundStudent(student || null);
    };

    const handleScan = () => {
        setIsScanning(true);
        // Mocking QR scan
        setTimeout(() => {
            const studentId = "ALA2025-002"; // Pre-cleared student
            setSearchId(studentId);
            setIsScanning(false);
            apiService.getAllStudents().then(allStudents => {
                const student = allStudents.find(s => s.studentId === studentId);
                setFoundStudent(student || null);
            });
        }, 2000);
    };

    const isCleared = foundStudent && 
                      foundStudent.approvals.every(a => a.status === ClearanceStatus.Approved) &&
                      foundStudent.subjectClearances.every(sc => sc.status === ClearanceStatus.Approved) &&
                      foundStudent.books.every(b => b.returned) &&
                      foundStudent.fines.every(f => f.paid);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header name={user?.name || 'Security'} />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Card title="Security Checkpoint">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Enter Student ID..."
                            value={searchId}
                            onChange={e => setSearchId(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-md"
                        />
                        <button onClick={handleSearch} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Search</button>
                        <button onClick={handleScan} disabled={isScanning} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center disabled:bg-gray-400">
                          {icons.qr} {isScanning ? 'Scanning...' : 'Scan QR'}
                        </button>
                    </div>

                    {foundStudent === undefined && <div className="mt-6 text-center text-gray-500">Enter a student ID to check their clearance status.</div>}
                    {foundStudent === null && <div className="mt-6 text-center text-red-500 font-bold">Student not found.</div>}
                    {foundStudent && (
                        <div className={`mt-6 p-6 rounded-lg ${isCleared ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border-2`}>
                            <h3 className={`text-2xl font-bold ${isCleared ? 'text-green-800' : 'text-red-800'}`}>{isCleared ? 'CLEARED' : 'NOT CLEARED'}</h3>
                            <p className="mt-2 text-lg"><strong>Name:</strong> {foundStudent.name}</p>
                            <p><strong>Student ID:</strong> {foundStudent.studentId}</p>
                            <p><strong>Hall:</strong> {foundStudent.hall}, Room {foundStudent.room}</p>
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
};

// --- ADMIN DASHBOARD ---
export const AdminDashboard: React.FC = () => <BaseStaffDashboard userRole={Role.Admin} pageTitle="System Admin" approvalDepartment="Admin" />;
