import {test } from '@playwright/test'
import * as fs from 'fs'
import landings from '../pageObjectModel/tour_operacion/landings'

const path = require('path')
const { chromium } = require('playwright');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/landings.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))
let landing = new landings()

test.describe('Como automatizador quiero hacer flujos de landings', () => {
    let view1
    let view2
    let browser
    let context

    test.beforeEach(async ({ page }) => {
        const isHeadless = !! process.env.CI
        browser = await chromium.launch({ headless: isHeadless })
        context = await browser.newContext()
        view1 = await context.newPage()
        view2 = await context.newPage()
        await page.close()
        await landing.abrirVistas(view1, view2, variables)
        await landing.login(view1, variables)
    })

    test.afterEach(async ({ page }) => {
        await view1.context().cookies(variables.urlBase)
        await view1.context().clearCookies()
        await view1.close()
        await view2.close()
    })
    

    test('Creación de landing con componente de banner', async ({ page }) => {
        await test.step('Navegar al formulario de creación de landing', async () => {
            await landing.formulario(view1, variables)
            await landing.agregarComponente(view1)
        })

        await test.step('Configurar el banner del landing', async () => {
            await landing.formularioBanner(view1, variables)
            await landing.publicarLanding(view1)
        })
        
        await test.step('Verificar la creación del landing en la nueva web', async () => {
            await landing.ingresoLanding(view2)
        })
    })

    test('Creación de landing con componente de texto introductorio', async ({ page }) => {
        await test.step('Navegar al formulario de creación de landing', async () => {
            await landing.formulario(view1, variables)
            await landing.agregarComponente(view1)
        })

        await test.step('Configurar el componente de texto introductorio', async () => {
            await landing.formularioIntroText(view1, variables)
            await landing.publicarLanding(view1)
        })
        
        await test.step('Verificar la creación del landing en la nueva web', async () => {
            await landing.ingresoLanding(view2)
        })
    })

    test('Creación de landing con el componente de carrusel de tours', async ({ page }) => {
        await test.step('Navegar al formulario de creación de landing', async () => {
            await landing.formulario(view1, variables)
            await landing.agregarComponente(view1)
        })

        await test.step('Configurar el componente de carrusel de tours', async () => {
            await landing.formularioTourCarouserl(view1, variables)
            await landing.publicarLanding(view1)
        })
        
        await test.step('Verificar la creación del landing en la nueva web', async () => {
            await landing.ingresoLanding(view2)
        })
    })
    test('Validación de mensajes de error para campos obligatorios vacíos', async ({ page }) => {
        await test.step('Verificar mensajes de error en campos obligatorios vacíos en el formulario de landing', async () => {
            await landing.validacionCamposVacios(view1)
        })
    
        await test.step('Revisar mensajes de error al intentar enviar formulario con campos obligatorios sin completar', async () => {
            await landing.validacionCamposVacios(view1)
        })
    })    
})