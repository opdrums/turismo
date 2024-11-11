import { expect, test } from '@playwright/test'
import compraTour from '../pageObjectModel/web/compraTour'
import * as fs from 'fs'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/web/compras.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))


test.describe('Como automatizador, quiero realizar el flujo de compra de un tour', () => {

    test.beforeEach(async ({ page }) => {
        const compra = new compraTour(page)
        await compra.loginUser(variables.urlWeb, variables.email, variables.password)
    });

    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlWeb);
        await page.context().clearCookies()
        //await page.close()
    })

    test('Automatización del flujo de compra con el plan Comfort', async ({ page }) => {
        const compra = new compraTour(page)

        await test.step('Iniciar el proceso de compra de un tour', async () => {
            await compra.seleccionarTouraAndPeriodo(2)
        })

        await test.step('Seleccionar la cantidad de pasajeros y el tipo de habitación', async () => {
            await compra.seleccionarCantidadHabitaciones()
        })

       await test.step('Completar los datos del pasajero 1 en el formulario', async () => {
            await compra.FormularioPasajeros(0, variables.nombre, variables.apellido, variables.telefono, variables.genero, variables.fechaCumpleaños, variables.userEmail, variables.Dni, variables.fechaCaducidad, variables.fechaExpedicion, variables.codigoPostal, variables.nacionalidad)
            await compra.FormularioPasajeros(1, variables.nombre, variables.apellido, variables.telefono, variables.genero, variables.fechaCumpleaños, variables.userEmail, variables.Dni, variables.fechaCaducidad, variables.fechaExpedicion, variables.codigoPostal, variables.nacionalidad)
        })

        await test.step('Seleccionar el plan Comfort y actividad', async () => {
            await compra.agregarActividad()
            await compra.selecionarPlanComfort()
        })

        await test.step('flujo de compra', async () => {
            await compra.pagoTotalConTarjeta()
            //await compra.flujoCompraBancaria()
        });
    })
})

