import type { Metadata } from 'next';
import { ReactNode } from 'react';

import '../styles/global.css';
import '../components/Header.css';
import '../components/Footer.css';
import '../styles/pages/Home.css';
import '../styles/pages/Products.css';
import '../styles/pages/Services.css';
import '../styles/pages/Contact.css';
import '../styles/pages/AutoGrade.css';
import '../styles/pages/AutoGradingWizard.css';
import '../styles/pages/Tools.css';
import '../styles/pages/Signup.css';
import '../styles/pages/SuccessStories.css';
import '../styles/pages/WhyEdGenAI.css';
import '../styles/pages/AdminPanel.css';
import '../styles/pages/login.css';

import ActivityReporter from '../components/ActivityReporter';
import Footer from '../components/Footer';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'EdGenAI',
  description:
    'EdGenAI delivers AI-powered grading, planning, and consultancy tools that help educators transform learning experiences.',
  icons: {
    icon: '/logoicon.png',
    shortcut: '/logoicon.png',
    apple: '/logoicon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ActivityReporter />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
