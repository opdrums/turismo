import { test } from '@playwright/test'
import compraTour from '../pageObjectModel/web/compraTour'
import * as fs from 'fs'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/web/compras.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))


test.describe('Como automatizador, quiero realizar el flujos de compra de un tour', () => {

    test.beforeEach(async ({ page }) => {
        const compra = new compraTour(page)
        await compra.loginUser(variables)
    });

    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlWeb)
        await page.context().clearCookies()
        //await page.close()
    })

    test('Flujo de compra para el plan Comfort con pago mediante transferencia bancaria', async ({ page }) => {
        const compra = new compraTour(page)
        await test.step('Seleccionar el tour y el período deseado', async () => {
            await compra.seleccionarTouraAndPeriodo(2, test)
        })
    
        await test.step('Completar el formulario de pasajeros - Paso 1', async () => {
            await compra.seleccionarCantidadHabitaciones(1, 5)
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
            await compra.seleccionarTouraAndPeriodo(2, test)
        })
    
        await test.step('Completar el formulario de pasajeros - Paso 1', async () => {
            await compra.seleccionarCantidadHabitaciones(1, 5)
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
            await compra.seleccionarTouraAndPeriodo(2, test)
        })
    
        await test.step('Completar el formulario de pasajeros - Paso 1', async () => {
            await compra.seleccionarCantidadHabitaciones(1, 5)
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
            await compra.seleccionarTouraAndPeriodo(2, test)
        })
    
        await test.step('Verificar mensajes de error para campos obligatorios vacíos', async () => {
            await compra.seleccionarCantidadHabitaciones(1, 5)
            await compra.validacionCamposVacios()
        })
    })

    test('Validación de formulario: fechas inválidas en el proceso de compra', async ({ page }) => {
        const compra = new compraTour(page)
        await test.step('Iniciar el proceso de compra seleccionando un tour y período', async () => {
            await compra.seleccionarTouraAndPeriodo(2, test)
        })
    
        await test.step('Verificar mensajes de error para fechas no válidas', async () => {
            await compra.seleccionarCantidadHabitaciones(1, 5)
            await compra.validacionFechasInvalidas()
        })
    })
})

