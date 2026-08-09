# Tabla de Decisión - Proceso de Checkout

## Objetivo

Validar el comportamiento del proceso de checkout considerando diferentes combinaciones de autenticación, contenido del carrito, formulario de información y finalización de la compra.

## Tabla de decisión

| Condiciones / Reglas | R1 | R2 | R3 | R4 | R5 | R6 |
|---|---|---|---|---|---|---|
| Usuario autenticado | Sí | No | Sí | Sí | Sí | Sí |
| Carrito con items | Sí | — | No | Sí | Sí | Sí |
| Formulario de checkout completo | Sí | — | — | No | Sí | Sí |
| Clic en Finish | Sí | — | — | — | No | Sí |
| **Resultado esperado** | Compra completada | Acceso al checkout rechazado | Verificar comportamiento con carrito vacío | Mostrar mensaje de error | Permanecer en resumen del checkout | Compra completada |

## Descripción de las reglas

### Regla 1
El usuario está autenticado, tiene productos en el carrito, completa correctamente el formulario y hace clic en **Finish**.

**Resultado esperado:** La compra se completa correctamente.

### Regla 2
El usuario intenta acceder al checkout sin estar autenticado.

**Resultado esperado:** El sistema debe impedir el acceso al proceso de checkout.

### Regla 3
El usuario está autenticado, pero intenta realizar el checkout con el carrito vacío.

**Resultado esperado:** Se debe verificar el comportamiento real de la aplicación ante un carrito sin productos.

### Regla 4
El usuario está autenticado y tiene productos en el carrito, pero deja incompleto el formulario de checkout.

**Resultado esperado:** El sistema debe mostrar un mensaje de error indicando el campo requerido.

### Regla 5
El usuario completa correctamente los datos del checkout y llega al resumen de la compra, pero no hace clic en **Finish**.

**Resultado esperado:** La compra no se completa y el usuario permanece en el resumen del checkout.

### Regla 6
El usuario cumple todas las condiciones necesarias y finalmente hace clic en **Finish**.

**Resultado esperado:** El sistema muestra la confirmación de que la compra fue completada.