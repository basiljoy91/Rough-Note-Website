# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rough-note-drawing.spec.ts >> persists separate vector documents by route after consent
- Location: tests/e2e/rough-note-drawing.spec.ts:86:1

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Array [
-   1,
+   0,
    1,
  ]

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e3]:
    - button "Open navigation menu" [ref=f1e4] [cursor=pointer]:
      - generic [ref=f1e9]: ROUGH NOTE
      - generic [ref=f1e11]: RN
    - complementary:
      - button: ×
      - link:
        - /url: ./index.html?animated=true
        - generic: ROUGH NOTE
        - generic: IDEAS. SKETCHED. REALIZED.
      - navigation:
        - link:
          - /url: ./index.html?animated=true
          - text: Home
        - link:
          - /url: ./index.html?animated=true#services
          - text: Our Services
        - link:
          - /url: ./index.html?animated=true#about
          - text: About
        - link:
          - /url: ./index.html?animated=true#plans
          - text: Our Plans
        - link:
          - /url: ./contact.html
          - text: Contact
        - link:
          - /url: ./index.html?animated=true#next
          - text: Next Software
          - generic: NEW
      - link:
        - /url: ./contact.html
        - text: Request a Rough Note
      - paragraph: See you inside! ♡
    - main [ref=f1e12] [cursor=pointer]:
      - region [ref=f1e14]:
        - list "Step 1 of 4" [ref=f1e15]:
          - listitem [ref=f1e16]:
            - generic [ref=f1e17]: "01"
          - listitem [ref=f1e18]:
            - generic [ref=f1e19]: "02"
          - listitem [ref=f1e20]:
            - generic [ref=f1e21]: "03"
          - listitem [ref=f1e22]:
            - generic [ref=f1e23]: "04"
        - generic [ref=f1e24]: STEP 01
        - heading "Start Your Rough Note" [level=1] [ref=f1e27]
        - generic [ref=f1e37]:
          - paragraph [ref=f1e38]: Every great product startswith a rough note.
          - paragraph [ref=f1e39]:
            - text: Tell us what's stopping your business,and we'll sketch the first solution —completely
            - strong [ref=f1e40]: FREE.
        - generic [ref=f1e41]:
          - img "A crumpled sheet stamped RN" [ref=f1e48]:
            - generic [ref=f1e49]: RN
          - complementary [ref=f1e66]:
            - paragraph [ref=f1e68]: No Sales.No Pressure.Just Ideas.
        - generic [ref=f1e75]:
          - paragraph [ref=f1e81]: Like the idea? Great,let's build it together.
          - paragraph [ref=f1e83]: Not the right direction?That's okay — you canmodify it or simply takethe idea with you.
        - button "Start My Rough Note" [ref=f1e87]
        - generic [ref=f1e95]: Page 01
      - paragraph [ref=f1e97]: Step 1 of 4. Start Your Rough Note.
  - generic:
    - generic:
      - toolbar "Drawing tools" [ref=f1e98] [cursor=pointer]:
        - button "Move drawing toolbar" [ref=f1e99]
        - generic [ref=f1e107]:
          - button "Use pencil" [pressed] [ref=f1e108]:
            - generic [ref=f1e113]: Pencil
          - button "Use pen" [ref=f1e115]:
            - generic [ref=f1e120]: Pen
          - button "Use highlighter" [ref=f1e121]:
            - generic [ref=f1e126]: Highlighter
          - button "Use eraser" [ref=f1e127]:
            - generic [ref=f1e132]: Eraser
        - radiogroup "Drawing colour" [ref=f1e134]:
          - radio "Black" [checked] [ref=f1e135]
          - radio "Blue" [ref=f1e139]
          - radio "Red" [ref=f1e140]
          - radio "Yellow" [ref=f1e141]
          - radio "Green" [ref=f1e142]
          - radio "Purple" [ref=f1e143]
        - generic [ref=f1e145]:
          - status "4 pixels" [ref=f1e146]: 4 px
          - slider "Stroke width" [ref=f1e147]: "4"
        - generic [ref=f1e149]:
          - button "Undo" [disabled] [ref=f1e150]
          - button "Redo" [disabled] [ref=f1e155]
        - button "Use hand to browse page" [ref=f1e161]
        - button "Hide drawing" [ref=f1e167]
        - button "Clear drawing" [ref=f1e173]
        - button "Collapse tools" [ref=f1e178]
      - status [ref=f1e182] [cursor=pointer]
