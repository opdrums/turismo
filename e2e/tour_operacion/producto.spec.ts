import { expect, test } from '@playwright/test'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import { info } from 'console'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/producto.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))
dotenv.config()

test.describe('Como automatizador quiero hacer flujo del modulo de producto', () => {
    let tourId = 1 
    let periodoId = 1

    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.baseUrlMiddle}`)
        await page.locator('#user').fill(variables.userName)
        await page.locator('#password').fill(variables.password)
        await page.getByRole('button', { name: 'Entrar'}).click()
    })

    test('testear un tour de forma exitosa', async ({ page }) => {     
        test.setTimeout(60000)
        await test.step('selecciono el tour', async () => {
            await page.getByRole('link', { name: ' Producto' }).click()
            const nameTour = await page.locator(`//section/div/div/a[${tourId}]/div/h1`).textContent()
            await page.getByRole('link', { name: `${nameTour}` }).click()
        })
        
        await test.step('selecionar el periodo', async () => {
            await page.locator('//*[@id="periods"]').selectOption({index: periodoId})
        })

        await test.step('validacion de testear un periodo', async () => {
            await page.getByRole('button', { name: 'Testear periodo' }).click()
            await page.getByText('Detalle de serviciosCiudad de').waitFor({state:'visible'})
        })
    })

    test('testear un tour con servicios asociados', async ({ page }) => {     
        test.setTimeout(60000)
        await test.step('selecciono el tour', async () => {
            await page.getByRole('link', { name: ' Producto' }).click()
            const nameTour = await page.locator(`//section/div/div/a[${tourId}]/div/h1`).textContent()
            await page.getByRole('link', { name: `${nameTour}` }).click()
        })
        
        await test.step('selecionar el periodo', async () => {
            await page.locator('//*[@id="periods"]').selectOption({index: periodoId})
        })

        await test.step('validacion de servicios asociados a un periodo', async () => {
           await page.getByRole('button', { name: 'Servicios' }).click()
           await page.waitForTimeout(2000)
           if (await page.locator('//div/div/div[2]/div[1]/div[2]').isVisible()) {
                test.info().annotations.push({type: 'Info',description: "El tour contiene servicios asociadas"})
           } else {
                test.info().annotations.push({type: 'Info',description: "El tour no contiene servicios asociadas"})
                throw new Error('Error: El tour no contiene servicios asociadas')
           }
        })
    })

    test('testear un tour con reservas asociados', async ({ page }) => {     
        test.setTimeout(60000)
        await test.step('selecciono el tour', async () => {
            await page.getByRole('link', { name: ' Producto' }).click()
            const nameTour = await page.locator(`//section/div/div/a[${tourId}]/div/h1`).textContent()
            await page.getByRole('link', { name: `${nameTour}` }).click()
        })
        
        await test.step('selecionar el periodo', async () => {
            await page.locator('//*[@id="periods"]').selectOption({index: periodoId})
        })

        await test.step('validacion de servicios asociados a un periodo', async () => {
           await page.getByRole('button', { name: 'Reservas' }).click()
           await page.waitForTimeout(2000)
           if (await page.locator('//div/div[2]/div[2]/div[4]/div[2]').isVisible()) {
                test.info().annotations.push({type: 'Info',description: "El tour contiene reserva asociadas"})
           } else {
                test.info().annotations.push({type: 'Info',description: "El tour no contiene reserva asociadas"})
           }
        })
    })
    

    test('testear un tour con viajeros asociados', async ({ page }) => {     
        test.setTimeout(60000)
        await test.step('selecciono el tour', async () => {
            await page.getByRole('link', { name: ' Producto' }).click()
            const nameTour = await page.locator(`//section/div/div/a[${tourId}]/div/h1`).textContent()
            await page.getByRole('link', { name: `${nameTour}` }).click()
        })
        
        await test.step('selecionar el periodo', async () => {
            await page.locator('//*[@id="periods"]').selectOption({index: periodoId})
        })

        await test.step('validacion de viajeros asociados a un periodo', async () => {
           await page.getByRole('button', { name: 'viajeros' }).click()
           await page.waitForTimeout(2000)
           if (await page.locator('//div/div[2]/div[2]/div[2]/div[2]').isVisible()) {
                test.info().annotations.push({type: 'Info',description: "El tour contiene viajeros asociadas"})
           } else {
                test.info().annotations.push({type: 'Info',description: "El tour no contiene viajeros asociadas"})
           }
        })
    })
})
