import { test } from "@playwright/test"
import * as fs from 'fs'
import reservaTour from "../pageObjectModel/tour_operacion/reservas"
import * as dotenv from 'dotenv'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/reservasTour.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))
dotenv.config()

test.describe('como automatizador quiero hacer flujos de reserva', () => {
   
    test.beforeEach(async ({ page }) => {
        const reserva = new reservaTour(page)
        await reserva.loginUser(variables)
    })

    test.afterEach(async ({ page }) => {
        await page.context().cookies(`${process.env.baseUrlMiddle}`)
        await page.context().clearCookies()
        await page.close()
    })
    
    test('Validación de reservas confirmadas', async ({ page }) => {
        const reserva = new reservaTour(page)
        
        await test.step('Navegar a la vista de reservas confirmadas', async () => {
            await reserva.validacionReservas('Confirmadas', test)
        })
    
        await test.step('Verificar información de los pasajeros en una reserva', async () => {
            await reserva.validacionPasajeros(test)
        })
    })
    
    test('Validación de reservas no confirmadas', async ({ page }) => {
        const reserva = new reservaTour(page)
        
        await test.step('Navegar a la vista de reservas no confirmadas', async () => {
            await reserva.validacionReservas('No Confirmadas', test)
        })
    
        await test.step('Verificar información de los pasajeros en una reserva', async () => {
            await reserva.validacionPasajeros(test)
        })
    })
    
    test('Validación de reservas abandonadas', async ({ page }) => {
        const reserva = new reservaTour(page)
        
        await test.step('Navegar a la vista de reservas abandonadas', async () => {
            await reserva.validacionReservas('Abandonadas', test)
        })
    
        await test.step('Verificar información de los pasajeros en una reserva', async () => {
            await reserva.validacionPasajeros(test)
        })
    })

    test('validacion de filtros', async ({ page }) => {
        const reserva = new reservaTour(page)
        await test.step('Verificar información de los pasajeros en una reserva', async () => {
            await reserva.agregarFiltros(test, variables)
        })
    })
})
