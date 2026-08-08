import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';

// Crear carpeta para evidencias
test.beforeAll(() => {
  fs.mkdirSync('./evidencias/clase04', {
    recursive: true
  });
});

// Usuario único para cada ejecución
const usuario = {
  username: `testuser_${Date.now().toString().slice(-6)}`,
  password: 'Password123'
};

// Iniciar sesión con varios intentos
async function loginConReintento(
  page: Page,
  username: string,
  password: string,
  intentos = 5
) {
  for (let i = 0; i < intentos; i++) {
    await page
      .locator('#navbarExample')
      .getByRole('link', {
        name: 'Log in',
        exact: true
      })
      .click();

    await page.waitForSelector('#logInModal', {
      state: 'visible'
    });

    await page.locator('#loginusername').fill(username);
    await page.locator('#loginpassword').fill(password);

    await page
      .locator('#logInModal')
      .getByRole('button', { name: 'Log in' })
      .click();

    try {
      await page.waitForSelector('#nameofuser', {
        state: 'visible',
        timeout: 4000
      });

      return;
    } catch {
      console.log(
        `Intento ${i + 1}/${intentos} sin éxito. Reintentando...`
      );

      // Cerrar el modal antes del siguiente intento
      if (await page.locator('#logInModal').isVisible()) {
        await page.keyboard.press('Escape');

        await page.waitForSelector('#logInModal', {
          state: 'hidden'
        });
      }

      await page.waitForTimeout(1500);
    }
  }

  throw new Error(
    `No se pudo iniciar sesión con ${username} después de ${intentos} intentos`
  );
}

