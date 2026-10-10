import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Regression Tests - Sauce Demo', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');
    await expect(page).toHaveURL(/inventory/);
  });

  test('Ordenamiento A-Z funciona', { tag: '@regression' }, async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('az');
    const nombres = await page.locator('.inventory_item_name').allTextContents();
    const ordenados = [...nombres].sort((a, b) => a.localeCompare(b));
    expect(nombres).toEqual(ordenados);
  });

  test('Ordenamiento Z-A funciona', { tag: '@regression' }, async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    const nombres = await page.locator('.inventory_item_name').allTextContents();
    const ordenados = [...nombres].sort((a, b) => a.localeCompare(b)).reverse();
    expect(nombres).toEqual(ordenados);
  });

  test('Precio de menor a mayor funciona', { tag: '@regression' }, async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const precios = await page.locator('.inventory_item_price').allTextContents();
    const numericos = precios.map(p => parseFloat(p.replace('$', '')));
    for (let i = 0; i < numericos.length - 1; i++) {
      expect(numericos[i]).toBeLessThanOrEqual(numericos[i + 1]);
    }
  });

  test('El boton "Remove" aparece despues de agregar al carrito', { tag: '@regression' }, async ({ page }) => {
    const boton = page.locator('.btn_inventory').first();
    await expect(boton).toHaveText('Add to cart');
    await boton.click();
    await expect(boton).toHaveText('Remove');
    await boton.click();
    await expect(boton).toHaveText('Add to cart');
  });

  test('Navegar al detalle del producto y regresar', { tag: '@regression' }, async ({ page }) => {
    const primerProducto = page.locator('.inventory_item_name').first();
    const nombre = await primerProducto.textContent();
    await primerProducto.click();
    await expect(page).toHaveURL(/inventory-item/);
    await expect(page.locator('.inventory_details_name')).toContainText(nombre!);
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory/);
  });

});
