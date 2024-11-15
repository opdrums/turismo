import {expect, test } from '@playwright/test'
import * as fs from 'fs'
import gestionTour from '../pageObjectModel/tour_operacion/gestionTour'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/gestionTour.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))

test.describe('Como automatizador quiero hacer flujos de gestion de tour', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(variables.urlBase)
    })
    
    test('Sincronización exitosa de un tour', async ({ page }) => {
        const sincronizacion = new gestionTour(page)
        await test.step('Inicio de sesión en tours operación', async () => {
            await sincronizacion.iniciarSessionTourOperacion(variables)
        })
    
        await test.step('Sincronización del tour con éxito', async () => {
            await sincronizacion.sincronizacionTour(test)
            await sincronizacion.sincronizacionExitosa()
        })
    }) 
    
    test('edicion de un tour', async ({ page}) => {
        
        const sincronizacion = new gestionTour(page)
        
        await test.step('Inicio de sesión en tours operación', async () => {
            await sincronizacion.iniciarSessionTourOperacion(variables)
        })
    
        await test.step('seleccionar el tour', async () => {
            await sincronizacion.seleccionarTour(1)
        })

        await test.step('edicion de tour y periodo', async () => {
            await sincronizacion.edicionTour()
            await sincronizacion.edicionPeriodo(1)
        })

        await test.step('edicion de habitaciones', async () => {
            await sincronizacion.habitaciones()
            await sincronizacion.publicarTour('si'.toLocaleLowerCase(), test)
        })
    })
})
