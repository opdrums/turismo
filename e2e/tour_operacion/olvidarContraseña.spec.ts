import { test } from '@playwright/test'
import * as fs from 'fs'
import olvidarContraseña from '../pageObjectModel/tour_operacion/olvidarContraseña';

const { chromium } = require('playwright')
const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/olvidarContraseña.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))

test.describe('Como automatizador quiero crear casos de olvidar contraseña', () => {

    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlBase)
        await page.context().clearCookies()
        await page.close()
    })

    test('crear flujo de olvidar contraseña exitoso', async ({page}) => {
        const recuperacion = new olvidarContraseña()
        test.info().annotations.push({
          type: 'info',
          description: 'Tener presente que si dejan de llegar códigos de confirmación al correo, el usuario debe esperar una hora'
        });
      
        const isHeadless = !!process.env.CI
        const browser = await chromium.launch({ headless: isHeadless })
        const context = await browser.newContext()
        const view1 = await context.newPage()
        const view2 = await context.newPage()
        await page.close()

        await test.step('Abrir vistas', async () => {
            await recuperacion.abrirVistas(view1, view2, variables)
        })

        await test.step('Iniciar proceso de recuperación de contraseña', async () => {
            await recuperacion.iniciarRecuperacionContraseña(view1, variables)
        })
      
        await test.step('Iniciar sesión en la cuenta de Microsoft', async () => {
            await recuperacion.iniciarSesionMicrosoft(view2, variables)
        })
      
        await test.step('Acceder al correo y obtener el código de verificación', async () => {
            await recuperacion.obtenerCodigoVerificacion(view2, variables)
        })
    
        await test.step('Verificar éxito en el restablecimiento de contraseña', async () => {
            await recuperacion.codigoVerificacionCorrecto(view1, variables)
        })
      })

    test('Ingreso de código de verificación incorrecto', async ({ page }) => {
        const recuperacion = new olvidarContraseña(page)
        test.info().annotations.push({
            type: 'bug',
            description: 'El mensaje de error para código de validación incorrecto no se muestra. Es necesario agregar un paso que verifique este mensaje.'
        })

        await test.step('Iniciar proceso de recuperación de contraseña', async () => {
            await recuperacion.flujoCodigoRecuperacion(variables)
        })
        
        await test.step('Ingresar código de verificación incorrecto y nueva contraseña', async () => {
            await recuperacion.codigoVerificacionIcorrecto(variables)
        })
    })
    
    test('Verificación de contraseñas no coincidentes', async ({ page }) => {
        const recuperacion = new olvidarContraseña(page)
        await test.step('Iniciar proceso de recuperación de contraseña', async () => {
            await recuperacion.flujoCodigoRecuperacion(variables)
        })
        
        await test.step('Validar alerta de contraseñas no coincidentes', async () => {
           await recuperacion.validacionContraseñaIncorrecta(variables)
        })
    })
    
    test('Validación de campos obligatorios vacíos', async ({ page }) => {
        const recuperacion = new olvidarContraseña(page)
        await test.step('Iniciar proceso de recuperación de contraseña', async () => {
            await recuperacion.flujoCodigoRecuperacion(variables)
        })

        await test.step('Validar alertas de campos obligatorios vacíos', async () => {
            await recuperacion.validacionCamposVacios()
        })
    })
})
