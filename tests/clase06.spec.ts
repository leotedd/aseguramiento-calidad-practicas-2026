import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe(
  'Clase 06 - Page Object Model en Sauce Demo',
  () => {

    // =========================================================
    // TEST 1 - LOGIN EXITOSO
    // =========================================================
    test(
      'Login exitoso con POM',
      async ({ page }) => {

        const loginPage = new LoginPage(page);

        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        const inventoryPage =
          new InventoryPage(page);

        await inventoryPage
          .expectToBeOnInventoryPage();

        console.log(
          'Login con POM exitoso'
        );
      }
    );


    // =========================================================
    // TEST 2 - LOGIN FALLIDO
    // =========================================================
    test(
      'Login fallido con POM',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        await loginPage.navigate();

        await loginPage.login(
          'wrong_user',
          'wrong_pass'
        );

        await loginPage.expectLoginError(
          'Username and password do not match'
        );

        console.log(
          'Error de login capturado con POM'
        );
      }
    );


    // =========================================================
    // TEST 3 - FLUJO COMPLETO
    // =========================================================
    test(
      'Flujo completo: login -> agregar 2 productos -> verificar carrito',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        const inventoryPage =
          new InventoryPage(page);

        const cartPage =
          new CartPage(page);


        // LOGIN
        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        await inventoryPage
          .expectToBeOnInventoryPage();


        // AGREGAR PRIMER PRODUCTO
        await inventoryPage.addProductByName(
          'Sauce Labs Backpack'
        );


        // AGREGAR SEGUNDO PRODUCTO
        await inventoryPage.addProductByName(
          'Sauce Labs Bike Light'
        );


        // VERIFICAR BADGE DEL CARRITO
        await expect(
          inventoryPage.cartBadge
        ).toHaveText('2');


        // IR AL CARRITO
        await inventoryPage.goToCart();


        // VERIFICAR 2 PRODUCTOS
        await cartPage.expectItemCount(2);


        console.log(
          'Flujo completo con POM: 2 productos en carrito'
        );
      }
    );


    // =========================================================
    // TEST 4 - VERIFICAR INVENTARIO
    // =========================================================
    test(
      'Verificar que el inventario tiene 6 productos',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        const inventoryPage =
          new InventoryPage(page);


        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );


        const count =
          await inventoryPage
            .getProductCount();


        expect(count).toBe(6);
      }
    );


    // =========================================================
    // TEST 5 - ORDENAR PRECIOS
    // =========================================================
    test(
      'Ordenar productos de mayor a menor precio',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        const inventoryPage =
          new InventoryPage(page);


        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );


        // ORDENAR DE MAYOR A MENOR
        await inventoryPage.sortBy('hilo');


        const precios =
          page.locator(
            '.inventory_item_price'
          );


        const todosLosPrecios =
          await precios.allTextContents();


        const numericos =
          todosLosPrecios.map(
            p =>
              parseFloat(
                p.replace('$', '')
              )
          );


        // VERIFICAR ORDEN DESCENDENTE
        for (
          let i = 0;
          i < numericos.length - 1;
          i++
        ) {

          expect(
            numericos[i]
          ).toBeGreaterThanOrEqual(
            numericos[i + 1]
          );
        }
      }
    );

  }
);