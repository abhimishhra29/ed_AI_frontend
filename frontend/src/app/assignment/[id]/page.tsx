'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { apiFetch } from '../../../lib/api';
import '../../../styles/pages/Dashboard.css';

// ============================================
// STUDENT INTERFACE
// ============================================

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  reviewConfidence: number;
}

// ============================================
// ASSIGNMENT PAGE COMPONENT
// ============================================

export default function AssignmentPage(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.id ? parseInt(params.id as string, 10) : null;

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  // Students data with student IDs and separate first/last names
  const students: Student[] = [
    { id: 'STU-2024-001', firstName: 'Sarah', lastName: 'Johnson', reviewConfidence: 95 },
    { id: 'STU-2024-002', firstName: 'Michael', lastName: 'Chen', reviewConfidence: 87 },
    { id: 'STU-2024-003', firstName: 'Emily', lastName: 'Rodriguez', reviewConfidence: 92 },
    { id: 'STU-2024-004', firstName: 'David', lastName: 'Kim', reviewConfidence: 88 },
    { id: 'STU-2024-005', firstName: 'Jessica', lastName: 'Williams', reviewConfidence: 96 },
    { id: 'STU-2024-006', firstName: 'James', lastName: 'Anderson', reviewConfidence: 82 },
    { id: 'STU-2024-007', firstName: 'Olivia', lastName: 'Martinez', reviewConfidence: 90 },
    { id: 'STU-2024-008', firstName: 'Daniel', lastName: 'Brown', reviewConfidence: 94 },
    { id: 'STU-2024-009', firstName: 'Sophia', lastName: 'Davis', reviewConfidence: 85 },
    { id: 'STU-2024-010', firstName: 'Alexander', lastName: 'Taylor', reviewConfidence: 91 },
  ];

  // Check login status
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkLogin = () => {
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
      setLoggedIn(isLoggedIn);
      setIsChecking(false);
      return isLoggedIn;
    };

    checkLogin();

    const onStorage = () => checkLogin();
    window.addEventListener('storage', onStorage);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('auth');
      bc.onmessage = (e) => {
        if (e?.data?.type === 'logout') {
          setLoggedIn(false);
          setIsChecking(false);
        }
        if (e?.data?.type === 'login' || e?.data?.type === 'access-updated') {
          setLoggedIn(true);
          setIsChecking(false);
        }
      };
    } catch {
      // ignore
    }

    (async () => {
      try {
        if (localStorage.getItem('refreshToken')) {
          const res = await apiFetch('/api/activity/', { method: 'POST' });
          if (res.ok) {
            setLoggedIn(true);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsChecking(false);
      }
    })();

    return () => {
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, []);

  const handleViewStudent = (studentId: string) => {
    if (assignmentId) {
      router.push(`/assignment/${assignmentId}/student/${studentId}`);
    }
  };

  // Show nothing while checking
  if (isChecking) {
    return <div style={{ display: 'none' }}></div>;
  }

  // Redirect to home if not logged in
  if (!loggedIn) {
    router.push('/');
    return <div style={{ display: 'none' }}></div>;
  }

  return (
    <motion.div
      className="assignment-page-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="assignment-page-header">
        <button
          onClick={() => router.push('/')}
          className="assignment-back-button"
          aria-label="Back"
        >
          <ArrowLeft size={18} strokeWidth={2} />
          <span>Back</span>
        </button>
        {assignmentId && (
          <h1 className="assignment-page-title">
            Assignment {assignmentId}
          </h1>
        )}
      </div>

      {/* Students Table */}
      <div className="assignment-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>REVIEW CONFIDENCE</th>
              <th>VIEW</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <motion.tr
                key={student.id}
                className={`students-table-row ${selectedRow === student.id ? 'students-table-row--selected' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                onMouseEnter={() => setSelectedRow(student.id)}
                onMouseLeave={() => setSelectedRow(null)}
              >
                <td className="student-id">{student.id}</td>
                <td className="student-first-name">{student.firstName}</td>
                <td className="student-last-name">{student.lastName}</td>
                <td className="student-review-confidence">{student.reviewConfidence}%</td>
                <td className="student-view-cell">
                  <button
                    className="student-view-button"
                    onClick={() => handleViewStudent(student.id)}
                  >
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
