import React from 'react';

interface ServiceCardProps {
  id: string;
  title: string;
  icon: string;
  pinColor: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  icon,
  pinColor,
  isActive,
  onClick
}) => {
  return (
    <div 
      className={`dj-card ${isActive ? 'dj-card--active' : ''}`}
      onClick={() => onClick(id)}
    >
      <img src="/assets/images/sti-1.png" alt="Paper" className="dj-card__bg" />
      <div className="dj-card__pin" style={{ backgroundColor: pinColor }}></div>
      <div className="dj-card__content">
        <div className="dj-card__icon">{icon}</div>
        <h4 className="dj-card__title" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
    </div>
  );
};
