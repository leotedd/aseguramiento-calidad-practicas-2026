import { test, expect } from '@playwright/test';

import { loginAs } from '../helpers/auth';

test.describe(
  'Clase 08 - Suite de inventario con hooks',
  () => {

    test.describe.configure({ mode: 'parallel' });

    test.beforeEach(async ({ page }) => {
      await loginAs(page, 'standard_user');
      await expect(page).toHaveURL(/inventory/);
    });

    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        const nombreSeguro = testInfo.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-');

        try {
          await page.screenshot({
            path: `./evidencias/fallo-${nombreSeguro}.png`,
            fullPage: true
          });
        } catch {
          console.log(
            'No se pudo capturar el screenshot: la página ya estaba cerrada'
          );
        }
      }
    });


    // =========================================================
    // TEST 1
    // =========================================================
    test(
      'El inventario muestra 6 productos',
      async ({ page }) => {

        const productos = page.locator('.inventory_item');

        await expect(productos).toHaveCount(6);
      }
    );


    // =========================================================
    // TEST 2
    // =========================================================
    test(
      'Todos los productos tienen precio visible',
      async ({ page }) => {

        const precios = page.locator('.inventory_item_price');
        const cantidad = await precios.count();

        for (let i = 0; i < cantidad; i++) {
          const precio = precios.nth(i);

          await expect(precio).toBeVisible();

          const texto = (await precio.textContent())?.trim();

          expect(texto).toMatch(/^\$\d+\.\d{2}$/);
        }
      }
    );


    // =========================================================
    // TEST 3
    // =========================================================
    test(
      'Todos los productos tienen imagen visible',
      async ({ page }) => {

        const imagenes = page.locator('.inventory_item img');
        const cantidad = await imagenes.count();

        for (let i = 0; i < cantidad; i++) {
          const imagen = imagenes.nth(i);

          await expect(imagen).toBeVisible();

          const src = await imagen.getAttribute('src');

          expect(src).not.toBeNull();
        }
      }
    );


    // =========================================================
    // TEST 4
    // =========================================================
    test(
      'El menú de hamburguesa funciona',
      async ({ page }) => {

        await page.locator('#react-burger-menu-btn').click();

        const menu = page.locator('.bm-menu');

        await expect(menu).toBeVisible();

        await expect(page.getByText('All Items')).toBeVisible();
        await expect(page.getByText('About')).toBeVisible();
        await expect(page.getByText('Logout')).toBeVisible();
        await expect(page.getByText('Reset App State')).toBeVisible();

        await page.locator('#react-burger-cross-btn').click();

        await expect(menu).not.toBeVisible();
      }
    );


    // =========================================================
    // TEST 5
    // =========================================================
    test(
      'Logout funciona correctamente',
      async ({ page }) => {

        await page.locator('#react-burger-menu-btn').click();

        await page.getByText('Logout').click();

        await expect(page).toHaveURL('https://www.saucedemo.com/');

        await expect(page.locator('#login-button')).toBeVisible();
      }
    );

  }
);


test.describe(
  'Clase 08 - Comportamiento por tipo de usuario',
  () => {

    test.describe.configure({ mode: 'parallel' });


    // =========================================================
    // TEST 6
    // =========================================================
    test(
      'Usuario estándar puede completar el checkout',
      async ({ page }) => {

        await loginAs(page, 'standard_user');

        await page.locator('.btn_inventory').first().click();

        await page.locator('.shopping_cart_link').click();

        await page.locator('[data-test="checkout"]').click();

        await expect(page).toHaveURL(/checkout-step-one/);
      }
    );


    // =========================================================
    // TEST 7
    // =========================================================
    test(
      'Usuario de rendimiento degrado experimenta lentitud',
      async ({ page }) => {

        const inicio = Date.now();

        await loginAs(page, 'performance_glitch_user');

        const tiempoLogin = Date.now() - inicio;

        console.log(
          `Tiempo de login (glitch user): ${tiempoLogin}ms`
        );

        expect(tiempoLogin).toBeGreaterThan(0);

        await expect(page).toHaveURL(/inventory/);
      }
    );

  }
);
