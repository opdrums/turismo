import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import colecciones from '../pageObjectModel/web/coleciones';

const path = require('path');
const { chromium } = require('playwright');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/web/colecciones.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));
dotenv.config();

test.describe('Automatización de flujos para colecciones', () => {
    let accion = 'no';

    test.afterEach(async ({ page }) => {
        //await page.close();
    });
    
    test('Crear una colección exitosamente y visualizar el tour', async ({ page }) => {       
        const isHeadless = !!process.env.CI;
        const browser = await chromium.launch({ headless: isHeadless });
        const context = await browser.newContext();
        const view1 = await context.newPage();
        const coleccion = new colecciones();

        await test.step('Completar formulario de colección', async () => {
            await page.close();
            await coleccion.abrirVistas(view1);
            await coleccion.formularioColeccion(view1, variables);
        });
        
        await test.step('Crear la colección', async () => {
            await coleccion.crearColecion(view1);
        });

        await test.step('Publicar la colección', async () => {
            await coleccion.publicarColeccion(view1);
        });

        await test.step('Agregar el tag de la colección al tour y visualizar', async () => {
            await coleccion.abrirVistas(view1);
            await coleccion.agregarTagEnTour(view1, 1);
        });

        await test.step('Validar que el tour fue agregado a la colección', async () => {
            await coleccion.visualizarTour(view1);   
            await coleccion.validacionTour(context);
        });        
    });

    test('Eliminar una colección', async ({ page }) => {
        const coleccion = new colecciones(page);
        await test.step('Ingresar al módulo de colecciones', async () => {
            await page.goto(`${process.env.baseUrlWebAdmin}`);
            await page.getByRole('link', { name: ' Colecciones' }).click();
        });

        await test.step('Eliminar la colección seleccionada', async () => {
            await coleccion.eliminarColeccion(accion, 2, test);
        });
    });

    test('Despublicar una colección', async ({ page }) => {
        const coleccion = new colecciones(page);
        await test.step('Ingresar al módulo de colecciones', async () => {
            await page.goto(`${process.env.baseUrlWebAdmin}`);
            await page.getByRole('link', { name: ' Colecciones' }).click();
        });

        await test.step('Despublicar la colección seleccionada', async () => {
            await coleccion.despublicarColeccion(accion, 2, test);
        });
    });

    test('Validar campos vacíos', async ({ page }) => {
        const coleccion = new colecciones(page);
        await test.step('Ingresar al módulo de colecciones', async () => {
            await page.goto(`${process.env.baseUrlWebAdmin}`);
            await page.getByRole('link', { name: ' Colecciones' }).click();
        });

        await test.step('Verificar la validación de campos vacíos', async () => {
            await coleccion.validacionCamposVacios();
        });  
    }); 
});