// Ejecutar los tests en el orden escrito
test.describe.serial(
  'Clase 04 - Flujo completo de usuario en DemoBlaze',
  () => {

    // TEST 1: Registrar un usuario
    test('Registrar un nuevo usuario', async ({ page }) => {
      await page.goto('/');

      await page
        .locator('#navbarExample')
        .getByRole('link', {
          name: 'Sign up',
          exact: true
        })
        .click();

      await page.waitForSelector('#signInModal', {
        state: 'visible'
      });

      await page
        .locator('#sign-username')
        .fill(usuario.username);

      await page
        .locator('#sign-password')
        .fill(usuario.password);

      await page.locator('#signInModal').screenshot({
        path: './evidencias/clase04/01-registro-llenado.png'
      });

      const dialogPromise = new Promise<string>((resolve) => {
        page.once('dialog', async (dialog) => {
          const mensaje = dialog.message();

          await dialog.accept();
          resolve(mensaje);
        });
      });

      await page
        .locator('#signInModal')
        .getByRole('button', { name: 'Sign up' })
        .click();

      const mensajeRegistro = await dialogPromise;

      expect(mensajeRegistro).toContain('Sign up successful');

      console.log(`Mensaje recibido: ${mensajeRegistro}`);
      console.log(`Usuario registrado: ${usuario.username}`);
      console.log(`Contraseña: ${usuario.password}`);
    });

    // TEST 2: Login con el usuario registrado
    test('Login con el usuario registrado', async ({ page }) => {
      page.on('dialog', async (dialog) => {
        console.log(`Diálogo: ${dialog.message()}`);
        await dialog.accept();
      });

      await page.goto('/');

      await loginConReintento(
        page,
        usuario.username,
        usuario.password
      );

      const nombreUsuario = page.locator('#nameofuser');

      await expect(nombreUsuario).toBeVisible();
      await expect(nombreUsuario).toContainText(
        usuario.username
      );

      await page.screenshot({
        path: './evidencias/clase04/02-login-exitoso.png',
        fullPage: true
      });

      console.log(
        `Login exitoso como: ${await nombreUsuario.textContent()}`
      );
    });

    // TEST 3: Login, agregar producto y verificar carrito
    test(
      'Flujo completo: login -> agregar producto -> verificar carrito',
      async ({ page }) => {

        page.on('dialog', async (dialog) => {
          console.log(`Diálogo: ${dialog.message()}`);
          await dialog.accept();
        });

        await page.goto('/');

        await loginConReintento(
          page,
          usuario.username,
          usuario.password
        );

        await page.waitForSelector('.card-title a');

        const primerProducto = page
          .locator('.card-title a')
          .first();

        const nombreProducto =
          (await primerProducto.textContent())?.trim();

        await primerProducto.click();

        await page.waitForLoadState('domcontentloaded');

        await page
          .getByText('Add to cart', { exact: true })
          .click();

        // Esperar a que el backend registre el producto
        await page.waitForTimeout(2000);

        await page
          .locator('#navbarExample')
          .getByRole('link', {
            name: 'Cart',
            exact: true
          })
          .click();

        await page.waitForURL('**/cart.html');

        const itemsCarrito = page.locator('#tbodyid tr');

        await expect(itemsCarrito.first()).toBeVisible({
          timeout: 10000
        });

        const cantidadItems = await itemsCarrito.count();

        expect(cantidadItems).toBeGreaterThanOrEqual(1);
        await expect(itemsCarrito).toContainText(nombreProducto ?? '');

        await page.screenshot({
          path: './evidencias/clase04/03-carrito-con-producto.png',
          fullPage: true
        });

        console.log(
          `Producto "${nombreProducto}" agregado al carrito`
        );

        console.log(
          `Cantidad de productos: ${cantidadItems}`
        );
      }
    );

    // RETO 1: Intentar registrarse con un usuario existente
    test('Intentar registrarse con un usuario ya existente', async ({ page }) => {
      await page.goto('/');

      await page
        .locator('#navbarExample')
        .getByRole('link', {
          name: 'Sign up',
          exact: true
        })
        .click();

      await page.waitForSelector('#signInModal', {
        state: 'visible'
      });

      await page.locator('#sign-username').fill(usuario.username);
      await page.locator('#sign-password').fill(usuario.password);

      const dialogPromise = new Promise<string>((resolve) => {
        page.once('dialog', async (dialog) => {
          const mensaje = dialog.message();

          await dialog.accept();
          resolve(mensaje);
        });
      });

      await page
        .locator('#signInModal')
        .getByRole('button', { name: 'Sign up' })
        .click();

      const mensajeRegistroDuplicado = await dialogPromise;

      expect(mensajeRegistroDuplicado.toLowerCase()).toContain('exist');
    });

    // RETO 2: Cerrar sesión después de login exitoso
    test('Cerrar sesión tras login exitoso', async ({ page }) => {
      await page.goto('/');

      await loginConReintento(
        page,
        usuario.username,
        usuario.password
      );

      await page
        .locator('#navbarExample')
        .getByRole('link', {
          name: 'Log out',
          exact: true
        })
        .click();

      await expect(page.locator('#nameofuser')).not.toBeVisible();
      await expect(
        page.locator('#navbarExample').getByRole('link', {
          name: 'Log in',
          exact: true
        })
      ).toBeVisible();
    });

    // RETO 3: Verificar que el carrito contiene nombre y precio del producto agregado
    test('Verificar nombre y precio del producto en el carrito', async ({ page }) => {
      await page.goto('/');

      await loginConReintento(
        page,
        usuario.username,
        usuario.password
      );

      await page.waitForSelector('.card-title a');

      const primerProducto = page
        .locator('.card-title a')
        .first();

      const nombreProducto =
        (await primerProducto.textContent())?.trim();

      await primerProducto.click();
      await page.waitForLoadState('domcontentloaded');

      await page.getByText('Add to cart', { exact: true }).click();
      await page.waitForTimeout(2000);

      await page
        .locator('#navbarExample')
        .getByRole('link', {
          name: 'Cart',
          exact: true
        })
        .click();

      await page.waitForURL('**/cart.html');

      const itemCarrito = page.locator('#tbodyid tr').first();

      await expect(itemCarrito).toContainText(nombreProducto ?? '');

      const precioColumna = itemCarrito.locator('td').nth(1);
      await expect(precioColumna).toBeVisible();
      await expect(precioColumna).toHaveText(/\d+/);
    });

    // TEST 4: Login con credenciales incorrectas
    test(
      'Intentar login con credenciales incorrectas',
      async ({ page }) => {

        await page.goto('/');

        await page
          .locator('#navbarExample')
          .getByRole('link', {
            name: 'Log in',
            exact: true
          })
          .click();

        await page.waitForSelector('#logInModal', {
          state: 'visible'
        });

        await page
          .locator('#loginusername')
          .fill('usuario_que_no_existe');

        await page
          .locator('#loginpassword')
          .fill('password_incorrecta');

        const dialogPromise = new Promise<string>((resolve) => {
          page.once('dialog', async (dialog) => {
            const mensaje = dialog.message();

            await dialog.accept();
            resolve(mensaje);
          });
        });

        await page
          .locator('#logInModal')
          .getByRole('button', { name: 'Log in' })
          .click();

        const mensajeAlerta = await dialogPromise;

        expect(mensajeAlerta).toBeTruthy();

        await expect(
          page.locator('#nameofuser')
        ).not.toBeVisible();

        console.log(`Error mostrado: ${mensajeAlerta}`);
      }
    );

  }
);