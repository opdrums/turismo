import { expect, test } from '@playwright/test'
import * as fs from 'fs'

const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/login.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));

test.describe('Como automatizador quiero crear casos de pruebas para el login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(variables.urlBase)
    })
 
    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlBase)
        await page.context().clearCookies()
        await page.close()
    })
    
    test('Inicio de Sesión exitoso', async ({ page }) => {
        await test.step('ingreso las credenciales emial y contraseña', async () => {
            await page.locator('#user').fill(variables.userName)
            await page.locator('#password').fill(variables.password)
        })

        await test.step('espero que el sistema permita ser redirigido a la página principal', async () => {
            await page.getByRole('button', { name: 'Entrar'}).click()
            await page.waitForTimeout(2000)
            expect(page.getByRole('img', { name: 'Different Roads' })).toBeVisible()
        })
    })    

    test('Inicio de Sesión Incorrecto', async ({ page }) => {
        await test.step('ingreso las credenciales usuario y contraseña incorrectos', async () => {
            await page.locator('#user').fill(variables.userName)
            await page.locator('#password').fill(variables.passwordError)
        })

        await test.step('el sistema debe mostrar un mensaje de error indicando que el usuario ingreso mal la contraseña', async () => {
            await page.getByRole('button', { name: 'Entrar'}).click()
            let validacion = await page.locator('//html/body/div/div/div[2]/form/p').textContent();
            expect(validacion).toBe('Usuario o contraseña incorrectos.')
        })
    })

    test('Inicio de Sesión con Campos Vacíos', async ({ page }) => {
        await test.step('Dado que el usuario no ingresa las crdenciales', async () => {
            await page.locator('#user').fill(variables.userName)
            await page.locator('#user').clear()
            await page.locator('#password').fill(variables.password)
            await page.locator('#password').clear()
        })
        
        await test.step('el sistema debe mostrar un mensaje de advertencia indicando que los campos son obligatorios', async () => {
            await page.getByRole('button', { name: 'Entrar'}).click()
            let campoVacioUsuario = await page.locator('//html/body/div/div/div[2]/form/div[1]/p').textContent()
            let campoVacioContraseña = await page.locator('//html/body/div/div/div[2]/form/div[2]/p').textContent()
            expect(campoVacioUsuario).toBe('El nombre de usuario es obligatorio.')
            expect(campoVacioContraseña).toBe('La contraseña es obligatoria.')
        })  
    })

    test('Inicio de Sesión con Usuario No Existente', async ({ page }) => {        
        await test.step('ingreso las credenciales emial y contraseña incorrectos', async () => {
            await page.locator('#user').fill(variables.emailError)
            await page.locator('#password').fill(variables.passwordError)
        })
        
        await test.step('el sistema debe mostrar un mensaje de error indicando que el usuario no existe', async () => {
            await page.getByRole('button', { name: 'Entrar'}).click()
            let validacion = await page.locator('//html/body/div/div/div[2]/form/p').textContent()
            expect(validacion).toBe('Usuario o contraseña incorrectos.')
        })
    })
})
