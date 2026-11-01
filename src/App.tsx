import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DimensionForm } from './components/DimensionForm';
import { PreviewCard } from './components/PreviewCard';
import { AboutPage } from './components/AboutPage';
import { UnitMode, LabelDimensions } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'calculator' | 'about'>(() => {
    return window.location.hash === '#about' ? 'about' : 'calculator';
  });

  const [unit, setUnit] = useState<UnitMode>('mm');

  const [dimensions, setDimensions] = useState<LabelDimensions>({
    topMode: 'circumference',
    topDimension: 408.4,
    bottomMode: 'circumference',
    bottomDimension: 345.6,
    slantHeight: 75,
    topMargin: 0,
    bottomMargin: 0,
    coverPercentage: 50,
  });

  // Sync with browser hash changes (e.g. Back/Forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash === '#about' ? 'about' : 'calculator');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: 'calculator' | 'about') => {
    setCurrentPage(page);
    window.location.hash = page === 'about' ? 'about' : '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-fluid max-mw-1200 py-3 px-3 px-md-4">
      {currentPage === 'about' ? (
        /* About Page View */
        <AboutPage onStart={() => navigateTo('calculator')} />
      ) : (
        /* Main Calculator View */
        <>
          <Header onNavigateAbout={() => navigateTo('about')} />

          <main className="row g-4">
            {/* Left Column: Dimensions Form */}
            <div className="col-lg-7">
              <DimensionForm
                dimensions={dimensions}
                setDimensions={setDimensions}
                unit={unit}
                setUnit={setUnit}
              />
            </div>

            {/* Right Column: Visualizer & PDF Download Action */}
            <div className="col-lg-5">
              <PreviewCard
                dimensions={dimensions}
                unit={unit}
              />
            </div>
          </main>
        </>
      )}

      {/* Footer */}
      <footer className="text-center py-4 mt-4 border-top border-secondary border-opacity-25 fs-7">
        <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap text-white-50">
          <span>Designed by Ilan Abadi</span>
          <img
            src="/images/iA_logo_green.svg"
            alt="iA Logo"
            style={{ height: '22px', width: 'auto' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/iA_logo_green.png';
            }}
          />
          <span>Creating. Always.</span>
        </div>
      </footer>
    </div>
  );
}
