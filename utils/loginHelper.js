// utils/loginHelper.js

export async function login(page, email, password) {
  await page.goto('http://localhost:3000');

  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  await page.click('text=Login');
}
