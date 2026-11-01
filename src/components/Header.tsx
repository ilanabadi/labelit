import React from 'react';

interface HeaderProps {
  onNavigateAbout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateAbout }) => {
  return (
    <header className="mb-4">
      <div className="card-labelit pt-4 ps-4 pt-md-5 ps-md-5 pe-0 pb-0 overflow-hidden">
        <div className="row align-items-center g-4">
          
          <div className="col-12 col-md-4 col-lg-3 text-start pb-4 pb-md-5">
            <div className="mb-2">
              <a
                href="#about"
                className="about-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateAbout?.();
                }}
              >
                About
              </a>
            </div>
            <img
              src="/images/labelit_logo.svg"
              alt="LABELIT Logo"
              className="header-logo-img img-fluid"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/labelit_logo.png';
              }}
            />
          </div>

          
          <div className="col-12 col-md-4 col-lg-4 text-start pb-4 pb-md-5">
            
            <p className="fs-6 fw-bold text-white mb-2 d-flex align-items-center header-para">
              <span className="green-square-marker me-2"></span>
              Free and Simple to use
            </p>

            
            <p className="fs-6 fw-bold text-white mb-2 d-flex align-items-start header-para">
              <span className="green-square-marker me-2 mt-1"></span>
              <span>generates a cut line for labels applied to cone-like surfaces</span>
            </p>

            
            <p className="fs-6 fw-bold text-white mb-2 d-flex align-items-center header-para">
              <span className="green-square-marker me-2"></span>
              enter measurements
            </p>

            
            <p className="fs-6 fw-bold text-white mb-0 d-flex align-items-center header-para">
              <span className="green-square-marker me-2"></span>
              Get a PDF file
            </p>
          </div>

          
          <div className="col-12 col-md-4 col-lg-5 align-self-end text-center text-md-end p-0">
            <img
              src="/images/logoPictNoBG.png"
              alt="Tapered Container Illustration"
              className="header-right-img img-fluid"
              onError={(e) => {
                console.warn('Could not load logoPictNoBG.png');
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
