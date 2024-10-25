import { expect, test } from '@playwright/test'
import * as fs from 'fs'

const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/compras.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));

test.describe('Como automatizador, quiero realizar el flujo de compra de un tour', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(variables.urlWeb);
        await page.getByRole('link', { name: 'SIGN IN' }).click();
        await page.getByPlaceholder('E-mail').fill(variables.email);
        await page.getByPlaceholder('Contraseña').fill(variables.password);
        await page.getByRole('button', { name: 'Continuar' }).click();
    });

    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlWeb);
        await page.context().clearCookies()
        await page.close()
    })

    test('Automatización del flujo de compra con el plan Comfort', async ({ page }) => {

        await test.step('Iniciar el proceso de compra de un tour', async () => {
            await page.getByRole('link', { name: 'Ver tour' }).nth(2).click()
            await page.getByRole('button', { name: 'Seleccionar' }).scrollIntoViewIfNeeded()
            await page.getByRole('button', { name: 'Seleccionar' }).hover()
            await page.getByRole('button', { name: 'Seleccionar' }).click()
            await page.locator('//div[1]/div[3]/div[1]/button/span').first().waitFor({ state: 'visible' })
        });

        await test.step('Seleccionar la cantidad de pasajeros y el tipo de habitación', async () => {
            await page.locator('div').filter({ hasText: /^Adultos\(Desde 12 años\)\+-$/ }).getByRole('button').nth(1).click()
            await page.locator('div').filter({ hasText: /^Doble matrimonio1 cama doble\+-$/ }).getByRole('button').nth(1).click()
        });

        await test.step('Completar los datos del pasajero 1 en el formulario', async () => {
            await page.getByLabel('Nombre*').nth(0).fill(variables.nombre)
            await page.getByLabel('Apellido*').nth(0).fill(variables.apellido)
            await page.getByLabel('Teléfono*').nth(0).fill(variables.telefono)
            await page.selectOption('#reservation-field-sex', variables.genero)
            await page.getByLabel('Fecha de nacimiento*').nth(0).fill(variables.fechaCumpleaños)
            await page.getByLabel('E-mail*').nth(0).fill(variables.userEmail)
            await page.getByLabel('Confirmar e-mail').check()
            await page.getByLabel('DNI*').nth(0).fill(variables.Dni);
            await page.getByLabel('Fecha de caducidad').nth(0).fill(variables.fechaCaducidad)
            await page.getByLabel('Fecha de expedición').nth(0).fill(variables.fechaExpedicion)
            await page.getByLabel('Código postal').nth(0).fill(variables.codigoPostal)
            await page.selectOption('#reservation-field-nationality', variables.nacionalidad)
        });

        await test.step('Completar los datos del pasajero 2 en el formulario', async () => {
            await page.getByRole('textbox', { name: 'Introduce nombre' }).fill(variables.nombre)
            await page.getByRole('textbox', { name: 'Introduce apellido' }).fill(variables.apellido)
            await page.getByRole('textbox', { name: 'Introduce teléfono' }).fill(variables.telefono)
            await page.locator('#reservation-field-sex').nth(1).selectOption(variables.genero)
            await page.locator('#reservation-field-birthday').nth(1).fill(variables.fechaCumpleaños)
            await page.getByRole('textbox', { name: 'Introduce e-mail' }).fill(variables.userEmail)
            await page.locator('#reservation-field-confirm-email').nth(1).check()
            await page.getByRole('textbox', { name: 'Introduce DNI' }).fill(variables.Dni)
            await page.locator('#reservation-field-expiration').nth(1).fill(variables.fechaCaducidad)
            await page.locator('#reservation-field-issued').nth(1).fill(variables.fechaExpedicion)
            await page.getByRole('textbox', { name: 'Introduce C.P' }).fill(variables.codigoPostal)
            await page.locator('#reservation-field-nationality').nth(1).selectOption(variables.nacionalidad)
        });

        await test.step('Continuar al siguiente paso del proceso de compra', async () => {
            await page.getByRole('button', { name: 'Continuar' }).click()
        });

        await test.step('Seleccionar el plan Comfort', async () => {
            await page.locator('//div[1]/div[3]/div[2]/div/div/div/div[2]/div[3]/div[2]').click();
            await page.getByRole('button', { name: 'Continuar' }).click()
        });

        await test.step('Realizar la selección de pago', async () => {
            await page.getByRole('button', { name: 'Paga tu viaje al completo 1.' }).click()
            await page.getByRole('button', { name: 'Tarjeta bancaria' }).click()
            await page.getByLabel('Acepto términos de privacidad').check()
            await page.getByRole('button', { name: 'Realizar pago' }).click()
        });

        await test.step('Completar los detalles de la pasarela de pago', async () => {
            await page.locator('//*[@id="divImgAceptar"]').waitFor({ state: 'visible' })
            await page.locator('#card-number').fill(variables.cardNumber)
            await page.locator('#card-expiration').fill(variables.cardExpiration)
            await page.locator('#card-cvv').fill(variables.cardCvv)
            await page.locator('#divImgAceptar').click()
            await page.locator('//*[@id="body"]/div[2]/div[2]/div[1]/input[2]').waitFor({ state: 'visible' })
            let validateText = page.locator('//*[@id="result-header"]/div/div/text').textContent()
            expect(validateText).toEqual(validateText)
        });
    });
});

