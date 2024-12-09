import {test } from '@playwright/test'
import * as fs from 'fs'
import gestionTour from '../pageObjectModel/tour_operacion/gestionTour'
import * as dotenv from 'dotenv'

const path = require('path')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/gestionTour.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))
dotenv.config()

test.describe('Como automatizador quiero hacer flujos de gestion de tour', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.baseUrlMiddle}`)
    })

    test.afterEach(async ({ page }) => {
        await page.context().cookies(`${process.env.baseUrlMiddle}`)
        await page.context().clearCookies()
        await page.close()
    })
    
    test('Sincronización exitosa de un tour con la plataforma', async ({ page }) => {
        const sincronizacion = new gestionTour(page)
        await test.step('Iniciar sesión en la plataforma de tours', async () => {
            await sincronizacion.iniciarSessionTourOperacion(variables)
        })
    
        await test.step('Sincronización del tour con éxito', async () => {
            await sincronizacion.sincronizacionTour(test)
            await sincronizacion.sincronizacionExitosa()
        })
    })
    
    test('Edición completa de un tour en la plataforma', async ({ page}) => {
        const sincronizacion = new gestionTour(page)
        
        await test.step('Iniciar sesión en la plataforma de tours', async () => {
            await sincronizacion.iniciarSessionTourOperacion(variables)
        })
    
        await test.step('Seleccionar un tour para edición', async () => {
            await sincronizacion.seleccionarTour(0)
            await sincronizacion.edicionTour()
        })

        await test.step('Modificar las configuraciones de un periodo', async () => {
            await sincronizacion.edicionPeriodo(1)
        })

        await test.step('Modificar las configuraciones de habitaciones', async () => {
            await sincronizacion.edicionHabitaciones()
          
        })
        
        await test.step('Modificar las configuraciones de una actividad', async () => {
            await sincronizacion.edicionActividad(test)
            await sincronizacion.publicarTour('si'.toLocaleLowerCase(), test)
        })  
    })

    test('Validación de campos obligatorios vacíos en la configuración de un tour', async ({ page }) => {
        const sincronizacion = new gestionTour(page)

        await test.step('Iniciar sesión en la plataforma de tours', async () => {
            await sincronizacion.iniciarSessionTourOperacion(variables)
        })
    
        await test.step('Seleccionar un tour para verificación', async () => {
            await sincronizacion.seleccionarTour(1)
        })

        await test.step('Verificar campos obligatorios vacíos en el formulario', async () => {
            await sincronizacion.validacionCamposVaciosPeriodo(1)
            await sincronizacion.validacionCamposVaciosHabitacion()
            await sincronizacion.validacionCamposVaciosActividad(test)
            await sincronizacion.validacionCamposVaciosTour()
        })  
    })
})
