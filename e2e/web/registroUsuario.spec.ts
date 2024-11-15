import { expect, test } from '@playwright/test'
import codigoVerificacionRegistro from '../pageObjectModel/web/codigoVerificacionRegistro'
import * as fs from 'fs'


const path = require('path')
const { chromium } = require('playwright')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/web/registroUsuario.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const codigos = new codigoVerificacionRegistro()

test.describe('como automatizador quiero validar el flujo de registro de usuario', () => {    
    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlBase)
        await page.context().clearCookies()
    })

    test('Registro de usuario exitoso', async ({page}) => {
        const isHeadless = !!process.env.CI
        const browser = await chromium.launch({ headless: isHeadless })
        const context = await browser.newContext()
        const view1 = await context.newPage()
        const view2 = await context.newPage()
        await page.close()


        await test.step('Abrir vistas', async () => {
            await codigos.abrirVistas(view1, view2, variables);
        })
        
        await test.step('Navegar al registro de usuario', async () => {
            await codigos.navegarRegistro(view1)
        })
        
        await test.step('Obtener correo provisional', async () => {
            await codigos.obtenerCorreoProvisional(view2)
        })
        
        await test.step('Completar formulario de registro', async () => {
            await codigos.completarFormularioRegistro(view1, variables)
        })
        
        await test.step('Obtener código de confirmación desde el correo', async () => {
            await codigos.obtenerCodigoConfirmacion(view2, test)
        })
    
        await test.step('Ingresar el código de confirmación en la vista 1', async () => {
            await view1.getByRole('button', { name: 'Verificar código' }).waitFor({ state: 'visible' })
            await view1.getByPlaceholder('Código de confirmación').fill(variables.codigoVerificacionIncorrecto)
            await view1.getByRole('button', { name: 'Verificar código' }).click()
            expect(view1.getByText('El código de confirmación es')).toContainText('El código de confirmación es incorrecto')
    
            await view1.getByPlaceholder('Código de confirmación').clear()
            await view1.getByPlaceholder('Código de confirmación').fill(codigos.codigoVerificacion) // Utiliza el código de confirmación obtenido
            await view1.getByRole('button', { name: 'Verificar código' }).click()
        })
    
        await test.step('Validar redirección a la vista de compras de tours', async () => {
            await view1.getByRole('link', { name: codigos.correoprovicional }).waitFor({ state: 'visible' })
            expect(view1.getByRole('link', { name: codigos.correoprovicional })).toBeVisible()
        })
    })
    

    test('Mostrar validacion de Campos vacíos y obligatorios', async ({ page }) => {
        await test.step('El usuario intenta registrarse sin completar los campos y hace clic en "Continuar"', async () => {
            const codigoPage = new codigoVerificacionRegistro(page)
            await codigoPage.flujoRegistro(variables.urlBase)
        })
    
        await test.step('El sistema muestra mensajes indicando los campos obligatorios que están vacíos', async () => {
            expect(page.getByText('El correo electrónico es')).toContainText('El correo electrónico es obligatorio.')
            expect(page.getByText('La contraseña es obligatoria.')).toContainText('La contraseña es obligatoria.')
            expect(page.getByText('Debe confirmar la contraseña')).toContainText('Debe confirmar la contraseña')
            expect(page.getByText('El nombre es obligatorio.')).toContainText('El nombre es obligatorio.')
            expect(page.getByText('El apellido es obligatorio.')).toContainText('El apellido es obligatorio.')
            expect(page.getByText('El teléfono es obligatorio.')).toContainText('El teléfono es obligatorio.')
        })
    })
    
    test('Mostrar validación de requisitos para el campo de contraseña', async ({ page }) => {
        await test.step('El usuario intenta registrarse ingresando una contraseña no válida y hace clic en "Continuar"', async () => {
            const codigoPage = new codigoVerificacionRegistro(page)
            await codigoPage.flujoRegistro(variables.urlBase)
        })
    
        await test.step('El sistema muestra los mensajes de validación para el campo de contraseña', async () => {
            await page.getByPlaceholder('Contraseña', { exact: true }).fill(variables.passwordError)
            expect(page.getByText('La contraseña debe tener má')).toContainText('La contraseña debe tener máximo 14 caracteres')
            
            await page.getByPlaceholder('Contraseña', { exact: true }).clear()
            await page.getByPlaceholder('Contraseña', { exact: true }).fill(variables.passwordIncorecto)
            expect(page.getByText('La contraseña debe contener')).toContainText('La contraseña debe contener al menos una mayúscula, un número y un carácter especial')
           
            await page.getByPlaceholder('Contraseña', { exact: true }).clear()
            await page.getByPlaceholder('Contraseña', { exact: true }).fill(variables.passwordMinimo)
            expect(page.getByText('La contraseña debe tener al')).toContainText('La contraseña debe tener al menos 7 caracteres')
            
            await page.getByPlaceholder('Confirmar Contraseña').fill(variables.passwordWeb);
            expect(page.getByText('Las contraseñas no coinciden')).toContainText('Las contraseñas no coinciden')
        })
    })
    
    test('Mostrar validación del campo teléfono para caracteres especiales', async ({ page }) => {
        await test.step('El usuario intenta registrarse ingresando un teléfono no válido y hace clic en "Continuar"', async () => {
            const codigoPage = new codigoVerificacionRegistro(page)
            await codigoPage.flujoRegistro(variables.urlBase)
        })
    
        await test.step('El sistema muestra un mensaje de error para el campo teléfono con caracteres no permitidos', async () => {
            await page.getByPlaceholder('Telefono').waitFor({ state: 'visible' })
            await page.getByPlaceholder('E-mail').fill(variables.emailRegistrado)
            await page.getByPlaceholder('Contraseña', { exact: true }).fill(variables.passwordWeb)
            await page.getByPlaceholder('Confirmar Contraseña').fill(variables.passwordWeb)
            await page.getByPlaceholder('Nombre').fill(variables.nombre)
            await page.getByPlaceholder('Apellidos').fill(variables.apellido)
            await page.getByPlaceholder('Telefono').fill(variables.telefonoIncorrecto)
            await page.getByRole('button', { name: 'Continuar' }).click()
            expect(page.getByText('Número de teléfono')).toContainText('Número de teléfono inválido')
        })
    })
    
    test('Mostrar validación de usuario ya registrado', async ({ page }) => {
        await test.step('El usuario intenta registrarse con un correo electrónico ya registrado y hace clic en "Continuar"', async () => {
            const codigoPage = new codigoVerificacionRegistro(page)
            await codigoPage.flujoRegistro(variables.urlBase)
        })
    
        await test.step('El sistema muestra un mensaje indicando que el usuario ya está registrado', async () => {
            await page.getByPlaceholder('Telefono').waitFor({ state: 'visible' })
            await page.getByPlaceholder('E-mail').fill(variables.emailRegistrado)
            await page.getByPlaceholder('Contraseña', { exact: true }).fill(variables.passwordWeb)
            await page.getByPlaceholder('Confirmar Contraseña').fill(variables.passwordWeb)
            await page.getByPlaceholder('Nombre').fill(variables.nombre)
            await page.getByPlaceholder('Apellidos').fill(variables.apellido)
            await page.getByPlaceholder('Telefono').fill(variables.telefono)
            await page.getByRole('button', { name: 'Continuar' }).click()
            await page.getByText('User already exists').waitFor({ state: 'visible' })
            expect(page.getByText('User already exists')).toContainText('User already exists')
        })
    })
})
