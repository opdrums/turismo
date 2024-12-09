import { test } from "@playwright/test";
import invitacionUsuario from '../pageObjectModel/tour_operacion/invitacionUsuario'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

const path = require('path')
const { chromium } = require('playwright')
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/invitacionUsuario.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))
dotenv.config()

test.describe('Como automatizador quiero hacer el flujo de inivitaciones', () => {
    test.afterEach(async ({ page }) => {
        await page.context().cookies(`${process.env.baseUrlMiddle}`)
        await page.context().clearCookies()
        await page.close()
    })

    for(const rol of variables.roles){
        test(`Enviar invitaciones ${rol}`, async ({page}) => {
            let invitacion = new invitacionUsuario()

            const isHeadless = !!process.env.CI
            const browser = await chromium.launch({ headless: isHeadless })
            const context = await browser.newContext()
            const view1 = await context.newPage()
            const view2 = await context.newPage()
            await page.close()

            await test.step('Abrir vistas', async () => {
                await invitacion.abrirVistas(view1, view2, variables)
            })
    
           await test.step('Iniciar sesión y acceder a la sección de Usuarios', async () => {
              await invitacion.iniciarSessionTourOperacion(view1,variables)
            })
    
            await test.step('Obtener correo temporal para invitación', async () => { 
               await invitacion.obtenerEmailProvicional(view2)
            })
            
            await test.step('Seleccionar rol', async () => {
              await invitacion.seleccionarRol(view1, rol)
            })

            await test.step('Abrir correo e iniciar confirmación de cuenta', async () => {
               await invitacion.obtenerCodigoConfirmacion(view2, test)
            })
    
            await test.step('Validar apertura de registro de cuenta en nueva vista', async () => {
               await invitacion.validarTituloRegistroUsuario(context)
            })
        })      
    }

    test(`Enviar invitación con el campo de correo vacío `, async ({page}) => {
        const invitaciones = new invitacionUsuario(page)
        await test.step('Iniciar sesión y acceder a la sección de Usuarios', async () => {
            await invitaciones.iniciarSessionInvitacion(variables)
        })

        await test.step('Verificar mensaje de error con campo vacio email y rol', async () => {
           await invitaciones.validacionCorreoAndRolVacio()
        })
    })
   
    test(`Enviar invitación a un correo existente`, async ({page}) => {
        const invitaciones = new invitacionUsuario(page)
        await test.step('Iniciar sesión y acceder a la sección de Usuarios', async () => {
            await invitaciones.iniciarSessionInvitacion(variables)
        })

        await test.step('Verificar mensaje de error de selección de rol', async () => {
            await invitaciones.validacionCorreoExiste(variables)
        })
    })  
})