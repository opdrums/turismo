import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import colecciones from '../pageObjectModel/web/coleciones';


const path = require('path');
const { chromium } = require('playwright');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/web/colecciones.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));
dotenv.config();

test.describe('como automatizador quiero hacer los flujos de colecciones', () => {
    let accion = 'no'

    test.afterEach(async ({ page }) => {
        await page.close()
    })
    
    
    test('crear una coleccion de forma exitosa y visualizacion del tour', async ({page}) => {       
        const isHeadless = !!process.env.CI;
        const browser = await chromium.launch({ headless: isHeadless });
        const context = await browser.newContext();
        const view1 = await context.newPage();
        const coleccion = new colecciones();

        await test.step('formulario de colleciones', async () => {
            await page.close();
            await coleccion.abrirVistas(view1);
            await coleccion.formularioColeccion(view1, variables)
        })
        
        await test.step('crear colleccion', async () => {
            await coleccion.crearColecion(view1)
        });

        await test.step('publicar una colleccion', async () => {
            await coleccion.publicarColeccion(view1)
        }) 

        await test.step('agregar al tour el tag de la colleccion y visualizar la coleccion', async () => {
            await coleccion.abrirVistas(view1);
            await coleccion.agregarTagEnTour(view1, 1)
        })

       await test.step('validacion del tour agregado a la coleccion', async () => {
            await coleccion.visualizarTour(view1)   
            await coleccion.validacionTour(context)
        })
    })    
    
    test('eliminar una coleccion', async ({ page }) => {
        const coleccion = new colecciones(page);
        await test.step('ingresar al modulo de coleccion', async () => {
            await page.goto(`${process.env.baseUrlWebAdmin}`)
            await page.getByRole('link', { name: ' Colecciones' }).click();
        })

        await test.step('eliminar una coleccion', async () => {
          await coleccion.eliminarColeccion(accion, 2, test)
        })
    })

    test('despublicar una coleccion', async ({ page }) => {
        const coleccion = new colecciones(page);
        await test.step('ingresar al modulo de coleccion', async () => {
            await page.goto(`${process.env.baseUrlWebAdmin}`)
            await page.getByRole('link', { name: ' Colecciones' }).click();
        })

        await test.step('despublicar una coleccion', async () => {
            await coleccion.despublicarColeccion(accion, 2, test)
        })
    })

    test('validacion de campos vacios', async ({ page }) => {
        const coleccion = new colecciones(page);
        await test.step('ingresar al modulo de coleccion', async () => {
            await page.goto(`${process.env.baseUrlWebAdmin}`)
            await page.getByRole('link', { name: ' Colecciones' }).click();
        })

        await test.step('campos vacios', async () => {
            await coleccion.validacionCamposVacios()
        })  
    }) 
})


