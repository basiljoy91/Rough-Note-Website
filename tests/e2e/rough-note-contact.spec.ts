import { expect, test, type Page } from '@playwright/test';

const CONTACT_PAGE = '/html/contact.html';

async function openContact(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(CONTACT_PAGE);
}

async function reachChallengeStep(page: Page) {
  await page.getByRole('button', { name: 'Start My Rough Note' }).click();
  await expect(
    page.getByRole('heading', {
      name: /Tell Us About\s+Your Challenge/
    })
  ).toBeVisible({ timeout: 12_000 });
}

async function completeChallengeStep(page: Page) {
  await page.getByLabel(/What type of solution do you need/).selectOption('Website');
  await page.getByLabel(/Which department is this for/).selectOption('Marketing');
  await page
    .getByLabel(/What’s the challenge you’re facing/)
    .fill('We need a clearer digital journey for prospective clients.');
  await page.getByRole('button', { name: /Continue/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Almost There!' })
  ).toBeVisible();
}

async function reachContactStep(page: Page) {
  await reachChallengeStep(page);
  await completeChallengeStep(page);
}

async function completeContactStep(page: Page) {
  await page.getByLabel(/Your Name/).fill('Ada Lovelace');
  await page.getByLabel(/Email Address/).fill('ada@example.com');
  await page.getByLabel(/Your Role/).selectOption('Founder / Owner');
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.ROUGH_NOTE_FEATURE_FLAGS = { roughPencil: false };
  });
});

test('completes the full physical-paper journey after server confirmation', async ({
  page
}, testInfo) => {
  test.setTimeout(60_000);
  test.skip(
    !testInfo.project.name.includes('desktop'),
    'The full-duration transformation is covered once on desktop.'
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  let requestCount = 0;
  await page.route('**/api/contact', async (route) => {
    requestCount += 1;
    expect(route.request().postData() ?? '').toContain(
      'rough-note-contact-journey'
    );
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ submissionId: 'RN-E2E-001' })
    });
  });
  await page.goto(CONTACT_PAGE);
  await reachContactStep(page);
  await completeContactStep(page);
  await page.getByRole('button', { name: 'Send My Rough Note' }).click();

  await expect(page.getByRole('heading', { name: 'Thank You!' })).toBeVisible({
    timeout: 10_000
  });
  await expect(page.getByText(/RN-E2E-001/)).toBeVisible();
  await expect(
    page
      .locator('section[data-step="4"]')
      .getByRole('img', { name: 'Your rough note has been received.' })
  ).toBeVisible();
  expect(requestCount).toBe(1);
});

test('blocks incomplete challenge fields and focuses the first review mark', async ({
  page
}) => {
  await openContact(page);
  await reachChallengeStep(page);
  await page.getByRole('button', { name: /Continue/ }).click();

  await expect(
    page.getByText('Choose the type of solution you need.')
  ).toBeVisible();
  await expect(page.getByLabel(/What type of solution do you need/)).toBeFocused();
  await expect(
    page.getByRole('heading', {
      name: /Tell Us About\s+Your Challenge/
    })
  ).toBeVisible();
});

test('rejects invalid and oversized reference files', async ({ page }) => {
  await openContact(page);
  await reachChallengeStep(page);
  const input = page.getByLabel('Upload reference file');

  await input.setInputFiles({
    name: 'reference.exe',
    mimeType: 'application/octet-stream',
    buffer: Buffer.from('not-a-reference')
  });
  await expect(page.getByText(/Use a JPG, JPEG, PNG/)).toBeVisible();

  await input.setInputFiles({
    name: 'large-reference.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.alloc(5 * 1024 * 1024 + 1)
  });
  await expect(
    page.getByText('The reference file must be 5 MB or smaller.')
  ).toBeVisible();
});

test('invalid contact details block submission and focus the first field', async ({
  page
}) => {
  await openContact(page);
  await reachContactStep(page);
  await page.getByLabel(/Your Name/).fill('Ada Lovelace');
  await page.getByLabel(/Email Address/).fill('not-an-email');
  await page.getByLabel(/Your Role/).selectOption('Founder / Owner');
  await page.getByRole('button', { name: 'Send My Rough Note' }).click();

  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  await expect(page.getByLabel(/Email Address/)).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Almost There!' })).toBeVisible();
});

