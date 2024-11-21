import {  expect, test } from "@playwright/test"
import * as fs from 'fs'
const { chromium } = require('playwright')
import invitacionUsuario from '../../e2e/pageObjectModel/tour_operacion/invitacionUsuario'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/invitacionUsuario.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))
let invitacion = new invitacionUsuario()

test.describe('como automatizador quiero validar el flujo de registro', () => {
    let view1
    let view2
    let browser
    let context
    let rol = "Admin de Contenidos"

    test.beforeEach(async ({page}) => {
        const isHeadless = !! process.env.CI
        browser = await chromium.launch({ headless: isHeadless })
        context = await browser.newContext()
        view1 = await context.newPage()
        view2 = await context.newPage()
        await invitacion.abrirVistas(view1, view2, variables)
        await page.close()
    })
    
    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlBase)
        await page.context().clearCookies()
        await page.close()
    })

    test('registro exito', async () => {
        await test.step('Envio de invitacion usuario exitoso', async () => {
            await invitacion.iniciarSessionTourOperacion(view1,variables)
            await invitacion.obtenerEmailProvicional(view2)
            await invitacion.seleccionarRol(view1, rol)
            await invitacion.obtenerCodigoConfirmacion(view2, test)
        })

        await test.step('flujo de invitacion Exitoso', async () => {
            await invitacion.regististroUsuario(context, variables)
        })        
    })    

    test('Validación de campos obligatorios vacíos en el formulario de registro', async ({ page }) => {
        await test.step('Envio de invitacion usuario exitoso', async () => {
            await invitacion.iniciarSessionTourOperacion(view1,variables)
            await invitacion.obtenerEmailProvicional(view2)
            await invitacion.seleccionarRol(view1, rol)
            await invitacion.obtenerCodigoConfirmacion(view2, test)
        })

        await test.step('Intentar completar registro sin llenar campos', async () => {
          await invitacion.validacionCamposObligatorios(context)
        })
    })

    test('Validación de error para usuario ya registrado en el formulario de registro', async ({ page }) => {
        await test.step('Envio de invitacion usuario exitoso', async () => {
            await invitacion.iniciarSessionTourOperacion(view1,variables)
            await invitacion.obtenerEmailProvicional(view2)
            await invitacion.seleccionarRol(view1, rol)
            await invitacion.obtenerCodigoConfirmacion(view2, test)
        })

        await test.step('Verificar mensaje de error de usuario ya registrado', async () => {
            await invitacion.validacionUsuarioRegistrado(context, variables)
        })
    })

    test('Validación de error para contraseña incorrecta en el formulario de registro', async ({ page }) => {
         await test.step('Envio de invitacion usuario exitoso', async () => {
            await invitacion.iniciarSessionTourOperacion(view1,variables)
            await invitacion.obtenerEmailProvicional(view2)
            await invitacion.seleccionarRol(view1, rol)
            await invitacion.obtenerCodigoConfirmacion(view2, test)
        })

        await test.step('Verificar mensaje de error de contraseña incorrecta', async () => {
            await invitacion.validacionContraseñaIncorrecta(context, variables)
        })
    })
})
