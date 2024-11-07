import {  expect,test } from "@playwright/test";
const { chromium } = require('playwright');
import * as fs from 'fs'
import invitacionUsuario from '../../e2e/pageObjectModel/tour_operacion/invitacionUsuario'

const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/invitacionUsuario.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));
let invitacion = new invitacionUsuario()

test.describe('como automatizador quiero validar el flujo de registro', () => {
    //test.describe.configure({ mode: 'serial' })
    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlBase)
        await page.context().clearCookies()
        await page.close()
    })

    test('registro exito', async () => {
        const isHeadless = !!process.env.CI
        const browser = await chromium.launch({ headless: isHeadless })
        const context = await browser.newContext()
        const view1 = await context.newPage()
        const view2 = await context.newPage()
        let rol = "Admin de Contenidos"

        await test.step('Envio de invitacion usuario exitoso', async () => {
            await invitacion.abrirVistas(view1, view2, variables)
            await invitacion.iniciarSessionTourOperacion(view1,variables)
            await invitacion.obtenerEmailProvicional(view2)
            await invitacion.seleccionarRol(view1, rol)
            await invitacion.obtenerCodigoConfirmacion(view2)
        })

        await test.step('flujo de invitacion Exitoso', async () => {
            await invitacion.regististroUsuario(context, variables)
        })        
    })

    test('Validación de campos obligatorios vacíos en el formulario de registro', async ({ page }) => {
        await test.step('Navegar a la página de registro', async () => {
            await page.goto(variables.urltemporal)
        })

        await test.step('Intentar completar registro sin llenar campos', async () => {
           await page.getByRole('button', { name: 'Completar registro' }).click()
           expect(await page.getByText('El usuario es requerido.')).toBeVisible()
           expect(await page.getByText('El nombre es requerido.')).toBeVisible()
           expect(await page.getByText('La contraseña es requerida.')).toBeVisible()
           expect(await page.getByText('El apellido es requerido.')).toBeVisible()
        })
    })

    test('Validación de error para usuario ya registrado en el formulario de registro', async ({ page }) => {
        await test.step('Navegar a la página de registro', async () => {
            await page.goto(variables.urltemporal)
        })

        await test.step('Llenar formulario de registro con un usuario ya existente', async () => {
            await page.getByPlaceholder('Usuario').fill(variables.usuario)
            await page.getByPlaceholder('Nombre').fill(variables.nombre)
            await page.getByPlaceholder('Contraseña', { exact: true }).fill(variables.password)
            await page.getByPlaceholder('Apellido').fill(variables.apellido)
            await page.getByPlaceholder('Confirmar contraseña').fill(variables.password)
            await page.getByRole('button', { name: 'Completar registro' }).click()
        })

        await test.step('Verificar mensaje de error de usuario ya registrado', async () => {
            await page.getByText('El nombre de usuario ya').waitFor({state:'visible'})
            expect(await page.getByText('El nombre de usuario ya')).toBeVisible()
        })
    })

    
    test('Validación de error para contraseña incorrecta en el formulario de registro', async ({ page }) => {
        await test.step('Navegar a la página de registro', async () => {
            await page.goto(variables.urltemporal)
        })

        await test.step('Llenar formulario de registro con un usuario ya existente', async () => {
            await page.getByPlaceholder('Usuario').fill(variables.usuario)
            await page.getByPlaceholder('Nombre').fill(variables.nombre)
            await page.getByPlaceholder('Contraseña', { exact: true }).fill(variables.password)
            await page.getByPlaceholder('Apellido').fill(variables.apellido)
            await page.getByPlaceholder('Confirmar contraseña').fill(variables.passwordError)
            await page.getByRole('button', { name: 'Completar registro' }).click()
        })

        await test.step('Verificar mensaje de error de contraseña incorrecta', async () => {
            expect(await page.getByText('Las contraseñas no coinciden')).toBeVisible()
        })
    })
})
