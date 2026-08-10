import { expect, test } from '@playwright/test';

const STORY_PAGE = '/html/about.html';

test('turns through the story, restores focus, and follows browser history', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STORY_PAGE);

  await expect(page.getByRole('heading', { name: 'Our Story', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Turn to Chapter 1', exact: true }).click();

  const chapterHeading = page.getByRole('heading', {
    name: 'Chapter 1: Two Dreamers, Two Paths',
    exact: true
  });
  await expect(chapterHeading).toBeVisible();
  await expect(chapterHeading).toBeFocused();
  await expect(page).toHaveURL(/#chapter-one$/);

  await page.getByRole('button', { name: 'Turn to Founders', exact: true }).click();
  const foundersHeading = page.getByRole('heading', {
    name: 'Main Characters',
    exact: true
  });
  await expect(foundersHeading).toBeVisible();
  await expect(foundersHeading).toBeFocused();
  await expect(page).toHaveURL(/#founders$/);

  await page.goBack();
  await expect(chapterHeading).toBeVisible();
  await expect(page).toHaveURL(/#chapter-one$/);

  await page.goForward();
  await expect(foundersHeading).toBeVisible();
  await expect(page).toHaveURL(/#founders$/);
});

test('keeps the book inside every configured viewport without page-level overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${STORY_PAGE}#founders`);

  const layout = await page.evaluate(() => {
    const book = document.querySelector('.story-book')?.getBoundingClientRect();
    return {
      book: book && {
        bottom: book.bottom,
        left: book.left,
        right: book.right,
        top: book.top
      },
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      viewportHeight: window.innerHeight
    };
  });

  expect(layout.book).not.toBeNull();
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
  expect(layout.book!.left).toBeGreaterThanOrEqual(-1);
  expect(layout.book!.right).toBeLessThanOrEqual(layout.clientWidth + 1);
  expect(layout.book!.top).toBeGreaterThanOrEqual(-1);
  expect(layout.book!.bottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
});

test('uses a dedicated founders composition and the immutable alpha cutout at each breakpoint', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${STORY_PAGE}#founders`);

  const expectedScene = testInfo.project.name.includes('mobile')
    ? '.character-scene--mobile'
    : testInfo.project.name.includes('tablet')
      ? '.character-scene--tablet'
      : '.character-scene--desktop';

  await expect(page.locator(expectedScene)).toBeVisible();
  await expect(page.locator(`${expectedScene} img[src$="founders-cutouts.png"]`)).toHaveCount(2);
  await expect(page.locator(`${expectedScene} .character-cutout`).first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  const layout = await page.evaluate((sceneSelector) => {
    const scene = document.querySelector(sceneSelector);
    const pageElement = document.querySelector('.story-book__page');
    const sceneRect = scene?.getBoundingClientRect();
    return {
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      mobilePanels: document.querySelectorAll('.character-mobile-panel').length,
      pageScrollWidth: pageElement?.scrollWidth,
      pageClientWidth: pageElement?.clientWidth,
      sceneWidth: sceneRect?.width
    };
  }, expectedScene);

  expect(layout.horizontalOverflow).toBe(false);
  expect(layout.pageScrollWidth).toBeLessThanOrEqual((layout.pageClientWidth ?? 0) + 1);
  expect(layout.sceneWidth).toBeGreaterThan(0);
  expect(layout.mobilePanels).toBe(7);
});

test('uses the shared curl renderer and ignores repeated activation while turning', async ({ page }, testInfo) => {
  test.skip(
    !testInfo.project.name.includes('desktop'),
    'The full canvas curl is verified once on desktop.'
  );

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(STORY_PAGE);
  await page.getByRole('button', { name: 'Turn to Chapter 1', exact: true }).evaluate((button: HTMLButtonElement) => {
    button.click();
    button.click();
  });

  await expect(page.locator('.story-turn-canvas')).toHaveCount(1, { timeout: 6_000 });
  await expect(page.locator('.story-book')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('.story-turn-canvas')).toHaveCount(0, { timeout: 8_000 });
  await expect(page.locator('.story-page')).toHaveAttribute('data-page-index', '1');
  await expect(page).toHaveURL(/#chapter-one$/);
});