```

# Test source

```ts
  67  | });
  68  | 
  69  | test('creates, cancels safely, undoes and redoes a pointer stroke', async ({
  70  |   page
  71  | }, testInfo) => {
  72  |   test.skip(testInfo.project.name.includes('mobile'));
  73  |   await page.goto(PAGE);
  74  |   await declineStorage(page);
  75  |   await page.mouse.move(240, 180);
  76  |   await page.mouse.down();
  77  |   await page.mouse.move(390, 260, { steps: 8 });
  78  |   await page.mouse.up();
  79  |   await expect(page.getByRole('button', { name: 'Undo' })).toBeEnabled();
  80  |   await page.getByRole('button', { name: 'Undo' }).click();
  81  |   await expect(page.getByRole('button', { name: 'Redo' })).toBeEnabled();
  82  |   await page.getByRole('button', { name: 'Redo' }).click();
  83  |   await expect(page.getByRole('button', { name: 'Undo' })).toBeEnabled();
  84  | });
  85  | 
  86  | test('persists separate vector documents by route after consent', async ({
  87  |   page
  88  | }, testInfo) => {
  89  |   test.skip(testInfo.project.name.includes('mobile'));
  90  |   await page.goto(PAGE);
  91  |   await page.getByRole('button', { name: 'Remember my art!' }).click();
  92  |   await page.mouse.move(260, 160);
  93  |   await page.mouse.down();
  94  |   await page.mouse.move(410, 230, { steps: 7 });
  95  |   await page.mouse.up();
  96  | 
  97  |   await expect
  98  |     .poll(async () =>
  99  |       page.evaluate(async () => {
  100 |         const request = indexedDB.open('rough-note-drawing', 1);
  101 |         const database = await new Promise<IDBDatabase>((resolve, reject) => {
  102 |           request.onsuccess = () => resolve(request.result);
  103 |           request.onerror = () => reject(request.error);
  104 |         });
  105 |         const transaction = database.transaction('drawings', 'readonly');
  106 |         const recordRequest = transaction.objectStore('drawings').get('/projects');
  107 |         const record = await new Promise<{ strokes?: unknown[] } | undefined>(
  108 |           (resolve, reject) => {
  109 |             recordRequest.onsuccess = () => resolve(recordRequest.result);
  110 |             recordRequest.onerror = () => reject(recordRequest.error);
  111 |           }
  112 |         );
  113 |         database.close();
  114 |         return record?.strokes?.length ?? 0;
  115 |       })
  116 |     )
  117 |     .toBe(1);
  118 | 
  119 |   await expect
  120 |     .poll(() =>
  121 |       page.evaluate(async () => {
  122 |         const request = indexedDB.open('rough-note-drawing', 1);
  123 |         const database = await new Promise<IDBDatabase>((resolve) => {
  124 |           request.onsuccess = () => resolve(request.result);
  125 |         });
  126 |         const transaction = database.transaction('drawings', 'readonly');
  127 |         const recordRequest = transaction.objectStore('drawings').get('/projects');
  128 |         const record = await new Promise<
  129 |           { strokes?: Array<{ points?: unknown[] }> } | undefined
  130 |         >((resolve) => {
  131 |           recordRequest.onsuccess = () => resolve(recordRequest.result);
  132 |         });
  133 |         database.close();
  134 |         return record?.strokes?.[0]?.points?.length ?? 0;
  135 |       })
  136 |     )
  137 |     .toBeGreaterThan(2);
  138 | 
  139 |   await page.goto('/html/contact.html');
  140 |   await page.mouse.move(220, 150);
  141 |   await page.mouse.down();
  142 |   await page.mouse.move(340, 220, { steps: 6 });
  143 |   await page.mouse.up();
  144 |   await expect
  145 |     .poll(() =>
  146 |       page.evaluate(async () => {
  147 |         const request = indexedDB.open('rough-note-drawing', 1);
  148 |         const database = await new Promise<IDBDatabase>((resolve) => {
  149 |           request.onsuccess = () => resolve(request.result);
  150 |         });
  151 |         const transaction = database.transaction('drawings', 'readonly');
  152 |         const store = transaction.objectStore('drawings');
  153 |         const contactRequest = store.get('/contact');
  154 |         const projectsRequest = store.get('/projects');
  155 |         const records = await Promise.all([
  156 |           new Promise<{ strokes?: unknown[] } | undefined>((resolve) => {
  157 |             contactRequest.onsuccess = () => resolve(contactRequest.result);
  158 |           }),
  159 |           new Promise<{ strokes?: unknown[] } | undefined>((resolve) => {
  160 |             projectsRequest.onsuccess = () => resolve(projectsRequest.result);
  161 |           })
  162 |         ]);
  163 |         database.close();
  164 |         return records.map((record) => record?.strokes?.length ?? 0);
  165 |       })
  166 |     )
> 167 |     .toEqual([1, 1]);
      |      ^ Error: expect(received).toEqual(expected) // deep equality
  168 | 
  169 |   await page.goto(PAGE);
  170 |   await expect(page.getByText('Rough Note Memory:')).toHaveCount(0);
  171 |   await expect
  172 |     .poll(() =>
  173 |       page.evaluate(async () => {
  174 |         const request = indexedDB.open('rough-note-drawing', 1);
  175 |         const database = await new Promise<IDBDatabase>((resolve) => {
  176 |           request.onsuccess = () => resolve(request.result);
  177 |         });
  178 |         const transaction = database.transaction('drawings', 'readonly');
  179 |         const recordRequest = transaction.objectStore('drawings').get('/projects');
  180 |         const record = await new Promise<{ strokes?: unknown[] } | undefined>(
  181 |           (resolve) => {
  182 |             recordRequest.onsuccess = () => resolve(recordRequest.result);
  183 |           }
  184 |         );
  185 |         database.close();
  186 |         return record?.strokes?.length ?? 0;
  187 |       })
  188 |     )
  189 |     .toBe(1);
  190 | });
  191 | 
  192 | test('the feature flag prevents cursor and engine initialization', async ({
  193 |   page
  194 | }) => {
  195 |   await page.addInitScript(() => {
  196 |     window.ROUGH_NOTE_FEATURE_FLAGS = { roughPencil: false };
  197 |   });
  198 |   await page.goto(PAGE);
  199 |   await expect(page.locator('[data-rough-note-root]')).toHaveCount(0);
  200 |   await expect(page.locator('html')).not.toHaveAttribute(
  201 |     'data-rough-note-tool',
  202 |     /.+/
  203 |   );
  204 | });
  205 | 
```