import { expect, test } from '@playwright/test'
import compraTour from '../pageObjectModel/web/compraTour'
import * as fs from 'fs'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/web/compras.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))


test.describe('Como automatizador, quiero realizar el flujos de compra de un tour', () => {

    test.beforeEach(async ({ page }) => {
        const compra = new compraTour(page)
        await compra.loginUser(variables.urlWeb, variables.email, variables.password)
    });

    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlWeb)
        await page.context().clearCookies()
        await page.close()
    })

    test('Flujo de compra para el plan Comfort con pago mediante transferencia bancaria', async ({ page }) => {
        const compra = new compraTour(page)
    
        await test.step('Seleccionar el tour y el período deseado', async () => {
            await compra.seleccionarTouraAndPeriodo(2)
        })
    
        await test.step('Completar el formulario de pasajeros - Paso 1', async () => {
            await compra.seleccionarCantidadHabitaciones();
            await compra.FormularioPasajeros(0, variables)
            await compra.FormularioPasajeros(1, variables)
        })
    
        await test.step('Seleccionar actividades y plan Comfort - Paso 2', async () => {
            await compra.agregarActividad()
            await compra.selecionarPlanComfort()
        })
    
        await test.step('Realizar el pago total mediante transferencia bancaria - Paso 3', async () => {
            await compra.pagoTotalTransferenciaBancaria()
        })
    
        await test.step('Validar estado de la compra exitosa mediante transferencia bancaria', async () => {
            await compra.pagoTransferencia()
        })
    })
    
    test('Flujo de compra para el plan Standard con pago mediante tarjeta', async ({ page }) => {
        const compra = new compraTour(page)
    
        await test.step('Seleccionar el tour y el período deseado', async () => {
            await compra.seleccionarTouraAndPeriodo(2)
        })
    
        await test.step('Completar el formulario de pasajeros - Paso 1', async () => {
            await compra.seleccionarCantidadHabitaciones()
            await compra.FormularioPasajeros(0, variables)
            await compra.FormularioPasajeros(1, variables)
        })
    
        await test.step('Seleccionar actividades y plan Standard - Paso 2', async () => {
            await compra.agregarActividad()
            await compra.selecionarPlanStandard()
        })
    
        await test.step('Realizar el pago total con tarjeta - Paso 3', async () => {
            await compra.pagoTotalConTarjeta()
        })
    
        await test.step('Validar estado de la compra exitosa', async () => {
            await compra.pagoExitoso()
        })
    })
    
    test('Flujo de compra para el plan Comfort Plus con pago de reserva', async ({ page }) => {
        const compra = new compraTour(page)
    
        await test.step('Seleccionar el tour y el período', async () => {
            await compra.seleccionarTouraAndPeriodo(2)
        })
    
        await test.step('Completar el formulario de pasajeros - Paso 1', async () => {
            await compra.seleccionarCantidadHabitaciones()
            await compra.FormularioPasajeros(0, variables)
            await compra.FormularioPasajeros(1, variables)
        })
    
        await test.step('Seleccionar actividades y plan Comfort Plus - Paso 2', async () => {
            await compra.agregarActividad()
            await compra.selecionarPlanComfortPlus()
        })
    
        await test.step('Realizar el pago de reserva con Bizum - Paso 3', async () => {
            await compra.pagoReservaTiempoBizum()
        })
    
        await test.step('Validar estado de la compra exitosa', async () => {
            await compra.pagoExitoso()
        })
    })
    

    test('Validación de formulario: campos vacíos durante el proceso de compra', async ({ page }) => {
        const compra = new compraTour(page)
    
        await test.step('Iniciar el proceso de compra seleccionando un tour y período', async () => {
            await compra.seleccionarTouraAndPeriodo(2)
        })
    
        await test.step('Seleccionar cantidad de habitaciones y continuar al siguiente paso', async () => {
            await compra.seleccionarCantidadHabitaciones()
            await page.getByRole('button', { name: 'Continuar' }).click()
        })
    
        await test.step('Verificar mensajes de error para campos obligatorios vacíos', async () => {
            await expect(page.getByText('El nombre es obligatorio').first()).toHaveText('El nombre es obligatorio');
            await expect(page.getByText('El apellido es obligatorio').first()).toHaveText('El apellido es obligatorio');
            await expect(page.getByText('El teléfono es obligatorio').first()).toHaveText('El teléfono es obligatorio');
            await expect(page.getByText('Selecciona el sexo').first()).toHaveText('Selecciona el sexo');
            await expect(page.getByText('La fecha de nacimiento es obligatoria').first()).toHaveText('La fecha de nacimiento es obligatoria');
            await expect(page.getByText('El correo electrónico es obligatorio').first()).toHaveText('El correo electrónico es obligatorio');
            await expect(page.getByText('El DNI es obligatorio').first()).toHaveText('El DNI es obligatorio');
            await expect(page.getByText('El código postal es obligatorio').first()).toHaveText('El código postal es obligatorio');
            await expect(page.getByText('Selecciona la nacionalidad').first()).toHaveText('Selecciona la nacionalidad');
        })
    })

    test('Validación de formulario: fechas inválidas en el proceso de compra', async ({ page }) => {
        const compra = new compraTour(page)
    
        await test.step('Iniciar el proceso de compra seleccionando un tour y período', async () => {
            await compra.seleccionarTouraAndPeriodo(2)
        })
    
        await test.step('Seleccionar cantidad de habitaciones y completar fechas inválidas en el formulario', async () => {
            await compra.seleccionarCantidadHabitaciones()
            await page.locator('//*[@id="reservation-field-birthday"]').nth(0).fill('2100-12-05'); // Fecha futura para nacimiento
            await page.locator('//*[@id="reservation-field-expiration"]').nth(0).fill('1995-11-12'); // Fecha pasada para caducidad
            await page.locator('//*[@id="reservation-field-issued"]').nth(0).fill('2100-12-05'); // Fecha futura para expedición
            await page.getByRole('button', { name: 'Continuar' }).click()
        })
    
        await test.step('Verificar mensajes de error para fechas no válidas', async () => {
            await expect(page.getByText('La fecha de nacimiento no puede ser futura').first()).toHaveText('La fecha de nacimiento no puede ser futura')
            await expect(page.getByText('La fecha de caducidad no puede estar en el pasado').first()).toHaveText('La fecha de caducidad no puede estar en el pasado')
            await expect(page.getByText('La fecha de expedición no puede ser futura').first()).toHaveText('La fecha de expedición no puede ser futura')
        })
    })
})

