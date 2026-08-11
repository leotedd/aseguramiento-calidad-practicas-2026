# QA Playwright - Curso 048

Aseguramiento de la Calidad del Software · Universidad Mariano Gálvez de Guatemala

Prácticas de automatización de pruebas utilizando Playwright + TypeScript.

## Datos del estudiante

- **Nombre:** Teddy Leonardo Hernández Pérez
- **Carné:** 1790-22-2563
- **Versión de Node.js:** v24.14.1

## Proyecto

Suite de pruebas automatizadas end-to-end desarrolladas con Playwright y TypeScript.

Durante las prácticas se utilizan las aplicaciones:

- DemoBlaze
- SauceDemo

El proyecto incluye pruebas de navegación, locators, registro de usuarios,
inicio y cierre de sesión, carrito de compras, assertions, técnicas de diseño
de pruebas y tablas de decisión.

---

# Tests incluidos

## Clase 01

Archivo:

`tests/clase01.spec.ts`

1. **La página carga**  
   Verifica el título de la página y que la barra de navegación sea visible.

2. **El menú de categorías es visible**  
   Verifica que el elemento `#cat` esté disponible.

3. **La barra de navegación tiene los enlaces**  
   Verifica los enlaces Home, Contact, About us, Cart, Log in y Sign up.

---

## Clase 02

Archivo:

`tests/clase02.spec.ts`

4. **Navegar al carrito y regresar al inicio**  
   Navega al carrito, captura evidencia y regresa a la página principal.

5. **Navegar a la categoría Phones y ver un producto**  
   Lista productos de la categoría, entra al detalle y verifica el botón
   "Add to cart".

6. **Capturar el navbar y el footer por separado**  
   Genera capturas independientes del navbar y del footer.

7. **Verificar tiempo de carga de la página**  
   Mide el tiempo de carga utilizando `goto` y
   `waitForLoadState('load')` y valida que sea menor a 10 segundos.

---

## Clase 03 - Locators

Archivo:

`tests/clase03.spec.ts`

8. **Locator por texto**  
   Verifica los enlaces del menú utilizando `getByText`.

9. **Locator por CSS**  
   Cuenta las tarjetas de producto y obtiene el nombre del primer producto.

10. **Locator por ID**  
    Verifica los campos del modal de login.

11. **Locator por atributo**  
    Verifica la imagen del primer producto y obtiene su atributo `src`.

12. **Locators encadenados**  
    Busca el precio únicamente dentro de la primera tarjeta de producto.

13. **Negación**  
    Verifica que el mensaje "No products found" no esté visible.

14. **Reto - Locator por rol**  
    Verifica el botón "Place Order" utilizando `getByRole()`.

15. **Reto - Locator con `filter()`**  
    Encuentra el producto "Samsung galaxy s6" y obtiene su precio.

16. **Reto - Locator por atributo parcial**  
    Verifica las categorías Phones, Laptops y Monitors mediante
    `[onclick^="byCat"]`.

---

## Clase 04 - Flujo completo de usuario

Archivo:

`tests/clase04.spec.ts`

17. **Registrar un nuevo usuario**  
    Genera un usuario único y verifica que el registro sea exitoso.

18. **Login con el usuario registrado**  
    Inicia sesión con el usuario creado y verifica que aparezca correctamente
    en la página.

19. **Flujo completo: login → agregar producto → verificar carrito**  
    Inicia sesión, selecciona un producto, lo agrega al carrito y comprueba
    que aparezca correctamente.

20. **Reto - Intentar registrarse con un usuario ya existente**  
    Intenta registrar nuevamente el mismo usuario y valida el mensaje
    correspondiente.

21. **Reto - Cerrar sesión tras login exitoso**  
    Inicia sesión, cierra la sesión y verifica que vuelva a mostrarse
    la opción "Log in".

22. **Reto - Verificar nombre y precio del producto en el carrito**  
    Agrega un producto y comprueba que su nombre y precio estén presentes
    en el carrito.

23. **Login con credenciales incorrectas**  
    Intenta iniciar sesión con credenciales inválidas y verifica que el
    usuario no sea autenticado.

---

## Clase 05 - Assertions y técnicas de diseño de pruebas

Archivo:

`tests/clase05.spec.ts`

24. **CE válida: login con credenciales correctas**  
    Verifica que un usuario válido pueda iniciar sesión correctamente.

25. **CE inválida: usuario no existe**  
    Verifica el mensaje de error al utilizar un usuario inexistente.

