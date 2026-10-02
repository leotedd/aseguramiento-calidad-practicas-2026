import { test as base, expect } from '../fixtures';

// Tarea 09 - Fixtures avanzados

type TareaFixtures = {
  cronometro: number;
};

type TareaWorkerFixtures = {
  contadorWorker: { valor: number };
};

const test = base.extend<TareaFixtures, TareaWorkerFixtures>({
  // Reto 1: fixture con setup ANTES y teardown DESPUÉS de use()
  cronometro: async ({}, use, testInfo) => {
    // Setup: iniciar el cronómetro
    const inicio = Date.now();
    console.log(`[setup] Cronómetro iniciado para: "${testInfo.title}"`);

    await use(inicio);

    // Teardown: se ejecuta al finalizar el test (incluso si falla)
    const duracion = Date.now() - inicio;
    console.log(`[teardown] "${testInfo.title}" tardó ${duracion} ms (estado: ${testInfo.status})`);
  },

  // Reto 2: fixture con alcance worker — se crea una sola vez por worker
  contadorWorker: [async ({}, use, workerInfo) => {
    const contador = { valor: 0 };
    console.log(`[worker ${workerInfo.workerIndex}] Contador creado`);
    await use(contador);
    console.log(`[worker ${workerInfo.workerIndex}] Contador final: ${contador.valor}`);
  }, { scope: 'worker' }],
});

// ==================================================
// RETO 1 — Fixture con teardown real
// ==================================================
test.describe('Tarea 09 - Reto 1: fixture con teardown', () => {

  test('Medir duración del login con el cronómetro',
    async ({ cronometro, inventoryPage }) => {
    expect(cronometro).toBeGreaterThan(0);
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

});

// ==================================================
// RETO 2 — Fixture de alcance worker
// ==================================================
test.describe('Tarea 09 - Reto 2: fixture de alcance worker', () => {
  // Serial: ambos tests corren en orden y en el mismo worker
  test.describe.configure({ mode: 'serial' });

  test('Primer test: el contador llega a 1', async ({ contadorWorker }) => {
    contadorWorker.valor++;
    console.log(`Contador en el primer test: ${contadorWorker.valor}`);
    expect(contadorWorker.valor).toBe(1);
  });

  test('Segundo test: el mismo contador llega a 2', async ({ contadorWorker }) => {
    contadorWorker.valor++;
    console.log(`Contador en el segundo test: ${contadorWorker.valor}`);
    expect(contadorWorker.valor).toBe(2);
  });

});

// ==================================================
// RETO 3 — test.use() + parametrización
// ==================================================
const viewports = [
  { nombre: 'móvil', viewport: { width: 375, height: 667 } },
  { nombre: 'escritorio', viewport: { width: 1280, height: 720 } },
];

for (const { nombre, viewport } of viewports) {
  test.describe(`Tarea 09 - Reto 3: viewport ${nombre}`, () => {
    test.use({ viewport });

    test(`Inventario visible en ${nombre}`, async ({ inventoryPage, page }) => {
      expect(page.viewportSize()).toEqual(viewport);
      await inventoryPage.expectToBeOnInventoryPage();
      const count = await inventoryPage.getProductCount();
      expect(count).toBe(6);
      console.log(`${nombre} (${viewport.width}x${viewport.height}): ${count} productos`);
    });
  });
}
