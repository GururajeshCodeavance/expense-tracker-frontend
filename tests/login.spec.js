import { test, expect } from '@playwright/test';
import { login } from '../utils/loginHelper';

test.describe('Login Tests', () => {

  test('Valid login', async ({ page }) => {
    await login(page, 'guru2@test.com', '12345');

    await expect(page.getByRole('heading', { name: /Dashboard/ })).toBeVisible();
  });

  test('Empty fields', async ({ page }) => {
    await login(page, '', '');

    await expect(page.getByText('Please enter email and password')).toBeVisible();
  });

  test('Spaces only', async ({ page }) => {
    await login(page, '   ', '   ');

    await expect(page.getByText('Please enter email and password')).toBeVisible();
  });

  test('Invalid email format', async ({ page }) => {
    await login(page, 'guru', '12345');

    await expect(page.locator('text=Invalid')).toBeVisible();
  });

  test('Wrong password', async ({ page }) => {
    await login(page, 'guru2@test.com', 'wrong123');

    await expect(page.locator('text=Invalid')).toBeVisible();
  });

});