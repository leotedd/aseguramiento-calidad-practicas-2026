import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Tarea 10 - Tags, expect.soft() y browserName', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');
    await expect(page).toHaveURL(/inventory/);
  });

  // RETO 1 - Tags múltiples + --grep-invert
  // Este test pertenece a @regression y a @ui al mismo tiempo:
  //   --grep "@regression"   -> lo incluye
  //   --grep-invert "@ui"    -> lo excluye
  test('Reto 1 - El header del inventario muestra titulo y carrito',
    { tag: ['@regression', '@ui'] },
    async ({ page }) => {
      await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
      await expect(page.locator('[data-test="title"]')).toHaveText('Products');
      await expect(page.locator('.shopping_cart_link')).toBeVisible();
      await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
    });

  // RETO 2 - expect.soft() + testInfo.errors
  // Las soft assertions no detienen el test: si una falla, las demás
  // se siguen ejecutando y los errores se acumulan en testInfo.errors.
  test('Reto 2 - Validar atributos del primer producto con soft assertions',
    { tag: '@regression' },
    async ({ page }, testInfo) => {
      const producto = page.locator('.inventory_item').first();

      await expect.soft(producto.locator('.inventory_item_name')).toBeVisible();
      await expect.soft(producto.locator('.inventory_item_name')).not.toBeEmpty();
      await expect.soft(producto.locator('.inventory_item_desc')).not.toBeEmpty();
      await expect.soft(producto.locator('.inventory_item_price')).toBeVisible();
      await expect.soft(producto.locator('.inventory_item_price')).toHaveText(/^\$\d+\.\d{2}$/);
      await expect.soft(producto.locator('img.inventory_item_img')).toBeVisible();
      await expect.soft(producto.locator('.btn_inventory')).toBeVisible();
      await expect.soft(producto.locator('.btn_inventory')).toHaveText('Add to cart');

      // Reporte de errores acumulados por las soft assertions
      console.log(`[${testInfo.project.name}] Errores acumulados: ${testInfo.errors.length}`);
      for (const error of testInfo.errors) {
        console.log(`  - ${error.message}`);
      }
    });

  // RETO 3 - Fixture browserName
  // El user agent real cambia según el motor, así que la aserción
  // se adapta al navegador en el que se está ejecutando el test.
  test('Reto 3 - El user agent corresponde al navegador en ejecucion',
    { tag: '@cross-browser' },
    async ({ page, browserName }) => {
      const userAgent = await page.evaluate(() => navigator.userAgent);
      console.log(`[${browserName}] ${userAgent}`);

      if (browserName === 'chromium') {
        expect(userAgent).toContain('Chrome');
      } else if (browserName === 'firefox') {
        expect(userAgent).toContain('Firefox');
      } else if (browserName === 'webkit') {
        expect(userAgent).toContain('AppleWebKit');
        expect(userAgent).not.toContain('Chrome');
      }

      // La funcionalidad debe ser la misma en todos los navegadores
      await expect(page.locator('.inventory_item')).toHaveCount(6);
    });

});
