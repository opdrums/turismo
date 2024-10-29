import {  expect,test } from "@playwright/test";
import * as fs from 'fs'
import { url } from "inspector";

const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/invitacion.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));



test.describe('Inicio de sesión', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(variables.urlBase)
        await page.waitForURL(variables.urlBase)
        await page.locator('#user').fill(variables.userName)
        await page.locator('#password').fill(variables.password)
        await page.getByRole('button', { name: 'Entrar'}).click()
        //await page.waitForNavigation({timeout:10000});
        expect(page.getByRole('img', { name: 'Different Roads' })).toBeVisible()
     })

    test.afterEach(async ({ page }) => {
     //await page.context().cookies(variables.urlBase);
     await page.context().clearCookies();
    })

    test('Seleccionar opción de usuarios', async ({ page }) => {
        await test.step('Selecciono la opción Usuarios',async () =>{
            //await page.locator('xpath=/html/body/main/aside/nav/a/div/p');
            await page.waitForSelector('text=Usuarios',{ timeout: 10000})
            await page.getByRole('link', { name: ' Usuarios' }).click()
            await expect(page).toHaveURL(/.*users/)
        })
        await test.step('El sistema debe permitir seleccionar el botón Invitar Usuario', async () => {
            await page.getByRole('button', { name: 'Invitar Usuario' }).waitFor({state:'visible'}) // Forma explicita de colocar a esperar un tiempo.
            await page.getByRole('button', { name: 'Invitar Usuario' }).click()
        })
        await test.step('Ingresar correo y seleccionar rol', async() =>{
            /*
            await page.locator('xpath=/html/body/main/section/div[1]/div[3]/div[2]/div[2]/div/form/div/div[1]/input').fill('gekapab816@aleitar.com')
            await page.locator('xpath=/html/body/main/section/div[1]/div[3]/div[2]/div[2]/div/form/div/div[2]/div[2]/div[1]/input').check()
            await page.locator('xpath=/html/body/main/section/div[1]/div[3]/div[2]/div[2]/div/form/div/div[2]/div[2]/div[2]/input').check()
            await page.locator('xpath=/html/body/main/section/div[1]/div[3]/div[2]/div[2]/div/form/div/div[2]/div[2]/div[3]/input').check()
            await page.locator('xpath=/html/body/main/section/div[1]/div[3]/div[2]/div[2]/div/form/div/div[2]/div[2]/div[4]/input').check()
            await page.locator('xpath=/html/body/main/section/div[1]/div[3]/div[2]/div[2]/div/form/div/div[2]/div[2]/div[5]/input').check()
*/
           // await page.locator getByPlaceholder('E-mail')
            //await page.locator('div').filter({ hasText: /^Admin de Contenidos$/ }).getByRole('checkbox').check()

        })
        
    })
    
})