import { expect, test } from '@playwright/test'
const { chromium } = require('playwright');
import * as fs from 'fs'

const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/web/registroUsuario.json')
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));

test.describe('como automatizador quiero validar el flujo de registro de usuario', () => {
    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlBase)
        await page.context().clearCookies()
        await page.close()
    })

    let correoprovicional
    let codigoVerificacion

    test('registro de usuario', async ({}) => {
        const browser = await chromium.launch({ headless: false }) 
        const context = await browser.newContext()
   
        const view1 = await context.newPage()
        const view2 = await context.newPage()
   
        view1.setDefaultTimeout(120000)
        view2.setDefaultTimeout(120000)
   
        await Promise.all([ 
            view1.goto(variables.urlBase),
            view2.goto(variables.urlMail)
        ]);

        await test.step('vista 1', async () => {
            await view1.getByRole('link', { name: 'SIGN IN' }).click()
            await view1.getByRole('link', { name: '¿Aun no tienes cuenta?' }).click()
            await view1.waitForTimeout(2000)
        })

        await test.step('vista 2', async () => {
            await view2.locator('//*[@id="Dont_use_WEB_use_API"]').waitFor({state: 'visible'})
            let texto = await view2.locator('//*[@id="Dont_use_WEB_use_API"]').getAttribute('value')
            correoprovicional = texto
        })
        
        await test.step('formylario de regstro', async () => {
            await view1.getByPlaceholder('Telefono').waitFor({state: 'visible'})
            await view1.getByPlaceholder('E-mail').fill(correoprovicional)
            await view1.getByPlaceholder('Contraseña', { exact: true }).fill(variables.passwordWeb)
            await view1.getByPlaceholder('Confirmar Contraseña').fill(variables.passwordWeb)
            await view1.getByPlaceholder('Nombre').fill(variables.nombre)
            await view1.getByPlaceholder('Apellidos').fill(variables.apellido)
            await view1.getByPlaceholder('Telefono').fill(variables.telefono)
            await view1.getByRole('button', { name: 'Continuar' }).click()
        })

        await test.step('obtener codigo', async () => {
            await view2.getByRole('link', { name: 'I info@differentroads.es' }).waitFor({state: 'visible'})
            await view2.getByRole('link', { name: 'I info@differentroads.es' }).click()
            await view2.evaluate(() => location.reload()); 
            
            const link = view2.getByRole('link', { name: 'I info@differentroads.es' });

            try {
                await link.waitFor({ state: 'visible', timeout: 3000 });
                await link.click();
            } catch (error) {
                console.log('El elemento no es visible, continuar...');
            }

            const text = await view2.locator('[id="__nuxt"] iframe').contentFrame().getByText('Your confirmation code is').textContent()
            codigoVerificacion = text.match(/\d+/)[0]    
            view2.close()
       })
       
        await test.step('escribir codigo', async () => {
            await view1.getByRole('button', { name: 'Verificar código' }).waitFor({state: 'visible'})
            await view1.getByPlaceholder('Código de confirmación').fill(codigoVerificacion)
            await view1.getByRole('button', { name: 'Verificar código' }).click()
       })
       
       await test.step('el sistema redirecciona a la vista de compras de tour', async () => {
            await view1.getByRole('link', { name: correoprovicional }).waitFor({state: 'visible'})
            expect(view1.getByRole('link', { name: correoprovicional})).toBeVisible()
        })
    })
})
