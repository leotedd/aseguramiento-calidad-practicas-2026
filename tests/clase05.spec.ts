import { test, expect } from '@playwright/test';

test.describe(
  'Clase 05 - Assertions y técnicas de diseño de pruebas en Sauce Demo',
  () => {

    // TEST 1
    test('CE válida: login con credenciales correctas', async ({ page }) => {
      await page.goto('https://www.saucedemo.com');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      // Assertion: debemos llegar al inventario
      await expect(page).toHaveURL(/inventory/);

      await expect(
        page.locator('.inventory_container')
      ).toBeVisible();

      console.log('CE válida: login exitoso');
    });


    // TEST 2
    test('CE inválida: usuario no existe', async ({ page }) => {
      await page.goto('https://www.saucedemo.com');

      await page.locator('#user-name').fill('usuario_inexistente');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      // Assertion: debe aparecer mensaje de error
      const errorMsg = page.locator('[data-test="error"]');

      await expect(errorMsg).toBeVisible();

      await expect(errorMsg)
        .toContainText('Username and password do not match');

      // Assertion: NO debemos haber navegado al inventario
      await expect(page).not.toHaveURL(/inventory/);
    });


    // TEST 3
    test('CE inválida: usuario bloqueado', async ({ page }) => {
      await page.goto('https://www.saucedemo.com');

      await page.locator('#user-name').fill('locked_out_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      const errorMsg = page.locator('[data-test="error"]');

      await expect(errorMsg).toBeVisible();
      await expect(errorMsg).toContainText('locked out');

      console.log('CE usuario bloqueado: mensaje correcto mostrado');
    });


    // TEST 4
    test(
      'Valor en frontera: campos vacíos (frontera de longitud mínima)',
      async ({ page }) => {
        await page.goto('https://www.saucedemo.com');

        // No llenar nada y hacer clic
        await page.locator('#login-button').click();

        const errorMsg = page.locator('[data-test="error"]');

        await expect(errorMsg).toBeVisible();
        await expect(errorMsg).toContainText('Username is required');

        console.log(
          'Valor frontera: campo vacío maneja error correctamente'
        );
      }
    );


    // TEST 5
    test(
      'Verificar que el inventario tiene exactamente 6 productos',
      async ({ page }) => {
        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        await expect(page).toHaveURL(/inventory/);

        // Contar productos con assertion exacta
        const productos = page.locator('.inventory_item');

        await expect(productos).toHaveCount(6);

        console.log(
          'El inventario tiene exactamente 6 productos'
        );
      }
    );


    // TEST 6
    test(
      'Verificar precio del primer producto con regex',
      async ({ page }) => {
        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        await expect(page).toHaveURL(/inventory/);

        const textoPrecio = await page
          .locator('.inventory_item_price')
          .first()
          .textContent();

        // El regex valida el formato $XX.XX
        expect(textoPrecio?.trim())
          .toMatch(/^\$\d+\.\d{2}$/);
      }
    );


    // TEST 7
    test(
      'Verificar atributos y estados de los elementos del inventario',
      async ({ page }) => {
        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        await expect(page).toHaveURL(/inventory/);

        const primerBoton = page
          .locator('.btn_inventory')
          .first();

        await expect(primerBoton).toBeEnabled();
        await expect(primerBoton).toHaveText('Add to cart');

        // Clic y verificar que cambió a Remove
        await primerBoton.click();

        await expect(primerBoton).toHaveText('Remove');

        // Verificar que el carrito muestra 1 item
        const badgeCarrito = page.locator(
          '.shopping_cart_badge'
        );

        await expect(badgeCarrito).toBeVisible();
        await expect(badgeCarrito).toHaveText('1');

        console.log(
          'El botón cambia de estado y el carrito se actualiza'
        );
      }
    );


    // TEST 8
    test(
      'Verificar múltiples propiedades del primer producto con soft assertions',
      async ({ page }) => {
        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        const primerProducto = page
          .locator('.inventory_item')
          .first();

        // Con soft assertions, si una falla, las demás siguen
        await expect.soft(
          primerProducto.locator('.inventory_item_name')
        ).toBeVisible();

        await expect.soft(
          primerProducto.locator('.inventory_item_desc')
        ).toBeVisible();

        await expect.soft(
          primerProducto.locator('.inventory_item_price')
        ).toBeVisible();

        await expect.soft(
          primerProducto.locator('.btn_inventory')
        ).toBeEnabled();

        await expect.soft(
          primerProducto.locator('img')
        ).toBeVisible();

        console.log(
          'Soft assertions del primer producto completadas'
        );
      }
    );


    // TEST 9
    test(
      'Tabla de decisión - Regla 1: logueado con items -> puede pagar',
      async ({ page }) => {

        // Login
        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        // Agregar item
        await page
          .locator('.btn_inventory')
          .first()
          .click();

        // Ir al carrito
        await page
          .locator('.shopping_cart_link')
          .click();

        await expect(page).toHaveURL(/cart/);

        // Debe existir el botón de checkout
        const btnCheckout = page.getByText('Checkout');

        await expect(btnCheckout).toBeVisible();
        await expect(btnCheckout).toBeEnabled();
      }
    );


    // TEST 10
    test(
      'Tabla de decisión - Regla 2: logueado sin items -> carrito vacío',
      async ({ page }) => {
        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        // Ir al carrito sin agregar nada
        await page
          .locator('.shopping_cart_link')
          .click();

        // El carrito debe estar vacío
        const itemsCarrito = page.locator('.cart_item');

        await expect(itemsCarrito).toHaveCount(0);
      }
    );

// TEST 11
test(
  'Tabla de decisión - Regla 3: acceso al checkout sin iniciar sesión',
  async ({ page }) => {

    // Intentar acceder directamente al checkout sin hacer login
    await page.goto(
      'https://www.saucedemo.com/checkout-step-one.html'
    );

    // Mostrar la URL final para comprobar el comportamiento real
    console.log('URL final sin sesión:', page.url());

    // SauceDemo debe impedir el acceso al checkout
    await expect(page).toHaveURL(
      'https://www.saucedemo.com/'
    );

    // Debe mostrar un mensaje de error
    const errorMsg = page.locator('[data-test="error"]');

    await expect(errorMsg).toBeVisible();

    console.log(
      'Mensaje mostrado:',
      await errorMsg.textContent()
    );
  }
);


// TEST 12
test(
  'Tabla de decisión - Regla 4: checkout con carrito vacío',
  async ({ page }) => {

    // Login
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Ir al carrito SIN agregar productos
    await page.locator('.shopping_cart_link').click();

    // Confirmar que realmente está vacío
    const itemsCarrito = page.locator('.cart_item');

    await expect(itemsCarrito).toHaveCount(0);

    // Hacer clic en Checkout
    await page.getByText('Checkout').click();

    // Mostrar qué hace realmente SauceDemo
    console.log(
      'URL después de checkout con carrito vacío:',
      page.url()
    );
  }
);


// TEST 13
test(
  'Tabla de decisión - Regla 5: formulario de checkout vacío',
  async ({ page }) => {

    // Login
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Agregar producto
    await page.locator('.btn_inventory').first().click();

    // Ir al carrito
    await page.locator('.shopping_cart_link').click();

    // Iniciar checkout
    await page.getByText('Checkout').click();

    await expect(page).toHaveURL(/checkout-step-one/);

    // No llenar ningún campo y presionar Continue
    await page.locator('#continue').click();

    // Obtener el mensaje real
    const errorMsg = page.locator('[data-test="error"]');

    await expect(errorMsg).toBeVisible();

    console.log(
      'Error con formulario vacío:',
      await errorMsg.textContent()
    );
  }
);


// TEST 14
test(
  'Tabla de decisión - Regla 6: verificar errores según campo faltante',
  async ({ page }) => {

    // Login
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Agregar producto
    await page.locator('.btn_inventory').first().click();

    // Ir al carrito y comenzar checkout
    await page.locator('.shopping_cart_link').click();
    await page.getByText('Checkout').click();

    // CASO 1: falta First Name
    await page.locator('#last-name').fill('Hernandez');
    await page.locator('#postal-code').fill('01001');

    await page.locator('#continue').click();

    const errorMsg = page.locator('[data-test="error"]');

    console.log(
      'Error cuando falta First Name:',
      await errorMsg.textContent()
    );

    // CASO 2: falta Last Name
    await page.locator('#first-name').fill('Teddy');
    await page.locator('#last-name').fill('');

    await page.locator('#continue').click();

    console.log(
      'Error cuando falta Last Name:',
      await errorMsg.textContent()
    );

    // CASO 3: falta Postal Code
    await page.locator('#last-name').fill('Hernandez');
    await page.locator('#postal-code').fill('');

    await page.locator('#continue').click();

    console.log(
      'Error cuando falta Postal Code:',
      await errorMsg.textContent()
    );
  }
);



  }
);