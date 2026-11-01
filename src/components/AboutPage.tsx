import React from 'react';

interface AboutPageProps {
  onStart: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStart }) => {
  return (
    <div className="card-labelit p-4 p-md-5 my-2">
      
      <div className="text-start mb-4">
        <img
          src="/images/labelit_logo.svg"
          alt="LABELIT Logo"
          className="header-logo-img img-fluid"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/labelit_logo.png';
          }}
        />
      </div>

      
      <div className="row align-items-center g-4 g-lg-5">
        
        <div className="col-12 col-lg-7">
          <h2>Custom Tapered Label Generator</h2>
          <p className="about-text mb-3">
            When you need to create a label for a tapered surface—like a cone with its tip cut off—a standard rectangular label won't fit. It will wrinkle and won't apply straight.
          </p>
          <p className="about-text mb-3">
            Because the top and bottom are different sizes, you need a custom shape with top and bottom arches of different lengths. Labelit is a free online tool that does just that. It generates a precise cut line for labels applied to cone-like surfaces, whether it's an entire container like a bucket or just a specific section.
          </p>
          <p className="about-text mb-0">
            It’s simple to use: just enter your measurements and instantly download a PDF template with your custom-shaped label, ready to cut.
          </p>
        </div>

        
        <div className="col-12 col-lg-5 text-center">
          <img
            src="/images/shapeOfApp.gif"
            alt="Application surfaces for tapered containers"
            className="about-app-img img-fluid"
            onError={(e) => {
              console.warn('Could not load /images/shapeOfApp.gif');
            }}
          />
        </div>
      </div>

      
      <div className="text-center mt-5 pt-3">
        <button
          type="button"
          className="btn btn-emerald btn-lets-start"
          onClick={onStart}
        >
          Let's Start
        </button>
      </div>
    </div>
  );
};
