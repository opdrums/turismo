import {test } from '@playwright/test'
import * as fs from 'fs'
import landings from '../pageObjectModel/tour_operacion/landings'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/landings.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))

test.describe('Como automatizador quiero hacer flujos de landings', () => {
    test.beforeEach(async ({ page }) => {
        let landing = new landings(page)
        await landing.abrirVistas(variables)
        await landing.login(variables)
    })

    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlBase)
        await page.context().clearCookies()
        await page.close()
    })
    
    test('Creación de landing con componente de banner', async ({ page }) => {
        let landing = new landings(page)
        await test.step('Navegar al formulario de creación de landing', async () => {
            await landing.formulario(variables)
            await landing.agregarComponente()
        })

        await test.step('Configurar el banner del landing', async () => {
            await landing.formularioBanner(variables)
            await landing.publicarLanding()
        })
        
        await test.step('Verificar la creación del landing en la nueva web', async () => {
            await landing.ingresoLanding()
        })
    })

    test('Creación de landing con componente de texto introductorio', async ({ page }) => {
        let landing = new landings(page)
        await test.step('Navegar al formulario de creación de landing', async () => {
            await landing.formulario(variables)
            await landing.agregarComponente()
        })

        await test.step('Configurar el componente de texto introductorio', async () => {
            await landing.formularioIntroText(variables)
            await landing.publicarLanding()
        })
        
        await test.step('Verificar la creación del landing en la nueva web', async () => {
            await landing.ingresoLanding()
        })
    })

    test.skip('Creación de landing con el componente de carrusel de tours', async ({ page }) => {
        let landing = new landings(page)
        await test.step('Navegar al formulario de creación de landing', async () => {
            await landing.formulario(variables)
            await landing.agregarComponente()
        })

        await test.step('Configurar el componente de carrusel de tours', async () => {
            await landing.formularioTourCarouserl(variables)
            await landing.publicarLanding()
        })
        
        await test.step('Verificar la creación del landing en la nueva web', async () => {
            await landing.ingresoLanding()
        })
    })
    
    test('Validación de mensajes de error para campos obligatorios vacíos', async ({ page }) => {
        let landing = new landings(page)
        await test.step('Verificar mensajes de error en campos obligatorios vacíos en el formulario de landing', async () => {
            await landing.validacionCamposVacios()
        })
    
        await test.step('Revisar mensajes de error al intentar enviar formulario con campos obligatorios sin completar', async () => {
            await landing.validacionCamposVacios()
        })
    })    
})