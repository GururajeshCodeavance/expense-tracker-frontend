import { test, expect } from '@playwright/test';
import { login } from '../utils/loginHelper.js';

test.describe('Expense Module', () => {

  // ✅ 1. Empty Form Validation
  test('Empty expense validation', async ({ page }) => {
    await login(page, 'guru2@test.com', '12345');

    await page.getByRole('button', { name: 'Add Expense' }).first().click();

    await page.locator('form').getByRole('button', { name: 'Add Expense' }).click();

    await expect(page.getByText('Title is required')).toBeVisible();
    await expect(page.getByText('Amount is required')).toBeVisible();
    await expect(page.getByText('Category is required')).toBeVisible();
    await expect(page.getByText('Date is required')).toBeVisible();
  });

  // ✅ 2. Invalid Title (numbers not allowed)
  test('Invalid title validation', async ({ page }) => {
    await login(page, 'guru2@test.com', '12345');

    await page.getByRole('button', { name: 'Add Expense' }).first().click();

    await page.fill('input[placeholder="Expense Title"]', '123');

    await page.locator('form').getByRole('button', { name: 'Add Expense' }).click();

    await expect(
      page.getByText('Title must contain only alphabets')
    ).toBeVisible();
  });

  // ✅ 3. Invalid Amount (negative)
  test('Invalid amount validation', async ({ page }) => {
    await login(page, 'guru2@test.com', '12345');

    await page.getByRole('button', { name: 'Add Expense' }).first().click();

    await page.fill('input[placeholder="Expense Title"]', 'Test');
    await page.fill('input[placeholder="Amount"]', '-100');

    await page.locator('form').getByRole('button', { name: 'Add Expense' }).click();

    await expect(
      page.getByText('Amount must be greater than 0')
    ).toBeVisible();
  });

  // ✅ 4. No Category Selected
  test('No category validation', async ({ page }) => {
    await login(page, 'guru2@test.com', '12345');

    await page.getByRole('button', { name: 'Add Expense' }).first().click();

    await page.fill('input[placeholder="Expense Title"]', 'Test');
    await page.fill('input[placeholder="Amount"]', '100');

    await page.locator('form').getByRole('button', { name: 'Add Expense' }).click();

    await expect(page.getByText('Category is required')).toBeVisible();
  });

  // ✅ 5. Add Expense Successfully
  test('Add Expense successfully', async ({ page }) => {
    // ⚠️ ONLY alphabets (important)
    const words = ['soap', 'shampoo', 'oil', 'cream', 'lotion'];
    const randomWord = words[Math.floor(Math.random() * words.length)];

    const expenseName = 'bodywash ' + randomWord;

    await login(page, 'guru2@test.com', '12345');

    await page.getByRole('button', { name: 'Add Expense' }).first().click();

    await page.fill('input[placeholder="Expense Title"]', expenseName);
    await page.fill('input[placeholder="Amount"]', '200');

    await page.selectOption('select', { label: 'Shopping' });

    await page.fill('input[type="date"]', '2026-04-10');

    await page.locator('form').getByRole('button', { name: 'Add Expense' }).click();

    // 👉 Go to Expense List
    await page.getByRole('button', { name: 'Expense List' }).click();

    // 👉 Ensure page loaded
    await expect(
      page.getByRole('heading', { name: 'Expense List' })
    ).toBeVisible();

    while (await page.getByText('Prev').isEnabled()) {
  await page.getByText('Prev').click();
}

// 🔥 GO TO FIRST PAGE
while (await page.getByText('Prev').isEnabled()) {
  await page.getByText('Prev').click();
}

// 🔥 SEARCH THROUGH PAGES
let found = false;

while (true) {
  const tableText = await page.locator('table').textContent();

  if (tableText.includes(expenseName)) {
    found = true;
    break;
  }

  const nextBtn = page.getByText('Next');

  if (!(await nextBtn.isEnabled())) break;

  await nextBtn.click();
}

// ✅ FINAL ASSERT
expect(found).toBeTruthy();
});
// ✅ 6. Edit Expense
test('Edit Expense successfully', async ({ page }) => {
  await login(page, 'guru2@test.com', '12345');

  // 👉 Go to Expense List
  await page.getByRole('button', { name: 'Expense List' }).click();

  await expect(
    page.getByRole('heading', { name: 'Expense List' })
  ).toBeVisible();

  // 👉 Pick first row
  const row = page.locator('table tbody tr').first();

  // 👉 Click Edit
  await row.getByRole('button', { name: 'Edit' }).click();

  // 👉 Update amount
  const amountInput = row.locator('input');
  await amountInput.fill('255');

  // 👉 Click Save
  await row.getByRole('button', { name: 'Save' }).click();

  // 👉 Verify success message
  await expect(
    page.getByText('Expense updated successfully')
  ).toBeVisible();

  // 👉 Verify updated value
  await expect(row).toContainText('255');
});

test('Delete 3rd Expense', async ({ page }) => {
  await login(page, 'guru2@test.com', '12345');

  // 👉 Go to Expense List
  await page.getByRole('button', { name: 'Expense List' }).click();

  await expect(
    page.getByRole('heading', { name: 'Expense List' })
  ).toBeVisible();

  const row = page.locator('table tbody tr').nth(2);

const rowText = await row.textContent();

// 👉 click delete in row
await row.getByRole('button', { name: 'Delete' }).click();

// 🔥 FIX: directly click popup Delete (NO dialog)
await page.getByRole('button', { name: 'Delete' }).last().click();

// 👉 verify success
await expect(
  page.getByText('Expense deleted successfully')
).toBeVisible();

// 👉 verify removed
await expect(page.locator('table')).not.toContainText(rowText);
});
});