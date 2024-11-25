import { expect, test } from '@playwright/test'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/web/login.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));
dotenv.config()

test.describe('Como automatizador, quiero realizar el flujo de inicio de session', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.baseUrlWeb}`)
        await page.getByRole('link', { name: 'Iniciar sesión' }).click()
    })

    test.afterEach(async ({ page }) => {
        await page.context().cookies(`${process.env.baseUrlWeb}`);
        await page.context().clearCookies()
        await page.close()
    })
    
    test('Inicio de session exitoso', async ({ page }) => {
        await test.step('Dado que el usuario ingresa las credenciales', async () => {
            await page.getByPlaceholder('E-mail').fill(variables.emailWeb)
            await page.getByPlaceholder('Contraseña').fill(variables.passwordWeb)
            await page.getByRole('button', { name: 'Iniciar sesión' }).click()
        })

        await test.step('el sistema redirecciona a la vista de compras de tour', async () => {
            await page.getByRole('link', { name: variables.emailWeb }).waitFor({state: 'visible'})
            expect(page.getByRole('link', { name: variables.emailWeb })).toBeVisible()
        })
    })

    test('Mostrar mensaje de error cuando la contraseña es incorrecta. ', async ({ page }) => {
        await test.step('Dado que el usuario ingresa las credenciales', async () => {
            await page.getByPlaceholder('E-mail').fill(variables.emailWeb)
            await page.getByPlaceholder('Contraseña').fill(variables.passwordError)
            await page.getByRole('button', { name: 'Iniciar sesión' }).click()
        })

        await test.step('el sistema muestra el mensaje de error "La contraseña es incorrecta. Por favor, intente nuevamente.', async () => {
            await page.getByText('Usuario o contraseña').waitFor({state: 'visible'})
            expect(page.getByText('Usuario o contraseña')).toContainText('Usuario o contraseña incorrectos.')
        })
    })
     
    test('Mostrar mensaje de error cuando los campos de inicio de sesión están vacíos.', async ({ page }) => {
        await test.step('Dado que el usuario no ingresa las credenciales', async () => {
            await page.getByRole('button', { name: 'Iniciar sesión' }).click()
        })
        await test.step('el sistema debe mostrar un mensaje de advertencia indicando que los campos son obligatorios', async () => {
            expect(page.getByText('El nombre de usuario es')).toContainText('El nombre de usuario es obligatorio.')
            expect(page.getByText('La contraseña es obligatoria.')).toContainText('La contraseña es obligatoria.')
        })
    })
    
    test('Mostrar validacion de usuario no ha confirmado su registro.', async ({ page }) => {
        await test.step('Dado que el usuario no ingresa las credenciales', async () => {
            await page.getByPlaceholder('E-mail').fill(variables.usuarioSinRegistrar);
            await page.getByPlaceholder('Contraseña').fill(variables.passwordWeb);
            await page.getByRole('button', { name: 'Iniciar sesión' }).click()
        })

        await test.step('el sistema debe mostrar un mensaje de advertencia indicando usuario no ha confirmado', async () => {
            await page.getByText('El usuario no ha confirmado').waitFor({state: 'visible'})
            expect(page.getByText('El usuario no ha confirmado')).toContainText('El usuario no ha confirmado el código de verificación.')
        })
    })
})
