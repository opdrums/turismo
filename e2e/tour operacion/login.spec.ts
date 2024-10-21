import { expect, test } from '@playwright/test'
import * as fs from 'fs'

const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/web.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));

test.describe('Como automatizador quiero crear casos de pruebas para el login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(variables.urlBase)
    })
    
    test(' Inicio de Sesión exitoso', async ({ page }) => {
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
        test.info().annotations.push({
            type: 'Bug',
            description: 'Falta visualizar la alerta que le indica que la informacion no corresponde'
        })

        await test.step('ingreso las credenciales emial y contraseña incorrectos', async () => {
            await page.locator('#user').fill(variables.userName)
            await page.locator('#password').fill('123123222222')
        })

        await test.step('el sistema permita ser redirigido a la página principal', async () => {
            await page.getByRole('button', { name: 'Entrar'}).click()
    
        })
    })

    test('Intento de Inicio de Sesión con Campos Vacíos', async ({ page }) => {
        await test.step('Dado que el usuario no ingresa las crdenciales', async () => {
            await page.locator('#user').fill(variables.userName)
            await page.locator('#user').clear()
            await page.locator('#password').fill(variables.password)
            await page.locator('#password').clear()
        })
        
        await test.step('el sistema debe mostrar un mensaje de advertencia indicando que los campos son obligatorios', async () => {
            await page.getByRole('button', { name: 'Entrar'}).click()
            expect(page.getByText('El nombre de usuario es')).toContainText('El nombre de usuario es')
            expect(page.getByText('La contraseña es obligatoria.')).toContainText('La contraseña es obligatoria.')
        })  
    })

    test('Inicio de Sesión con Usuario No Existente', async ({ page }) => {
        test.info().annotations.push({
            type: 'Bug',
            description: 'Falta visualizar la alerta que le usuairo no existe'
        })
        
        await test.step('ingreso las credenciales emial y contraseña incorrectos', async () => {
            await page.locator('#user').fill('noexisto@gmail.com')
            await page.locator('#password').fill('123123222222a')
        })
        
        await test.step('el sistema debe mostrar un mensaje de error indicando que el usuario no existe ', async () => {
            await page.getByRole('button', { name: 'Entrar'}).click()
        })
    })
})
