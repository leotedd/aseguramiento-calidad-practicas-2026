import { Page } from '@playwright/test';

const PASSWORD = 'secret_sauce';

export type SauceUser =
  | 'standard_user'
  | 'problem_user'
  | 'performance_glitch_user'
  | 'locked_out_user';

export async function loginAs(page: Page, username: SauceUser) {
  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill(username);
  await page.locator('#password').fill(PASSWORD);
  await page.locator('#login-button').click();
}