26. **CE inválida: usuario bloqueado**  
    Comprueba el comportamiento del usuario `locked_out_user`.

27. **Valor en frontera: campos vacíos**  
    Verifica la validación cuando se intenta iniciar sesión sin ingresar
    credenciales.

28. **Verificar que el inventario tiene exactamente 6 productos**  
    Utiliza `toHaveCount()` para validar la cantidad de productos.

29. **Verificar precio del primer producto con regex**  
    Comprueba que el precio tenga el formato `$XX.XX`.

30. **Verificar atributos y estados de los elementos del inventario**  
    Comprueba el estado del botón "Add to cart", su cambio a "Remove" y
    la actualización del carrito.

31. **Soft assertions del primer producto**  
    Utiliza `expect.soft()` para verificar múltiples propiedades de un
    producto sin detener inmediatamente todas las validaciones.

### Tabla de decisión - Checkout

32. **Regla 1: usuario autenticado con items**  
    Verifica que un usuario autenticado con productos tenga disponible
    el proceso de checkout.

33. **Regla 2: usuario autenticado sin items**  
    Comprueba que el carrito se encuentre vacío cuando no se agregaron
    productos.

34. **Regla 3: acceso al checkout sin iniciar sesión**  
    Verifica que SauceDemo bloquee el acceso al checkout cuando el usuario
    no está autenticado.

35. **Regla 4: checkout con carrito vacío**  
    Comprueba el comportamiento real de SauceDemo al iniciar checkout
    sin productos en el carrito.

36. **Regla 5: formulario de checkout vacío**  
    Verifica el mensaje de error mostrado cuando no se completa la
    información requerida.

37. **Regla 6: errores según campo faltante**  
    Comprueba los mensajes correspondientes a First Name, Last Name y
    Postal Code cuando alguno de estos campos está vacío.

### Retos Clase 05

38. **Reto 1 - `toHaveValue()`**  
    Ordena los productos de menor a mayor precio, verifica que el selector
    tenga el valor `lohi` y comprueba que el primer precio sea `$7.99`.

39. **Reto 2 - `toBeFocused()`**  
    Hace clic en el campo de usuario y verifica que el elemento reciba
    correctamente el foco del teclado.

40. **Reto 3 - `toHaveCSS()`**  
    Verifica que el botón "Add to cart" tenga la propiedad CSS
    `cursor: pointer`.

---

# Casos de prueba

## TC-001

Archivo:

`casos-de-prueba/TC-001.md`

Caso de prueba documentado para **Agregar un producto al carrito**,
incluyendo:

- Precondiciones
- Pasos
- Datos de prueba
- Resultado esperado

## Tabla de decisión del checkout

Archivo:

`casos-de-prueba/tabla-decision-checkout.md`

Tabla de decisión del proceso de checkout de SauceDemo.

Incluye:

- Mínimo 4 condiciones
- 6 reglas
- Usuario autenticado
- Carrito con y sin productos
- Validaciones del formulario
- Comportamiento del checkout
- Mensajes de error según el campo obligatorio faltante

La tabla fue construida después de verificar el comportamiento real
de SauceDemo mediante pruebas automatizadas con Playwright.

---

# Cómo ejecutar el proyecto

## 1. Instalar dependencias

```bash
npm install

2. Instalar navegadores de Playwright
npx playwright install
3. Ejecutar todos los tests
npx playwright test
4. Ejecutar los tests mostrando el navegador
npx playwright test --headed
5. Ejecutar únicamente la Clase 05
npx playwright test tests/clase05.spec.ts
6. Ejecutar Clase 05 mostrando el navegador
npx playwright test tests/clase05.spec.ts --headed
7. Ejecutar únicamente los retos de Clase 05
npx playwright test tests/clase05.spec.ts --headed -g "Reto"
8. Mostrar la lista de tests de Clase 05
npx playwright test tests/clase05.spec.ts --list
9. Abrir el reporte HTML
npx playwright show-report
Resultado de las pruebas

Ejecución completa del proyecto:

npx playwright test

Resultado obtenido:

40 passed (45.8s)

Estado actual: 40 de 40 tests ejecutados correctamente.

También se verificaron individualmente los tres retos de la Clase 05:

3 passed (5.6s)

Y la ejecución completa de Clase 05:

17 passed (24.7s)
Tecnologías utilizadas
Playwright
TypeScript
Node.js
Visual Studio Code
Git
GitHub