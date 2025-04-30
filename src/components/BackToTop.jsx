import { useState, useEffect } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      onClick={scrollToTop}
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      aria-label="Back to top"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && scrollToTop()}
    >
      ↑
    </div>
  );
};

export default BackToTop;