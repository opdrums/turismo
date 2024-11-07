import { expect, test } from '@playwright/test'
const { chromium } = require('playwright');
import * as fs from 'fs'
import olvidarContraseña from '../pageObjectModel/tour_operacion/olvidarContraseña';

const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/olvidarContraseña.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const recuperacion = new olvidarContraseña()

test.describe('Como automatizador quiero crear casos de olvidar contraseña', () => {
    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlBase)
        await page.context().clearCookies()
        await page.close()
    })

    test('crear flujo de olvidar contraseña exitoso', async () => {
        test.info().annotations.push({
          type: 'info',
          description: 'Tener presente que si dejan de llegar códigos de confirmación al correo, el usuario debe esperar una hora'
        });
      
        const isHeadless = !!process.env.CI
        const browser = await chromium.launch({ headless: isHeadless })
        const context = await browser.newContext()
        const view1 = await context.newPage()
        const view2 = await context.newPage()
      
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
      
        await test.step('Ingresar el código de verificación y establecer nueva contraseña', async () => {
          await view1.getByPlaceholder('Código de confirmación').fill(recuperacion.codigoVerificacion)
          await view1.getByPlaceholder('Nueva Contraseña', { exact: true }).fill(variables.password)
          await view1.getByPlaceholder('Confirmar Nueva Contraseña').fill(variables.password)
          await view1.getByRole('button', { name: 'Confirmar' }).click()
        })
      
        await test.step('Verificar éxito en el restablecimiento de contraseña', async () => {
          const texto = await view1.locator('//html/body/div/div/div/div[2]/p[1]').textContent()
          expect(texto).toBe('Contraseña reestablecida con éxito.')
        })
      })

    test('Ingreso de código de verificación incorrecto', async ({ page }) => {
        test.info().annotations.push({
            type: 'bug',
            description: 'El mensaje de error para código de validación incorrecto no se muestra. Es necesario agregar un paso que verifique este mensaje.'
        })

        await test.step('Iniciar proceso de recuperación de contraseña', async () => {
            const recuperacionCodigo = new olvidarContraseña(page)
            recuperacionCodigo.flujoCodigoRecuperacion(variables.urlTour, variables.userName)
        })
        
        await test.step('Ingresar código de verificación incorrecto y nueva contraseña', async () => {
            await page.getByPlaceholder('Código de confirmación').fill(variables.codigoInvalido)
            await page.getByPlaceholder('Nueva Contraseña', { exact: true }).fill(variables.password)
            await page.getByPlaceholder('Confirmar Nueva Contraseña').fill(variables.password)
            await page.getByRole('button', { name: 'Confirmar' }).click()
        })
    })
    
    test('Verificación de contraseñas no coincidentes', async ({ page }) => {
        await test.step('Iniciar proceso de recuperación de contraseña', async () => {
            const recuperacionCodigo = new olvidarContraseña(page)
            recuperacionCodigo.flujoCodigoRecuperacion(variables.urlTour, variables.userName)
        })
        
        await test.step('Ingresar código de verificación y contraseñas no coincidentes', async () => {
            await page.getByPlaceholder('Código de confirmación').fill(variables.codigoInvalido)
            await page.getByPlaceholder('Nueva Contraseña', { exact: true }).fill(variables.password)
            await page.getByPlaceholder('Confirmar Nueva Contraseña').fill('falsa contraseña')
            await page.getByRole('button', { name: 'Confirmar' }).click()
        });
    
        await test.step('Validar alerta de contraseñas no coincidentes', async () => {
            let texto = await page.locator('//div/div/div/div[2]/form/div[3]/p').textContent()
            expect(texto).toBe('Las contraseñas no coinciden.')
        })
    })
    
    test('Validación de campos obligatorios vacíos', async ({ page }) => {
        await test.step('Iniciar proceso de recuperación de contraseña', async () => {
            const recuperacionCodigo = new olvidarContraseña(page)
            recuperacionCodigo.flujoCodigoRecuperacion(variables.urlTour, variables.userName)
        })

        await test.step('Intentar confirmar con campos de contraseña vacíos', async () => {
            await page.getByRole('button', { name: 'Confirmar' }).click()
        })
    
        await test.step('Validar alertas de campos obligatorios vacíos', async () => {
            let codigo = await page.locator('//div/div/div/div[2]/form/div[1]/p').textContent()
            let contraseña = await page.locator('//div/div/div/div[2]/form/div[2]/p').textContent()
            let confirmarContraseña = await page.locator('//div/div/div/div[2]/form/div[3]/p').textContent()
            expect(codigo).toBe('El código de confirmación es obligatorio.')
            expect(contraseña).toBe('La contraseña debe tener entre 7 y 14 caracteres.')
            expect(confirmarContraseña).toBe('La confirmación de la contraseña es obligatoria.')
        })
    })
})
