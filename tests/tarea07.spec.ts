import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe(
  'Tarea 07 - Reportes profesionales con Playwright',
  () => {

    // =========================================================
    // RETO 1 - test.step()
    // =========================================================
    test(
      'Reto 1 - test.step(): login estructurado en pasos nombrados',
      async ({ page }) => {

        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await test.step('Navegar', async () => {
          await loginPage.navigate();
        });

        await test.step('Login', async () => {
          await loginPage.login(
            'standard_user',
            'secret_sauce'
          );
        });

        await test.step('Verificar', async () => {
          await inventoryPage.expectToBeOnInventoryPage();
        });
      }
    );


    // =========================================================
    // RETO 2 - testInfo.attach()
    // =========================================================
    test(
      'Reto 2 - testInfo.attach(): adjuntar información del inventario',
      async ({ page }, testInfo) => {

        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        await inventoryPage.expectToBeOnInventoryPage();

        const cantidadProductos =
          await inventoryPage.getProductCount();

        const info = {
          cantidadProductos,
          url: page.url(),
          fecha: new Date().toISOString()
        };

        await testInfo.attach('info-inventario', {
          body: JSON.stringify(info, null, 2),
          contentType: 'application/json'
        });

        console.log(
          `Información adjuntada al reporte: ${JSON.stringify(info)}`
        );
      }
    );


    // =========================================================
    // RETO 3 - toHaveScreenshot()
    // =========================================================
    test(
      'Reto 3 - toHaveScreenshot(): comparación visual del inventario',
      async ({ page }) => {

        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        await inventoryPage.expectToBeOnInventoryPage();

        // Primera ejecución: genera el baseline.
        // Ejecuciones siguientes: compara contra el baseline.
        await expect(page).toHaveScreenshot('clase07-inventario-visual.png', {
          fullPage: true
        });
      }
    );

  }
);
