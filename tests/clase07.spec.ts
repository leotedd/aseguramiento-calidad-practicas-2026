import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe(
  'Clase 07 - Roles QA, Error/Defecto/Fallo y evidencias en Sauce Demo',
  () => {

    // =========================================================
    // TEST 1 - LOGIN EXITOSO CON EVIDENCIA COMPLETA
    // =========================================================
    test(
      'Login exitoso - evidencia completa',
      async ({ page }) => {

        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.navigate();

        // Screenshot ANTES del login
        await page.screenshot({
          path: './evidencias/clase07-antes-login.png',
          fullPage: true
        });

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        await inventoryPage.expectToBeOnInventoryPage();

        // Screenshot DESPUÉS del login
        await page.screenshot({
          path: './evidencias/clase07-despues-login.png',
          fullPage: true
        });

        console.log(
          'Evidencia de login capturada: antes y después'
        );
      }
    );


    // =========================================================
    // TEST 2 - DOCUMENTAR EL FLUJO DE COMPRA COMPLETO
    // =========================================================
    test(
      'Documentar el flujo de compra completo',
      async ({ page }) => {

        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);

        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        await expect(page).toHaveURL(/inventory/);

        await page.screenshot({
          path: './evidencias/clase07-inventario.png',
          fullPage: true
        });

        // Capturar el nombre del primer producto antes de agregarlo
        const nombreProducto = (
          await page
            .locator('.inventory_item_name')
            .first()
            .textContent()
        )?.trim() ?? '';

        await inventoryPage.addFirstProductToCart();

        await page.screenshot({
          path: './evidencias/clase07-producto-agregado.png',
          fullPage: true
        });

        await inventoryPage.goToCart();

        await expect(page).toHaveURL(/cart/);

        await page.screenshot({
          path: './evidencias/clase07-carrito.png',
          fullPage: true
        });

        await cartPage.expectItemCount(1);

        await expect(cartPage.cartItems).toContainText(
          nombreProducto
        );

        console.log(
          `Producto documentado en el flujo de compra: ${nombreProducto}`
        );
      }
    );


    // =========================================================
    // TEST 3 - CAPTURAR EL MOMENTO EXACTO DE UN DEFECTO ESPERADO
    // =========================================================
    test(
      'Capturar el momento exacto de un defecto esperado',
      async ({ page }) => {

        const loginPage = new LoginPage(page);

        await loginPage.navigate();

        await loginPage.login(
          'locked_out_user',
          'secret_sauce'
        );

        const errorMsg = page.locator('[data-test="error"]');

        await expect(errorMsg).toBeVisible();

        // Screenshot solamente del elemento de error
        await errorMsg.screenshot({
          path: './evidencias/clase07-error-usuario-bloqueado.png'
        });

        const textoError = await loginPage.getErrorMessage();

        console.log(
          `Defecto esperado capturado: ${textoError}`
        );
      }
    );


    // =========================================================
    // TEST 4 - COMPARAR ESTADOS ANTES Y DESPUÉS DE UNA ACCIÓN
    // =========================================================
    test(
      'Comparar estados antes y después de una acción',
      async ({ page }) => {

        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        // Estado inicial: el carrito está vacío, el badge no existe
        await expect(inventoryPage.cartBadge).toHaveCount(0);

        await page.screenshot({
          path: './evidencias/clase07-estado-antes.png',
          fullPage: true
        });

        await inventoryPage.addFirstProductToCart();

        await expect(inventoryPage.cartBadge).toBeVisible();
        await expect(inventoryPage.cartBadge).toHaveText('1');

        await page.screenshot({
          path: './evidencias/clase07-estado-despues.png',
          fullPage: true
        });

        console.log(
          'Estado antes/después comparado: el badge pasó de 0 a 1 producto'
        );
      }
    );

  }
);
