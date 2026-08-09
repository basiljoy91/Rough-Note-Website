import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
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
  const Icon = icon;

  return (
    <button
      type="button"
      className={`dj-card ${isActive ? 'dj-card--active' : ''}`}
      onClick={() => onClick(id)}
      aria-pressed={isActive}
      aria-label={`Show the ${title.replace('<br/>', ' ')} journey`}
      style={{ '--card-accent': pinColor } as CSSProperties}
    >
      <img src="/assets/images/sti-1.png" alt="Paper" className="dj-card__bg" />
      <span className="dj-card__tape" aria-hidden="true" />
      <span className="dj-card__pin" style={{ backgroundColor: pinColor }} aria-hidden="true" />
      <div className="dj-card__content">
        <Icon className="dj-card__icon" aria-hidden="true" />
        <h4 className="dj-card__title" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
    </button>
  );
};
