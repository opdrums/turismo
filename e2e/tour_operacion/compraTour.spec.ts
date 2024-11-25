import {test } from '@playwright/test'
import * as fs from 'fs'
import  compraTour  from '../pageObjectModel/tour_operacion/comprasTour'
import * as dotenv from 'dotenv'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/comprasTour.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))
dotenv.config()

test.describe('como automatizador quiero hacer flujos de compra', () => {

    test.beforeEach(async ({ page }) => {
        const gestionTour = new compraTour(page)
        await gestionTour.loginUser(variables)
    })
    
    test.afterEach(async ({ page }) => {
        await page.context().cookies(`${process.env.baseUrlMiddle}`)
        await page.context().clearCookies()
        await page.close()
    })
   
    test('Flujo de compra para el plan Comfort con pago mediante transferencia bancaria', async ({ page }) => {
        const gestionTour = new compraTour(page)
        await test.step('Seleccionar el tour y el período deseado', async () => {
            await gestionTour.seleccionarTouraAndPeriodo(1)
        })
    
        await test.step('Completar el formulario de pasajeros - Paso 1', async () => {
            await gestionTour.seleccionarCantidadHabitaciones(1, 5)
            await gestionTour.FormularioPasajeros(0, variables)
            await gestionTour.FormularioPasajeros(1, variables)
        })
    
        await test.step('Seleccionar actividades y plan Comfort - Paso 2', async () => {
            await gestionTour.agregarActividad(test)
            await gestionTour.selecionarPlanComfort()
        })
    
        await test.step('Realizar el pago total mediante transferencia bancaria - Paso 3', async () => {
            await gestionTour.pagoTotalTransferenciaBancaria()
        })
    
        await test.step('Validar estado de la compra exitosa mediante transferencia bancaria', async () => {
            await gestionTour.pagoTransferencia()
        })
    })
    
    test('Flujo de compra para el plan Standard con pago mediante tarjeta', async ({ page }) => {
        const gestionTour = new compraTour(page)
        await test.step('Seleccionar el tour y el período deseado', async () => {
            await gestionTour.seleccionarTouraAndPeriodo(1)
        })
    
        await test.step('Completar el formulario de pasajeros - Paso 1', async () => {
            await gestionTour.seleccionarCantidadHabitaciones(1, 5)
            await gestionTour.FormularioPasajeros(0, variables)
            await gestionTour.FormularioPasajeros(1, variables)
        })
    
        await test.step('Seleccionar actividades y plan Standard - Paso 2', async () => {
            await gestionTour.agregarActividad(test)
            await gestionTour.selecionarPlanStandard()
        })
    
        await test.step('Realizar el pago total con tarjeta - Paso 3', async () => {
            await gestionTour.pagoTotalConTarjeta()
        })
    
        await test.step('Validar estado de la compra exitosa', async () => {
            await gestionTour.pagoExitoso()
        })
    })
    
    test('Flujo de compra para el plan Comfort Plus con pago de reserva', async ({ page }) => {
        const gestionTour = new compraTour(page)
        await test.step('Seleccionar el tour y el período', async () => {
            await gestionTour.seleccionarTouraAndPeriodo(1)
        })
    
        await test.step('Completar el formulario de pasajeros - Paso 1', async () => {
            await gestionTour.seleccionarCantidadHabitaciones(1, 5)
            await gestionTour.FormularioPasajeros(0, variables)
            await gestionTour.FormularioPasajeros(1, variables)
        })
    
        await test.step('Seleccionar actividades y plan Comfort Plus - Paso 2', async () => {
            await gestionTour.agregarActividad(test)
            await gestionTour.selecionarPlanComfortPlus()
        })
    
        await test.step('Realizar el pago de reserva con Bizum - Paso 3', async () => {
            await gestionTour.pagoReservaTiempoBizum()
        })
    
        await test.step('Validar estado de la compra exitosa', async () => {
            await gestionTour.pagoExitoso()
        })
    })
    
    test('Validación de formulario: campos vacíos durante el proceso de compra', async ({ page }) => {
        const gestionTour = new compraTour(page)
        await test.step('Iniciar el proceso de compra seleccionando un tour y período', async () => {
            await gestionTour.seleccionarTouraAndPeriodo(1)
        })
    
        await test.step('Verificar mensajes de error para campos obligatorios vacíos', async () => {
            await gestionTour.seleccionarCantidadHabitaciones(1, 5)
            await gestionTour.validacionCamposVacios()
        })
    })

    test('Validación de formulario: fechas inválidas en el proceso de compra', async ({ page }) => {
        const gestionTour = new compraTour(page)
        await test.step('Iniciar el proceso de compra seleccionando un tour y período', async () => {
            await gestionTour.seleccionarTouraAndPeriodo(1)
        })
    
        await test.step('Verificar mensajes de error para fechas no válidas', async () => {
            await gestionTour.seleccionarCantidadHabitaciones(1, 5)
            await gestionTour.validacionFechasInvalidas()
        })
    })
})

