import {  expect,test } from "@playwright/test";
const { chromium } = require('playwright');
import * as fs from 'fs'
import invitacionUsuario from '../pageObjectModel/tour_operacion/invitacionUsuario'

const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/invitacionUsuario.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));
let invitacion = new invitacionUsuario()

test.describe('Como automatizador quiero hacer el flujo de inivitaciones', () => {
    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlBase)
        await page.context().clearCookies()
        await page.close()
    })

    for(const rol of variables.roles){
        test(`Enviar invitaciones ${rol}`, async ({}, testInfo) => {
            const isHeadless = !!process.env.CI
            const browser = await chromium.launch({ headless: isHeadless })
            
            const context = await browser.newContext()
            const view1 = await context.newPage()
            const view2 = await context.newPage()

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
               await invitacion.obtenerCodigoConfirmacion(view2)
            })
    
            await test.step('Validar apertura de registro de cuenta en nueva vista', async () => {
               await invitacion.validarTituloRegistroUsuario(context)
            })
        })      
    }

    test(`Enviar invitación con el campo de correo vacío `, async ({page}) => {
        await test.step('Iniciar sesión y acceder a la sección de Usuarios', async () => {
            const invitaciones = new invitacionUsuario(page)
            invitaciones.iniciarSessionInvitacion(variables.urlBase, variables.userName, variables.password)
        })
  
        await test.step('No escribir correo y seleccionar rol', async () => {
            await page.getByRole('button', { name: 'Enviar invitación' }).click() 
        })

        await test.step('Verificar mensaje de error con campo vacio', async () => {
            const mensajeError1 = await page.locator('//div[2]/div/form/div/div[1]/p[1]').textContent()
            expect(mensajeError1).toBe('El correo electrónico es requerido.')   
            const mensajeError2 = await page.locator('//div[2]/div/form/div/div[2]/p[1 ]').textContent()
            expect(mensajeError2).toBe('Se debe seleccionar al menos un rol de usuario.')
        })
    })
   
    test(`Enviar invitación a un correo existente`, async ({page}) => {
        await test.step('Iniciar sesión y acceder a la sección de Usuarios', async () => {
            const invitaciones = new invitacionUsuario(page)
            invitaciones.iniciarSessionInvitacion(variables.urlBase, variables.userName, variables.password)
        })
        
        await test.step('Escribir correo y seleccionar rol', async () => {
            await page.getByPlaceholder('E-mail').fill(variables.email)
            await page.locator('div').filter({ hasText: /^Admin de Tours$/ }).getByRole('checkbox').check()
            await page.getByRole('button', { name: 'Enviar invitación' }).click()
            await page.getByText('El correo electrónico es')
        })

        await test.step('Verificar mensaje de error de selección de rol', async () => {
            const mensajeError = await page.getByText('Error al enviar la invitación').textContent()
            await expect(mensajeError).toBe('Error al enviar la invitación. Por favor, intente de nuevo.') 
        })
    })  
})