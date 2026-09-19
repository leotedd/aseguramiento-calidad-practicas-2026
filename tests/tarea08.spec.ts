import { test, expect, type Page } from '@playwright/test';

import { loginAs } from '../helpers/auth';

// =========================================================
// RETO 1 - SUITE SERIAL CON PÁGINA COMPARTIDA
// =========================================================
test.describe(
  'Reto 1 - Suite serial con página compartida',
  () => {

    test.describe.configure({ mode: 'serial' });

    let page: Page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();

      await loginAs(page, 'standard_user');
    });

    test.afterAll(async () => {
      await page.close();
    });


    test(
      'Paso 1: el login lleva al inventario',
      async () => {

        await expect(page).toHaveURL(/inventory/);
      }
    );

    test(
      'Paso 2: agregar un producto y verificar el badge',
      async () => {

        await page.locator('.btn_inventory').first().click();

        await expect(
          page.locator('.shopping_cart_badge')
        ).toHaveText('1');
      }
    );

    test(
      'Paso 3: el carrito conserva el producto agregado en el paso anterior',
      async () => {

        // No se vuelve a hacer login ni a agregar el producto:
        // esta prueba depende del estado dejado por el Paso 2
        // en la MISMA página, demostrando que el modo serial
        // comparte el estado cuando se reutiliza una sola Page.
        await page.locator('.shopping_cart_link').click();

        await expect(page).toHaveURL(/cart/);
        await expect(page.locator('.cart_item')).toHaveCount(1);
      }
    );

  }
);


// =========================================================
// RETO 2 - test.slow()
// =========================================================
test(
  'Reto 2 - test.slow(): documentar la lentitud de performance_glitch_user',
  async ({ page }) => {

    test.slow();

    const inicio = Date.now();

    await loginAs(page, 'performance_glitch_user');

    const tiempoLogin = Date.now() - inicio;

    console.log(
      `Reto 2 - test.slow() activo (timeout x3). Tiempo de login: ${tiempoLogin}ms`
    );

    expect(tiempoLogin).toBeGreaterThan(0);

    await expect(page).toHaveURL(/inventory/);
  }
);


// =========================================================
// RETO 3 - test.skip() DINÁMICO
// =========================================================
test(
  'Reto 3 - test.skip() dinámico: inventario solo si el login fue exitoso',
  async ({ page }) => {

    await loginAs(page, 'locked_out_user');

    // Condición evaluada en tiempo de ejecución: se lee el estado
    // real de la página después del intento de login.
    const loginFallido = await page
      .locator('[data-test="error"]')
      .isVisible();

    test.skip(
      loginFallido,
      'locked_out_user no puede iniciar sesión en Sauce Demo: ' +
      'se omite la verificación de inventario porque depende de ' +
      'estar autenticado'
    );

    await expect(page).toHaveURL(/inventory/);

    const productos = page.locator('.inventory_item');
    await expect(productos).toHaveCount(6);
  }
);
