import {  expect,test } from "@playwright/test";
import * as fs from 'fs'
import { setTimeout } from "timers/promises";
const { chromium } = require('playwright');

const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/invitacion.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));

test.describe('Automatizacion invitacion de usuarios', () => {

    test.afterEach(async ({ page }) => {
        await page.context().cookies(variables.urlBase)
        await page.context().clearCookies()
        //await page.close()
    })

    for(const rol of variables.roles){
        test(`Enviar invitaciones ${rol}`, async ({}, testInfo) => {
            testInfo.setTimeout(120000);
            const browser = await chromium.launch({ headless: false }) 
            const context = await browser.newContext()
    
            const view1 = await context.newPage()
            const view2 = await context.newPage()
    
            let correoprovicional 
    
            view1.setDefaultTimeout(120000);
            view2.setDefaultTimeout(120000);
    
            await Promise.all([ 
                view1.goto(variables.urlBase),
                view2.goto(variables.urlMail) 
            ]);
    
           await test.step('Iniciar sesión y acceder a la sección de Usuarios', async () => {
                await view1.locator('#user').fill(variables.userName)
                await view1.locator('#password').fill(variables.password)
                await view1.getByRole('button', { name: 'Entrar'}).click()
                await view1.getByRole('link', { name: ' Usuarios' }).click()
                await view1.getByRole('button', { name: 'Invitar Usuario' }).click()
            })
    
            await test.step('Obtener correo temporal para invitación', async () => { 
                
                view2.locator('//*[@id="Dont_use_WEB_use_API"]').waitFor({state: 'visible'})
                let texto = await view2.locator('//*[@id="Dont_use_WEB_use_API"]').getAttribute('value');
                correoprovicional = texto;
            })
            
            await test.step('Escribir correo y seleccionar rol', async () => {
                await view1.getByPlaceholder('E-mail').fill(correoprovicional)
                await view1.locator('div').filter({ hasText: new RegExp(`^${rol}$`) }).getByRole('checkbox').check()
                await view1.getByRole('button', { name: 'Enviar invitación' }).click()
            })
            await test.step('Abrir correo e iniciar confirmación de cuenta', async () => {
                await view2.getByRole('link', { name: 'I info@differentroads.es' }).waitFor({state: 'visible'})
                await view2.getByRole('link', { name: 'I info@differentroads.es' }).click()
                try {
                    
                    await view2.getByRole('button', { name: 'Close' }).waitFor({ state: 'visible', timeout: 3000 });
                    

                    await view2.mouse.click(1000, 2000)
                } catch (error) {
                    console.log('Popup no apareció, continuando con el flujo'); 
                }
    
                await view2.locator('[id="__nuxt"] iframe').contentFrame().getByRole('link', { name: 'Aceptar invitación' }).click()
            })   
    
            await test.step('Validar apertura de registro de cuenta en nueva vista', async () => {
                const [view3] = await Promise.all([
                    context.waitForEvent('page'), 
                ])
                view3.getByRole('heading', { name: 'Completa tu registro' }).waitFor({state: 'visible'})
                let validacion = await view3.locator('h1.auth-card-header-title').textContent()
                expect(validacion).toBe('Completa tu registro')
            })
            
        })       
        


    }

    test(`Enviar invitación con el campo de correo vacío `, async ({page}) => {

        await test.step('Navegar a la página de inicio de sesión', async () => {
            await page.goto(variables.urlBase); 
        });
           
        await test.step('Iniciar sesión y acceder a la sección de Usuarios', async () => {
            await page.locator('#user').fill(variables.userName)
            await page.locator('#password').fill(variables.password)
            await page.getByRole('button', { name: 'Entrar'}).click()
            await page.getByRole('link', { name: ' Usuarios' }).click()
            await page.getByRole('button', { name: 'Invitar Usuario' }).click()
        })



        await test.step('No escribir correo y seleccionar rol', async () => {
            await page.getByPlaceholder('E-mail').fill('')
            
            await page.locator('div').filter({ hasText: /^Admin de Tours$/ }).getByRole('checkbox')
            await page.getByRole('button', { name: 'Enviar invitación' }).click()            
        })

        await test.step('Verificar mensaje de error con campo vacio', async () => {
            const mensajeError1 = await page.getByText('El correo electrónico es');
            await expect(mensajeError1).toBeVisible();   
            const mensajeError2 = await page.getByText('Se debe seleccionar al menos');
            await expect(mensajeError2).toBeVisible(); 
        });

    })


   
    test(`Enviar invitación a un correo existente`, async ({page}) => {

        await test.step('Navegar a la página de inicio de sesión', async () => {
            await page.goto(variables.urlBase); 
        });
       
        await test.step('Iniciar sesión y acceder a la sección de Usuarios', async () => {
            await page.locator('#user').fill(variables.userName)
            await page.locator('#password').fill(variables.password)
            await page.getByRole('button', { name: 'Entrar'}).click()
            await page.getByRole('link', { name: ' Usuarios' }).click()
            await page.getByRole('button', { name: 'Invitar Usuario' }).click()
        })
        
        await test.step('Escribir correo y seleccionar rol', async () => {
            await page.getByPlaceholder('E-mail').fill('operez@differentroads.co')
            await page.locator('div').filter({ hasText: /^Admin de Tours$/ }).getByRole('checkbox')
            
            await page.getByRole('button', { name: 'Enviar invitación' }).click()
            await page.getByText('El correo electrónico es')
        })

        await test.step('Verificar mensaje de error de selección de rol', async () => {
            const mensajeError = await page.getByText('Se debe seleccionar al menos');
            await expect(mensajeError).toBeVisible(); 
        });
        
    })
        
})