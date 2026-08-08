# QA Playwright - Curso 048

Aseguramiento de la Calidad del Software · Universidad Mariano Gálvez de Guatemala
Clase 3 · Niveles, Tipos y Casos de Prueba + Locators en Playwright

## Datos del estudiante

- **Nombre:** Teddy Leonardo Hernández Pérez
- **Carné:** 1790-22-2563
- **Versión de Node.js:** v24.14.1

## Proyecto

Suite de pruebas automatizadas end-to-end con [Playwright](https://playwright.dev/) + TypeScript sobre la aplicación demo [DemoBlaze](https://www.demoblaze.com).

### Tests incluidos

`tests/clase01.spec.ts`

1. **La página carga** — verifica el título de la página y que la barra de navegación sea visible.
2. **El menú de categorías es visible** — verifica el elemento `#cat`.
3. **La barra de navegación tiene los enlaces** — verifica los enlaces Home, Contact, About us, Cart, Log in y Sign up.

`tests/clase02.spec.ts`

4. **Navegar al carrito y regresar al inicio** — navega al carrito, captura evidencia y regresa a la página principal.
5. **Navegar a la categoría Phones y ver un producto** — lista productos de la categoría, entra al detalle y verifica el botón "Add to cart".
6. **Capturar el navbar y el footer por separado** — genera capturas independientes del navbar y del footer.
7. **Verificar tiempo de carga de la página** — mide el tiempo de `goto` + `waitForLoadState('load')` y valida que sea menor a 10s.

`tests/clase03.spec.ts`

8. **Locator por texto** — verifica los enlaces del menú (Home, Contact, About us, Cart) con `getByText`.
9. **Locator por CSS** — cuenta las tarjetas de producto y lee el nombre del primero con `.card` / `.card-title a`.
10. **Locator por ID** — verifica los campos del modal de login (`#loginusername`, `#loginpassword`).
11. **Locator por atributo** — verifica la imagen del producto y lee su atributo `src`.
12. **Locators encadenados** — busca el precio únicamente dentro de la primera tarjeta.
13. **Negación** — verifica que el mensaje "No products found" NO esté visible.
14. **Reto — Locator por rol** — verifica el botón "Place Order" del carrito con `getByRole('button', { name: ... })`.
15. **Reto — Locator con `filter()`** — encuentra el producto "Samsung galaxy s6" entre varios y lee su precio.
16. **Reto — Locator por atributo parcial** — verifica las 3 categorías del sidebar (Phones, Laptops, Monitors) mediante `[onclick^="byCat"]`.

## Casos de prueba

`casos-de-prueba/TC-001.md` — caso de prueba documentado para "Agregar un producto al carrito", con precondición, pasos, datos de prueba y resultado esperado.

## Cómo ejecutar

```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

## Resultado de los tests

16 de 16 tests pasando:

![Tests pasando](docs/tests-passing.png)
