import { expect, test } from '@playwright/test';

const PAGE = '/html/projects.html';

async function declineStorage(page: import('@playwright/test').Page) {
  const prompt = page.getByText('Rough Note Memory:');
  if (await prompt.isVisible()) {
    await page.getByRole('button', { name: 'No, thanks' }).click();
  }
}

test('loads the correct responsive paper controls', async ({
  page
}, testInfo) => {
  await page.goto(PAGE);
  const mobile = testInfo.project.name.includes('mobile');
  if (mobile) {
    await expect(
      page.getByRole('button', { name: 'Expand tools' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Expand tools' }).click();
    await expect(
      page.getByTestId('mobile-drawing-toolbar')
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Switch to browse mode' })
    ).toBeVisible();
  } else {
    await expect(page.getByTestId('drawing-toolbar')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Use pencil' })
    ).toHaveAttribute('aria-pressed', 'true');
  }
});

test('switches tools and protects normal website controls', async ({
  page
}, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'));
  await page.goto(PAGE);
  await declineStorage(page);
  await page.getByRole('button', { name: 'Use pen', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-rough-note-tool',
    'pen'
  );

  await page.evaluate(() => {
    const button = document.createElement('button');
    button.id = 'protected-control';
    button.textContent = 'Protected control';
    button.style.cssText =
      'position:fixed;left:20px;top:20px;z-index:100;width:160px;height:44px';
    button.addEventListener('click', () => {
      window.__roughPencilProtectedClicks =
        (window.__roughPencilProtectedClicks ?? 0) + 1;
    });
    document.body.append(button);
  });
  await page.getByRole('button', { name: 'Protected control' }).click();
  await expect
    .poll(() =>
      page.evaluate(() => window.__roughPencilProtectedClicks ?? 0)
    )
    .toBe(1);
  await expect(page.getByRole('button', { name: 'Undo' })).toBeDisabled();
});

test('creates, cancels safely, undoes and redoes a pointer stroke', async ({
  page
}, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'));
  await page.goto(PAGE);
  await declineStorage(page);
  await page.mouse.move(240, 180);
  await page.mouse.down();
  await page.mouse.move(390, 260, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByRole('button', { name: 'Undo' })).toBeEnabled();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('button', { name: 'Redo' })).toBeEnabled();
  await page.getByRole('button', { name: 'Redo' }).click();
  await expect(page.getByRole('button', { name: 'Undo' })).toBeEnabled();
});

test('persists separate vector documents by route after consent', async ({
  page
}, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'));
  await page.goto(PAGE);
  await page.getByRole('button', { name: 'Remember my art!' }).click();
  await page.mouse.move(260, 160);
  await page.mouse.down();
  await page.mouse.move(410, 230, { steps: 7 });
  await page.mouse.up();

  await expect
    .poll(async () =>
      page.evaluate(async () => {
        const request = indexedDB.open('rough-note-drawing', 1);
        const database = await new Promise<IDBDatabase>((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const transaction = database.transaction('drawings', 'readonly');
        const recordRequest = transaction.objectStore('drawings').get('/projects');
        const record = await new Promise<{ strokes?: unknown[] } | undefined>(
          (resolve, reject) => {
            recordRequest.onsuccess = () => resolve(recordRequest.result);
            recordRequest.onerror = () => reject(recordRequest.error);
          }
        );
        database.close();
        return record?.strokes?.length ?? 0;
      })
    )
    .toBe(1);

  await expect
    .poll(() =>
      page.evaluate(async () => {
        const request = indexedDB.open('rough-note-drawing', 1);
        const database = await new Promise<IDBDatabase>((resolve) => {
          request.onsuccess = () => resolve(request.result);
        });
        const transaction = database.transaction('drawings', 'readonly');
        const recordRequest = transaction.objectStore('drawings').get('/projects');
        const record = await new Promise<
          { strokes?: Array<{ points?: unknown[] }> } | undefined
        >((resolve) => {
          recordRequest.onsuccess = () => resolve(recordRequest.result);
        });
        database.close();
        return record?.strokes?.[0]?.points?.length ?? 0;
      })
    )
    .toBeGreaterThan(2);

  await page.goto('/html/contact.html');
  await page.mouse.move(220, 150);
  await page.mouse.down();
  await page.mouse.move(340, 220, { steps: 6 });
  await page.mouse.up();
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const request = indexedDB.open('rough-note-drawing', 1);
        const database = await new Promise<IDBDatabase>((resolve) => {
          request.onsuccess = () => resolve(request.result);
        });
        const transaction = database.transaction('drawings', 'readonly');
        const store = transaction.objectStore('drawings');
        const contactRequest = store.get('/contact');
        const projectsRequest = store.get('/projects');
        const records = await Promise.all([
          new Promise<{ strokes?: unknown[] } | undefined>((resolve) => {
            contactRequest.onsuccess = () => resolve(contactRequest.result);
          }),
          new Promise<{ strokes?: unknown[] } | undefined>((resolve) => {
            projectsRequest.onsuccess = () => resolve(projectsRequest.result);
          })
        ]);
        database.close();
        return records.map((record) => record?.strokes?.length ?? 0);
      })
    )
    .toEqual([1, 1]);

  await page.goto(PAGE);
  await expect(page.getByText('Rough Note Memory:')).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const request = indexedDB.open('rough-note-drawing', 1);
        const database = await new Promise<IDBDatabase>((resolve) => {
          request.onsuccess = () => resolve(request.result);
        });
        const transaction = database.transaction('drawings', 'readonly');
        const recordRequest = transaction.objectStore('drawings').get('/projects');
        const record = await new Promise<{ strokes?: unknown[] } | undefined>(
          (resolve) => {
            recordRequest.onsuccess = () => resolve(recordRequest.result);
          }
        );
        database.close();
        return record?.strokes?.length ?? 0;
      })
    )
    .toBe(1);
});

test('the feature flag prevents cursor and engine initialization', async ({
  page
}) => {
  await page.addInitScript(() => {
    window.ROUGH_NOTE_FEATURE_FLAGS = { roughPencil: false };
  });
  await page.goto(PAGE);
  await expect(page.locator('[data-rough-note-root]')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveAttribute(
    'data-rough-note-tool',
    /.+/
  );
});
