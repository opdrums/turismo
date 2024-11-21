import { expect, test } from "@playwright/test"
import * as fs from 'fs'
import reservaTour from "../pageObjectModel/tour_operacion/reservas"

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/pasajero.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))

test.describe('Como automatizador quiero hacer los flujos del modulo de pasajero', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(variables.urlTour)
        await page.locator('#user').fill(variables.userName)
        await page.locator('#password').fill(variables.password)
        await page.getByRole('button', { name: 'Entrar'}).click()
        await page.locator('//main/aside/div[2]/div[2]/span').hover()
        await page.locator('//main/aside/div[2]/div[2]/div[2]/a').click()
        await page.getByRole('link', { name: ' Viajeros' }).click()
    })

    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlBase)
        await page.context().clearCookies()
        await page.close()
    })
    
    test('Validación de reservas asociadas al pasajero', async ({ page }) => {
        await test.step('Obtener y buscar al pasajero por correo electrónico', async () => {
            const userEmail = await page.locator('//div[3]/div[2]/div[2]/div[2]').textContent()
            await page.locator('//div/div[2]/div/input').fill(`${userEmail}`)
            await page.locator('.table-row-actions > div > a').first().click()
        })
    
        await test.step('Validación de reservas asociadas al pasajero', async () => {
            await page.waitForTimeout(2000)
    
            if (await page.getByRole('link', { name: 'Ver reserva' }).isVisible()) {
                expect(await page.getByRole('link', { name: 'Ver reserva' })).toBeVisible()
            } else {
                test.info().annotations.push({ type: 'Info', description: 'El pasajero no tiene reservas asociadas' })
                throw new Error('Error: Fallo en la validación porque el pasajero no tiene reservas')
            }
        })
    })
    
    test('Pruebas funcionales del buscador', async ({ page }) => {
        await test.step('Buscar un pasajero por correo electrónico', async () => {
            const userEmail = await page.locator('//div[3]/div[2]/div[2]/div[2]').textContent()
            await page.locator('//div/div[2]/div/input').fill(`${userEmail}`)
            await page.locator('//div[3]/div[2]/div[2]/div[2]').waitFor({ state: 'visible' })
            await page.locator('//div/div[2]/div/input').clear()
        })
    
        await test.step('Buscar un pasajero por DNI', async () => {
            const dniUser = await page.locator('//div/div[3]/div[2]/div[3]/div[2]').textContent()
            await page.locator('//div/div[2]/div/input').fill(`${dniUser}`)
            await page.locator('//div/div[3]/div[2]/div[3]/div[2]').waitFor({ state: 'visible' })
        })

        await test.step('Buscar un pasajero por nombre', async () => {
            const nameUser = await page.locator('//div/div[3]/div[2]/div[1]/div[2]').textContent()
            const firstName = `${nameUser}`.split(' ')[0]
            await page.locator('//div/div[2]/div/input').fill(firstName)
            await page.locator('//div/div[3]/div[2]/div[1]/div[2]').waitFor({ state: 'visible' })
        })
    })    
})
