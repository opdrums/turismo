import { test } from '@playwright/test'
import * as fs from 'fs'

const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/web.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));

test.describe('Validar el proceso completo de compra en el modulo de tour', () => {

    
    test.beforeEach(async ({ page }) => {
       await page.goto(variables.url)
    })

    test.skip('observaciones', async ({ page }) => {
        test.info().annotations.push({
            type: 'Duda',
            description: "Preguntar por qué el campo de fecha recibe el formato ('YYYY-MM-DD') pero visualmente muestra ('DD-MM-YYYY')"
        });
        
        test.info().annotations.push({
            type: 'Campos quemados en el formulario',
            description: "En el formulario 1, hay datos predefinidos con la información de 'José'"
        });
        
        test.info().annotations.push({
            type: 'Validación de longitud',
            description: "Los campos (nombre, apellido, email) deben permitir un máximo de 50 caracteres"
        });
        
        test.info().annotations.push({
            type: 'Validación de longitud',
            description: "El campo DNI debe permitir un máximo de 15 caracteres"
        });
        
        test.info().annotations.push({
            type: 'Validación de longitud',
            description: "El campo código postal debe permitir un máximo de 10 caracteres"
        });
    
        test.info().annotations.push({
            type: 'validation',
            description: "el campo (teléfono) deben aceptar solo números"
        });

        test.info().annotations.push({
            type: 'bug',
            description: "Al ingresar a la página, los campos 'adulto' e 'individual' aparecen preseleccionados automáticamente"
        });

        test.info().annotations.push({
            type: 'falta información',
            description: "El campo 'nacionalidad' no tiene información disponible para seleccionar"
        });

        test.info().annotations.push({
            type: 'campos obligatorios',
            description: "Agregar validación para los campos obligatorios: nombre, apellido, email, teléfono, sexo, fecha de nacimiento, email y DNI"
        })
    })
    

    test('Como automatizador Completo el flujo de Compra en el Módulo de Tour', async ({ page }) => {
        await test.step('Inicia el proceso automatizado para realizar una compra de tour', async () => {
            //await page.locator('div').filter({ hasText: /^Adultos\(Desde 12 años\)\+-$/ }).getByRole('button').nth(1).click()
            //await page.locator('div').filter({ hasText: /^Niños\(3 a 11 años\)\+-$/ }).getByRole('button').nth(1).click()
            //await page.locator('div').filter({ hasText: /^Individual1 cama individual\+-$/ }).getByRole('button').nth(1).click()
            //await page.locator('div').filter({ hasText: /^Twin2 camas individuales\+-$/ }).getByRole('button').nth(1).click()
        })
        
        await test.step(' completa los datos personales requerido en el formulario pasajero 1', async () => {
            await page.getByLabel('Nombre*').clear()
            await page.getByLabel('Nombre*').fill('test qa')
            await page.getByLabel('Apellido*').clear()
            await page.getByLabel('Apellido*').fill('111')
            await page.getByLabel('Teléfono*').clear()
            await page.getByLabel('Teléfono*').fill('1231231231')
            await page.selectOption('#reservation-field-sex', 'Female')
            await page.locator('#reservation-field-birthday').nth(0).fill('1995-09-12')
            await page.getByLabel('E-mail*').clear()
            await page.getByLabel('E-mail*').fill('111231232@gmail.com')
            await page.getByLabel('Confirmar e-mail').check()
            await page.getByLabel('DNI*').clear()
            await page.getByLabel('DNI*').fill('123123782')
            await page.getByLabel('Fecha de caducidad').nth(0).fill('1995-09-12')
            await page.getByLabel('Fecha de expedición').nth(0).fill('1995-09-12')
            await page.getByLabel('Código postal').clear()
            await page.getByLabel('Código postal').fill('1239902')
            await page.getByLabel('Nacionalidad').click()
        })
    })
    
})
