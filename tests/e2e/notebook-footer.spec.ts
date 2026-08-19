import { expect, test } from '@playwright/test';

const FOOTER_PAGE = '/html/index.html?animated=true';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.ROUGH_NOTE_FEATURE_FLAGS = { roughPencil: false };
  });
  await page.goto(FOOTER_PAGE);
  await page.locator('#rough-note-footer-root').scrollIntoViewIfNeeded();
  await page.getByTestId('notebook-footer').scrollIntoViewIfNeeded();
});

test('renders the complete notebook-paper footer composition', async ({
  page
}) => {
  const footer = page.getByTestId('notebook-footer');
  await expect(footer).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Thanks for visiting us!' })
  ).toBeVisible();
  await expect(page.getByTestId('newsletter-card')).toBeVisible();
  await expect(page.getByTestId('coffee-card')).toBeVisible();
  await expect(page.getByTestId('sticky-note')).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Footer navigation' })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Careers' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Terms & Conditions' })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
});

test('uses desktop columns, a tablet 2+1 grid and mobile notebook pages', async ({
  page
}, testInfo) => {
  const newsletter = await page.getByTestId('newsletter-card').boundingBox();
  const coffee = await page.getByTestId('coffee-card').boundingBox();
  const sticky = await page.getByTestId('sticky-note').boundingBox();
  const footerRoot = await page
    .locator('#rough-note-footer-root')
    .boundingBox();

  expect(newsletter).not.toBeNull();
  expect(coffee).not.toBeNull();
  expect(sticky).not.toBeNull();
  expect(footerRoot).not.toBeNull();

  if (testInfo.project.name.includes('mobile')) {
    expect(coffee!.y).toBeGreaterThan(newsletter!.y + newsletter!.height);
    expect(sticky!.y).toBeGreaterThan(coffee!.y + coffee!.height);

    const form = await page.locator('form[data-drawing-exclusion]').boundingBox();
    const subscribe = await page
      .getByRole('button', { name: 'Subscribe' })
      .boundingBox();
    expect(form).not.toBeNull();
    expect(subscribe).not.toBeNull();
    expect(subscribe!.width).toBeGreaterThan(form!.width * 0.9);
  } else if (
    testInfo.project.name.includes('tablet') ||
    footerRoot!.width <= 1200
  ) {
    expect(Math.abs(newsletter!.y - coffee!.y)).toBeLessThan(30);
    expect(sticky!.y).toBeGreaterThan(newsletter!.y + newsletter!.height);
    expect(newsletter!.x).toBeLessThan(coffee!.x);
  } else {
    expect(Math.abs(newsletter!.y - coffee!.y)).toBeLessThan(30);
    expect(Math.abs(newsletter!.y - sticky!.y)).toBeLessThan(30);
    expect(newsletter!.x).toBeLessThan(coffee!.x);
    expect(coffee!.x).toBeLessThan(sticky!.x);
  }
});

test('continues the desktop notebook content gutter without covering the sidebar', async ({
  page
}, testInfo) => {
  test.skip(
    testInfo.project.name.includes('mobile') ||
      testInfo.project.name.includes('tablet'),
    'The fixed notebook sidebar is desktop-only.'
  );

  const sidebar = await page.locator('.header').boundingBox();
  const footerRoot = await page
    .locator('#rough-note-footer-root')
    .boundingBox();
  const lastSection = await page.locator('#div-8').boundingBox();

  expect(sidebar).not.toBeNull();
  expect(footerRoot).not.toBeNull();
  expect(lastSection).not.toBeNull();
  expect(footerRoot!.x).toBeGreaterThanOrEqual(
    sidebar!.x + sidebar!.width
  );
  const overlap = lastSection!.y + lastSection!.height - footerRoot!.y;
  expect(overlap).toBeGreaterThanOrEqual(30);
  expect(overlap).toBeLessThanOrEqual(34);
});

test('moves the pencil on focus and stamps a check on subscribe', async ({
  page
}) => {
  await page.route('**/api/newsletter/subscribe', (route) =>
    route.fulfill({
      status: 202,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'accepted' })
    })
  );
  const input = page.getByRole('textbox', { name: 'Email address' });
  const pencil = page.getByTestId('footer-pencil');
  const restingTransform = await pencil.evaluate(
    (element) => getComputedStyle(element).transform
  );

  await input.focus();
  await expect
    .poll(() =>
      pencil.evaluate((element) => getComputedStyle(element).transform)
    )
    .not.toBe(restingTransform);

  await input.fill('notes@example.com');
  await page.getByRole('button', { name: 'Subscribe' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Check your inbox to confirm your subscription.'
  );
  await expect(page.getByTestId('subscribe-check')).toHaveCSS('opacity', '1');
});

test('removes physical motion when reduced motion is requested', async ({
  page
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const steam = page
    .locator('svg[aria-label="A hand-drawn coffee cup marked RN"] > g > g')
    .first();
  await expect(steam).toHaveCSS('animation-name', 'none');
});
