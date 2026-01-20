'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FileText, ChevronRight, ChevronLeft, Sparkles, ArrowLeft } from 'lucide-react';

import { apiFetch } from '../../../lib/api';
import { Layers } from '@/components/animate-ui/icons/layers';
import PillButton from '../../../components/PillButton';

// ============================================
// ASSIGNMENT ITEM COMPONENT
// ============================================

interface Assignment {
  id: string;
  name: string;
  totalMarks: number;
  num: number;
}

interface AssignmentItemProps {
  assignment: Assignment;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const AssignmentItem: React.FC<AssignmentItemProps> = ({ assignment, index, isSelected, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });

  const handleClick = () => {
    onSelect();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 12, filter: 'blur(4px)' }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <div
        ref={ref}
        className={`assignment-item ${isSelected ? 'assignment-item--selected' : ''}`}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="assignment-icon-wrapper">
          <FileText className="assignment-icon" size={18} strokeWidth={1.5} />
        </div>
        <div className="assignment-content">
          <span className="assignment-label">{assignment.name}</span>
          <div className="assignment-meta">
            <span className="assignment-id">ID: {assignment.id}</span>
            <span className="assignment-marks">{assignment.totalMarks} marks</span>
          </div>
        </div>
        <ChevronRight className="assignment-arrow" size={16} strokeWidth={2} />
      </div>
    </motion.div>
  );
};

// ============================================
// ASSIGNMENT PAGE COMPONENT
// ============================================

export default function AssignmentPage(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.id ? parseInt(params.id as string, 10) : null;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter students for the current assignment
  // All students belong to the same assignment (assignmentId from URL)
  const assignments: Assignment[] = [
    { id: 'STU-001', name: 'Sarah Johnson', totalMarks: 100, num: assignmentId || 1 },
    { id: 'STU-002', name: 'Michael Chen', totalMarks: 85, num: assignmentId || 1 },
    { id: 'STU-003', name: 'Emily Rodriguez', totalMarks: 90, num: assignmentId || 1 },
    { id: 'STU-004', name: 'David Kim', totalMarks: 95, num: assignmentId || 1 },
    { id: 'STU-005', name: 'Jessica Williams', totalMarks: 100, num: assignmentId || 1 },
    { id: 'STU-006', name: 'James Anderson', totalMarks: 80, num: assignmentId || 1 },
    { id: 'STU-007', name: 'Olivia Martinez', totalMarks: 88, num: assignmentId || 1 },
    { id: 'STU-008', name: 'Daniel Brown', totalMarks: 92, num: assignmentId || 1 },
    { id: 'STU-009', name: 'Sophia Davis', totalMarks: 87, num: assignmentId || 1 },
    { id: 'STU-010', name: 'Alexander Taylor', totalMarks: 93, num: assignmentId || 1 },
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

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

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
      className={`dashboard-layout ${sidebarCollapsed ? 'dashboard-layout--collapsed' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Collapsible Sidebar */}
      <motion.div
        className="dashboard-left"
        animate={{
          width: sidebarCollapsed ? '60px' : '280px',
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="assignments-header">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                className="assignments-header-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <h2>Assignments</h2>
                <span className="assignment-count-badge">{assignments.length}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <motion.div
              animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </motion.div>
          </button>
        </div>

        <div className="assignments-list-container">
          <div
            ref={listRef}
            className="assignments-list"
            onScroll={handleScroll}
          >
            <AnimatePresence>
              {!sidebarCollapsed ? (
                assignments.map((assignment, index) => (
                  <AssignmentItem
                    key={assignment.id}
                    assignment={assignment}
                    index={index}
                    isSelected={selectedStudent === assignment.id}
                    onSelect={() => setSelectedStudent(assignment.id)}
                  />
                ))
              ) : (
                assignments.map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.03 }}
                    className="assignment-mini"
                    onClick={() => {
                      setSelectedStudent(assignment.id);
                    }}
                  >
                    <div className={`assignment-mini-dot ${selectedStudent === assignment.id ? 'assignment-mini-dot--active' : ''}`}>
                      {index + 1}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Scroll gradients */}
          {!sidebarCollapsed && (
            <>
              <div
                className="scroll-gradient scroll-gradient--top"
                style={{ opacity: topGradientOpacity }}
              />
              <div
                className="scroll-gradient scroll-gradient--bottom"
                style={{ opacity: bottomGradientOpacity }}
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Divider with gradient */}
      <div className="dashboard-divider" />

      {/* Workspace Area */}
      <div className="dashboard-right">
        <div className="workspace-back-header">
          <button
            onClick={() => router.push('/')}
            className="workspace-back-button"
            aria-label="Back"
          >
            <ArrowLeft size={18} strokeWidth={2} />
            <span>Back</span>
          </button>
          {assignmentId && (
            <h1 className="workspace-assignment-heading">
              Assignment {assignmentId}
            </h1>
          )}
        </div>
        <div className="workspace-content">
        </div>
      </div>
    </motion.div>
  );
}
