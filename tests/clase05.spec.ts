import { test, expect } from '@playwright/test';

test.describe(
  'Clase 05 - Assertions y técnicas de diseño de pruebas en Sauce Demo',
  () => {

    // =========================================================
    // TEST 1
    // =========================================================
    test(
      'CE válida: login con credenciales correctas',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        // Debemos llegar al inventario
        await expect(page).toHaveURL(/inventory/);

        await expect(
          page.locator('.inventory_container')
        ).toBeVisible();

        console.log('CE válida: login exitoso');
      }
    );


    // =========================================================
    // TEST 2
    // =========================================================
    test(
      'CE inválida: usuario no existe',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('usuario_inexistente');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        const errorMsg = page.locator(
          '[data-test="error"]'
        );

        // Debe aparecer mensaje de error
        await expect(errorMsg).toBeVisible();

        await expect(errorMsg).toContainText(
          'Username and password do not match'
        );

        // No debemos llegar al inventario
        await expect(page).not.toHaveURL(/inventory/);
      }
    );


    // =========================================================
    // TEST 3
    // =========================================================
    test(
      'CE inválida: usuario bloqueado',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('locked_out_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        const errorMsg = page.locator(
          '[data-test="error"]'
        );

        await expect(errorMsg).toBeVisible();

        await expect(errorMsg).toContainText(
          'locked out'
        );

        console.log(
          'CE usuario bloqueado: mensaje correcto mostrado'
        );
      }
    );


    // =========================================================
    // TEST 4
    // =========================================================
    test(
      'Valor en frontera: campos vacíos (frontera de longitud mínima)',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        // No llenar ningún campo
        await page
          .locator('#login-button')
          .click();

        const errorMsg = page.locator(
          '[data-test="error"]'
        );

        await expect(errorMsg).toBeVisible();

        await expect(errorMsg).toContainText(
          'Username is required'
        );

        console.log(
          'Valor frontera: campo vacío maneja error correctamente'
        );
      }
    );


    // =========================================================
    // TEST 5
    // =========================================================
    test(
      'Verificar que el inventario tiene exactamente 6 productos',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('standard_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        await expect(page).toHaveURL(/inventory/);

        const productos = page.locator(
          '.inventory_item'
        );

        // Assertion exacta de cantidad
        await expect(productos).toHaveCount(6);

        console.log(
          'El inventario tiene exactamente 6 productos'
        );
      }
    );


    // =========================================================
    // TEST 6
    // =========================================================
    test(
      'Verificar precio del primer producto con regex',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('standard_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        await expect(page).toHaveURL(/inventory/);

        const textoPrecio = await page
          .locator('.inventory_item_price')
          .first()
          .textContent();

        // Valida formato $XX.XX
        expect(
          textoPrecio?.trim()
        ).toMatch(/^\$\d+\.\d{2}$/);
      }
    );


    // =========================================================
    // TEST 7
    // =========================================================
    test(
      'Verificar atributos y estados de los elementos del inventario',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('standard_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        await expect(page).toHaveURL(/inventory/);

        const primerBoton = page
          .locator('.btn_inventory')
          .first();

        await expect(
          primerBoton
        ).toBeEnabled();

        await expect(
          primerBoton
        ).toHaveText('Add to cart');

        // Agregar producto
        await primerBoton.click();

        // El botón debe cambiar a Remove
        await expect(
          primerBoton
        ).toHaveText('Remove');

        const badgeCarrito = page.locator(
          '.shopping_cart_badge'
        );

        await expect(
          badgeCarrito
        ).toBeVisible();

        await expect(
          badgeCarrito
        ).toHaveText('1');

        console.log(
          'El botón cambia de estado y el carrito se actualiza'
        );
      }
    );


    // =========================================================
    // TEST 8
    // =========================================================
    test(
      'Verificar múltiples propiedades del primer producto con soft assertions',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('standard_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        const primerProducto = page
          .locator('.inventory_item')
          .first();

        // Las soft assertions continúan aunque alguna falle
        await expect.soft(
          primerProducto.locator(
            '.inventory_item_name'
          )
        ).toBeVisible();

        await expect.soft(
          primerProducto.locator(
            '.inventory_item_desc'
          )
        ).toBeVisible();

        await expect.soft(
          primerProducto.locator(
            '.inventory_item_price'
          )
        ).toBeVisible();

        await expect.soft(
          primerProducto.locator(
            '.btn_inventory'
          )
        ).toBeEnabled();

        await expect.soft(
          primerProducto.locator('img')
        ).toBeVisible();

        console.log(
          'Soft assertions del primer producto completadas'
        );
      }
    );


    // =========================================================
    // TEST 9
    // TABLA DE DECISIÓN - REGLA 1
    // =========================================================
    test(
      'Tabla de decisión - Regla 1: logueado con items -> puede pagar',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        // Login
        await page
          .locator('#user-name')
          .fill('standard_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        // Agregar producto
        await page
          .locator('.btn_inventory')
          .first()
          .click();

        // Ir al carrito
        await page
          .locator('.shopping_cart_link')
          .click();

        await expect(page).toHaveURL(/cart/);

        const btnCheckout = page.getByText(
          'Checkout'
        );

        await expect(
          btnCheckout
        ).toBeVisible();

        await expect(
          btnCheckout
        ).toBeEnabled();
      }
    );


    // =========================================================
    // TEST 10
    // TABLA DE DECISIÓN - REGLA 2
    // =========================================================
    test(
      'Tabla de decisión - Regla 2: logueado sin items -> carrito vacío',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('standard_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        // Ir al carrito sin agregar productos
        await page
          .locator('.shopping_cart_link')
          .click();

        const itemsCarrito = page.locator(
          '.cart_item'
        );

        // Debe haber cero productos
        await expect(
          itemsCarrito
        ).toHaveCount(0);
      }
    );


    // =========================================================
    // TEST 11
    // TABLA DE DECISIÓN - REGLA 3
    // =========================================================
    test(
      'Tabla de decisión - Regla 3: acceso al checkout sin iniciar sesión',
      async ({ page }) => {

        // Intentar entrar directamente sin login
        await page.goto(
          'https://www.saucedemo.com/checkout-step-one.html'
        );

        console.log(
          'URL final sin sesión:',
          page.url()
        );

        // SauceDemo regresa al login
        await expect(page).toHaveURL(
          'https://www.saucedemo.com/'
        );

        const errorMsg = page.locator(
          '[data-test="error"]'
        );

        await expect(
          errorMsg
        ).toBeVisible();

        console.log(
          'Mensaje mostrado:',
          await errorMsg.textContent()
        );
      }
    );


    // =========================================================
    // TEST 12
    // TABLA DE DECISIÓN - REGLA 4
    // =========================================================
    test(
      'Tabla de decisión - Regla 4: checkout con carrito vacío',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('standard_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        // Ir al carrito sin agregar productos
        await page
          .locator('.shopping_cart_link')
          .click();

        const itemsCarrito = page.locator(
          '.cart_item'
        );

        await expect(
          itemsCarrito
        ).toHaveCount(0);

        // SauceDemo permite presionar Checkout
        await page
          .getByText('Checkout')
          .click();

        // Comprobar el comportamiento real
        await expect(page).toHaveURL(
          /checkout-step-one/
        );

        console.log(
          'URL después de checkout con carrito vacío:',
          page.url()
        );
      }
    );


    // =========================================================
    // TEST 13
    // TABLA DE DECISIÓN - REGLA 5
    // =========================================================
    test(
      'Tabla de decisión - Regla 5: formulario de checkout vacío',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('standard_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        // Agregar producto
        await page
          .locator('.btn_inventory')
          .first()
          .click();

        // Ir al carrito
        await page
          .locator('.shopping_cart_link')
          .click();

        // Iniciar checkout
        await page
          .getByText('Checkout')
          .click();

        await expect(page).toHaveURL(
          /checkout-step-one/
        );

        // No llenar ningún campo
        await page
          .locator('#continue')
          .click();

        const errorMsg = page.locator(
          '[data-test="error"]'
        );

        await expect(
          errorMsg
        ).toBeVisible();

        await expect(
          errorMsg
        ).toContainText(
          'First Name is required'
        );

        console.log(
          'Error con formulario vacío:',
          await errorMsg.textContent()
        );
      }
    );


    // =========================================================
    // TEST 14
    // TABLA DE DECISIÓN - REGLA 6
    // =========================================================
    test(
      'Tabla de decisión - Regla 6: verificar errores según campo faltante',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('standard_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        // Agregar producto
        await page
          .locator('.btn_inventory')
          .first()
          .click();

        // Ir al carrito
        await page
          .locator('.shopping_cart_link')
          .click();

        await page
          .getByText('Checkout')
          .click();

        const errorMsg = page.locator(
          '[data-test="error"]'
        );

        // -------------------------
        // CASO 1: falta First Name
        // -------------------------
        await page
          .locator('#last-name')
          .fill('Hernandez');

        await page
          .locator('#postal-code')
          .fill('01001');

        await page
          .locator('#continue')
          .click();

        await expect(
          errorMsg
        ).toContainText(
          'First Name is required'
        );

        console.log(
          'Error cuando falta First Name:',
          await errorMsg.textContent()
        );


        // -------------------------
        // CASO 2: falta Last Name
        // -------------------------
        await page
          .locator('#first-name')
          .fill('Teddy');

        await page
          .locator('#last-name')
          .fill('');

        await page
          .locator('#continue')
          .click();

        await expect(
          errorMsg
        ).toContainText(
          'Last Name is required'
        );

        console.log(
          'Error cuando falta Last Name:',
          await errorMsg.textContent()
        );


        // -------------------------
        // CASO 3: falta Postal Code
        // -------------------------
        await page
          .locator('#last-name')
          .fill('Hernandez');

        await page
          .locator('#postal-code')
          .fill('');

        await page
          .locator('#continue')
          .click();

        await expect(
          errorMsg
        ).toContainText(
          'Postal Code is required'
        );

        console.log(
          'Error cuando falta Postal Code:',
          await errorMsg.textContent()
        );
      }
    );


    // =========================================================
    // TEST 15 - RETO 1
    // ASSERTION: toHaveValue()
    // =========================================================
    test(
      'Reto 1 - toHaveValue(): ordenar productos por precio',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('standard_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        await expect(page).toHaveURL(
          /inventory/
        );

        const selectorOrden = page.locator(
          '[data-test="product-sort-container"]'
        );

        // Ordenar de precio menor a mayor
        await selectorOrden.selectOption(
          'lohi'
        );

        // RETO: comprobar el value seleccionado
        await expect(
          selectorOrden
        ).toHaveValue('lohi');

        // Comprobar el nuevo primer precio
        const primerPrecio = page
          .locator('.inventory_item_price')
          .first();

        await expect(
          primerPrecio
        ).toHaveText('$7.99');

        console.log(
          'Reto 1: productos ordenados de menor a mayor correctamente'
        );
      }
    );


    // =========================================================
    // TEST 16 - RETO 2
    // ASSERTION: toBeFocused()
    // =========================================================
    test(
      'Reto 2 - toBeFocused(): campo usuario recibe el foco',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        const campoUsuario = page.locator(
          '#user-name'
        );

        // Dar clic al campo
        await campoUsuario.click();

        // RETO: verificar que recibió el foco
        await expect(
          campoUsuario
        ).toBeFocused();

        console.log(
          'Reto 2: el campo de usuario recibió correctamente el foco'
        );
      }
    );


    // =========================================================
    // TEST 17 - RETO 3
    // ASSERTION: toHaveCSS()
    // =========================================================
    test(
      'Reto 3 - toHaveCSS(): verificar cursor del botón Add to cart',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page
          .locator('#user-name')
          .fill('standard_user');

        await page
          .locator('#password')
          .fill('secret_sauce');

        await page
          .locator('#login-button')
          .click();

        await expect(page).toHaveURL(
          /inventory/
        );

        const botonAgregar = page
          .locator('.btn_inventory')
          .first();

        await expect(
          botonAgregar
        ).toBeVisible();

        // RETO: verificar propiedad CSS computada
        await expect(
          botonAgregar
        ).toHaveCSS(
          'cursor',
          'pointer'
        );

        console.log(
          'Reto 3: el botón Add to cart tiene cursor pointer'
        );
      }
    );

  }
);