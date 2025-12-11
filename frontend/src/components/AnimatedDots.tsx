'use client';

import { useEffect, useState } from 'react';

export default function AnimatedDots() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount((current) => (current + 1) % 4);
    }, 450);

    return () => window.clearInterval(id);
  }, []);

  const dots = '.'.repeat(count).padEnd(3, ' ');

  return (
    <span
      aria-hidden="true"
      className="animated-dots"
      style={{ display: 'inline-block', width: '3ch', textAlign: 'left' }}
    >
      {dots}
    </span>
  );
}