test('server failure restores the editable form without losing values', async ({
  page
}) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'The studio is briefly unavailable.' })
    })
  );
  await openContact(page);
  await reachContactStep(page);
  await completeContactStep(page);
  await page.getByRole('button', { name: 'Send My Rough Note' }).click();

  await expect(
    page
      .locator('form')
      .getByText('The studio is briefly unavailable.', { exact: true })
  ).toBeVisible();
  await expect(page.getByLabel(/Your Name/)).toHaveValue('Ada Lovelace');
  await expect(page.getByLabel(/Email Address/)).toHaveValue('ada@example.com');
  await expect(
    page.getByRole('button', { name: 'Send My Rough Note' })
  ).toBeEnabled();
});

test('rapid repeated activation submits exactly once', async ({ page }) => {
  let requestCount = 0;
  await page.route('**/api/contact', async (route) => {
    requestCount += 1;
    await new Promise((resolve) => setTimeout(resolve, 80));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ submissionId: 'RN-ONCE' })
    });
  });
  await openContact(page);
  await reachContactStep(page);
  await completeContactStep(page);
  await page
    .getByRole('button', { name: 'Send My Rough Note' })
    .evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });

  await expect(page.getByRole('heading', { name: 'Thank You!' })).toBeVisible();
  expect(requestCount).toBe(1);
});

test('browser back preserves challenge values', async ({ page }) => {
  await openContact(page);
  await reachContactStep(page);
  await page.goBack();

  await expect(
    page.getByRole('heading', {
      name: /Tell Us About\s+Your Challenge/
    })
  ).toBeVisible();
  await expect(page.getByLabel(/What type of solution do you need/)).toHaveValue(
    'Website'
  );
  await expect(page.getByLabel(/Which department is this for/)).toHaveValue(
    'Marketing'
  );
});

test('reduced motion advances quickly and moves focus to the new heading', async ({
  page
}) => {
  await openContact(page);
  await page.getByRole('button', { name: 'Start My Rough Note' }).focus();
  await page.evaluate(() => {
    const startedAt = performance.now();
    const recordTransitionDuration = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (event.target.id !== 'contact-step-2-title') return;
      document.documentElement.dataset.contactReducedMotionDuration = String(
        performance.now() - startedAt
      );
      document.removeEventListener('focusin', recordTransitionDuration);
    };
    document.addEventListener('focusin', recordTransitionDuration);
  });
  await page.keyboard.press('Enter');
  const heading = page.getByRole('heading', {
    name: /Tell Us About\s+Your Challenge/
  });

  await expect(heading).toBeVisible();
  await expect(heading).toBeFocused();
  const transitionDuration = Number(
    await page.locator('html').getAttribute('data-contact-reduced-motion-duration')
  );
  expect(transitionDuration).toBeLessThan(1_000);
});

test('mobile paper remains within the viewport and exposes paper-tab progress', async ({
  page
}, testInfo) => {
  test.skip(
    !testInfo.project.name.includes('mobile'),
    'This assertion targets the mobile notebook layout.'
  );
  await openContact(page);
  await expect(
    page.getByRole('list', { name: 'Step 1 of 4' })
  ).toBeVisible();
  const viewport = page.viewportSize()!;
  const ball = await page.locator('[data-paper-ball]').boundingBox();
  expect(ball).not.toBeNull();
  expect(ball!.x).toBeGreaterThanOrEqual(0);
  expect(ball!.x + ball!.width).toBeLessThanOrEqual(viewport.width + 1);

  await reachChallengeStep(page);
  const layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
  await expect(page.getByLabel(/What type of solution do you need/)).toBeVisible();
});

test('the shared notebook navigation remains available', async ({ page }) => {
  await openContact(page);
  const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
  if (await menuButton.isVisible()) {
    await menuButton.click();
    await expect(
      page.getByRole('navigation', { name: 'Mobile pages' })
    ).toBeVisible();
  } else {
    await expect(
      page.getByRole('navigation', { name: 'Website pages' })
    ).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'Rough Note home' })).toHaveAttribute(
    'href',
    '/html/index.html'
  );
});
