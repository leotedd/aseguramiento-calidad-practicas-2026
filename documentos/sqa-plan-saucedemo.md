# SQA Plan mínimo - Sauce Demo

## 1. Propósito

Verificar las funciones críticas de Sauce Demo (login, inventario, carrito y checkout) antes de considerar el sistema listo para el usuario final.

## 2. Alcance

Se prueba: login (usuarios estándar, bloqueado y de rendimiento degradado), inventario, carrito, checkout y logout. No se prueba: pagos reales, backend/API, ni compatibilidad con navegadores distintos a Chromium.

## 3. Herramientas

Playwright + TypeScript.

## 4. Criterios de salida

Se considera listo cuando el 100% de los tests críticos (login, inventario, carrito y checkout) pasa sin fallos.
