import { expect, test } from '@playwright/test';

const STORY_PAGE = '/html/about.html';

async function openNavigation(page: import('@playwright/test').Page) {
  const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
  const usesMobileMenu = await menuButton.isVisible();
  if (usesMobileMenu) await menuButton.click();
  return page.getByRole('navigation', {
    name: usesMobileMenu ? 'Mobile pages' : 'Website pages'
  });
}

test('Home navigation uses the shared page turn and opens the product hero', async ({ page }) => {
  await page.goto(STORY_PAGE);

  const navigation = await openNavigation(page);
  const homeLink = navigation.getByRole('link', { name: 'Home', exact: true });

  await expect(homeLink).toHaveAttribute('href', '/html/index.html');
  await expect(homeLink).not.toHaveAttribute('data-page-turn', 'false');
  const navigationPromise = page.waitForURL(/\/html\/index\.html$/);
  await homeLink.click();
  await expect(page.locator('.rn-page-turn')).toHaveCount(1, { timeout: 5_000 });
  await navigationPromise;

  await expect(page).toHaveURL(/\/html\/index\.html$/);
  await expect(
    page.getByRole('heading', { name: /Every Great Product Starts Here/ })
  ).toBeVisible();
  await expect(page.locator('.rn-page-turn')).toHaveCount(0);
});

test('Contact arrival focus never draws a page-wide browser outline', async ({ page }) => {
  await page.goto('/html/services.html');
  const navigation = await openNavigation(page);
  await navigation.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/\/html\/connect\.html$/);

  const contactMain = page.getByRole('main', { name: 'Rough Note contact page' });
  await expect(contactMain).toBeFocused();
  await expect(contactMain).toHaveCSS('outline-style', 'none');
});

test('Our Story uses one global route stage and settles cleanly', async ({ page }) => {
  await page.goto('/html/services.html', { waitUntil: 'domcontentloaded' });
  const navigation = await openNavigation(page);
  const storyLink = navigation.getByRole('link', { name: 'Our Story', exact: true });
  await storyLink.evaluate((link: HTMLAnchorElement) => link.click());

  const destination = page.locator('.rn-page-turn__destination');
  await expect(destination).toHaveCount(1, { timeout: 3_000 });

  await expect(page).toHaveURL(/\/html\/about\.html$/);
  await expect(page.locator('.story-book')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.rn-page-turn')).toHaveCount(0);
  await expect(page.locator('.our-story-page')).toHaveClass(/our-story-page--route-arrival/);
  await expect(page.locator('.story-entry-glow')).toHaveCSS('display', 'none');
  await expect(page.locator('.story-book')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.story-cover-title__ink')).toHaveCSS('animation-name', 'none');
});

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
  await expect(chapterHeading).toHaveCSS('outline-style', 'none');
  await expect(page).toHaveURL(/#chapter-one$/);

  await page.getByRole('button', { name: 'Turn to Founders', exact: true }).click();
  const foundersHeading = page.getByRole('heading', {
    name: 'Main Characters',
    exact: true
  });
  await expect(foundersHeading).toBeVisible();
  await expect(foundersHeading).toBeFocused();
  await expect(foundersHeading).toHaveCSS('outline-style', 'none');
  await expect(page).toHaveURL(/#founders$/);

  await page.goBack();
  await expect(chapterHeading).toBeVisible();
  await expect(page).toHaveURL(/#chapter-one$/);

  await page.goForward();
  await expect(foundersHeading).toBeVisible();
  await expect(page).toHaveURL(/#founders$/);
});

test('turns one story page per intentional wheel gesture', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STORY_PAGE, { waitUntil: 'domcontentloaded' });
  await page.locator('.story-book').hover();

  // Trackpads emit several inertial wheel events for one physical gesture.
  // They must advance one sheet, never skip directly to the founders page.
  await page.locator('.our-story-page').evaluate((storyRoot) => {
    storyRoot.dispatchEvent(new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: 160
    }));
    storyRoot.dispatchEvent(new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: 160
    }));
  });

  await expect(page.locator('.story-page')).toHaveAttribute('data-page-index', '1');
  await expect(page).toHaveURL(/#chapter-one$/);

  await page.waitForTimeout(1_750);
  await page.locator('.story-book__page').evaluate((storyPage) => {
    storyPage.scrollTop = storyPage.scrollHeight;
  });
  await page.locator('.our-story-page').evaluate((storyRoot) => {
    storyRoot.dispatchEvent(new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: 160
    }));
  });
  await expect(page.locator('.story-page')).toHaveAttribute('data-page-index', '2');
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

test('drives the founders depth layers from the physical page scroll', async ({ page }, testInfo) => {
  test.skip(
    !testInfo.project.name.includes('desktop'),
    'The pinned wide-story scroll beat is verified once on desktop.'
  );

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${STORY_PAGE}#founders`);
  const storyPage = page.locator('.story-book__page');

  await expect.poll(async () => storyPage.evaluate((element) => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0);
  await storyPage.evaluate((element) => {
    element.scrollTop = (element.scrollHeight - element.clientHeight) * 0.75;
    element.dispatchEvent(new Event('scroll', { bubbles: true }));
  });

  await expect.poll(async () => Number.parseFloat(await page.locator('.story-page--founders').evaluate((element) => (
    getComputedStyle(element).getPropertyValue('--character-scroll-progress')
  )))).toBeGreaterThan(0.5);

  const researchTranslate = await page.locator('.character-code-card--desktop').evaluate((element) => getComputedStyle(element).translate);
  expect(researchTranslate).not.toBe('none');
  expect(researchTranslate).not.toBe('0px');
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
