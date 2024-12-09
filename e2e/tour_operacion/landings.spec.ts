import {test } from '@playwright/test'
import * as fs from 'fs'
import landings from '../pageObjectModel/tour_operacion/landings'
import * as dotenv from 'dotenv'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/landings.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))
dotenv.config()

test.describe('Como automatizador quiero hacer flujos de landings', () => {
    let opcion = 'no'

    test.beforeEach(async ({ page }) => {
        let landing = new landings(page)
        await landing.abrirVistas(variables)
        await landing.login(variables)
    })

    test.afterEach(async ({ page }) => {
        await page.context().cookies(`${process.env.baseUrlWebAdmin}`)
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
            await landing.crearLanding()
        })
        
        await test.step('Verificar la creación del landing en la nueva web', async () => {
            await landing.publicarLanding()
        })
    })

    test('eliminar banner de forma exitosa', async ({ page }) => {
        let landing = new landings(page)
        await test.step('eliminar landing de la forma correcta', async () => {
            await landing.eliminarLanding(opcion, 1, test)
        })
    })

    test('despublicar banner de forma exitosa', async ({ page }) => {
        let landing = new landings(page)
        await test.step('despublicar landing de la forma correcta', async () => {
            await landing.despublicarLanding(opcion, 1, test)
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