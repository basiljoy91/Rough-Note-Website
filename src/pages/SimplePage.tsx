import { SiteLayout } from '../app/layouts/SiteLayout';
import { RoughNoteDrawingFeature } from '../features/rough-note-drawing/RoughNoteDrawingFeature';
import type { NavigationKey } from '../shared/navigation/navigation.data';

interface SimplePageProps {
  activeItem: NavigationKey;
  anchor: string;
  description: string;
  eyebrow: string;
  title: string;
}

export function SimplePage({
  activeItem,
  anchor,
  description,
  eyebrow,
  title
}: SimplePageProps) {
  return (
    <>
      <SiteLayout
        activeItem={activeItem}
        pageLabel={eyebrow}
        pageTitle={title}
      >
        <main className="simple-page" data-rough-anchor={anchor}>
          <p className="simple-page__eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
          <a href="/html/index.html?animated=true">Return to the homepage</a>
        </main>
      </SiteLayout>
      <RoughNoteDrawingFeature />
    </>
  );
}
