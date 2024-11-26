import { expect } from "@playwright/test"
import * as dotenv from 'dotenv'
dotenv.config()

export class landings {

    constructor(page) {
        this.page = page
        this.newSlug = null
        this.titleLanding = null
    }

    async abrirVistas(variables) {
        this.page.setDefaultTimeout(120000)
        this.page.goto(`${process.env.baseUrlMiddle}`)
    }

    async login(variables) {
        await this.page.locator('#user').fill(variables.userName);
        await this.page.locator('#password').fill(variables.password);
        await this.page.getByRole('button', { name: 'Entrar' }).click();
        await this.page.getByRole('link', { name: ' Landings' }).waitFor({ state: 'visible' })
        await this.page.locator('//aside/nav/a[2]/div/p').click({force: true })
    }

    async formulario(variables) {
        const slug = ['destinos-populares', 'ofertas-de-viaje', 'experiencias-unicas', 'tours-guiados', 'viajes-en-familia', 'escapadas-romanticas', 'aventura-y-naturaleza', 'playas-y-resorts'];
        const slugAleatorio = slug[Math.floor(Math.random() * slug.length)]
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000)

        await this.page.getByLabel('Crear').click()
        await this.page.locator('#title-input').fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await this.page.locator('#bannerTitle-input').fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await this.page.locator('input[type="file"]').setInputFiles(process.env.urlImagen);
        await this.page.locator('#banner-alttext-input').fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await this.page.locator('#slug-input').fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await this.page.locator('//div[2]/div/div/div/div/div/div/span').first().fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await this.page.locator('[id="seo\\.title-input"]').fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await this.page.locator('//div/div[2]/div/div[2]/div/div/div[2]/div/div/div').fill(variables.descripcionSeo)
        this.newSlug = await this.page.locator('#slug-input').inputValue()
    }

    async ingresoLanding() {
        await this.page.getByRole('link', { name: 'Ver ' }).click()
         expect( await this.page.locator('//body/header/div[2]/ul')).toBeVisible()
     }

     async agregarComponente(){
        await this.page.getByRole('button', { name: 'Agregar componente' }).click()
        await this.page.locator('input[name="nameBlock"]').nth(0).waitFor({ state: 'visible' })
        await this.page.locator('input[name="nameBlock"]').nth(0).fill(this.newSlug)
    }

    async formularioBanner(variables){
        await this.page.locator('.styles_defPreviewContainer__bQkHh').first().click()
        await this.page.getByRole('button', { name: 'Agregar', exact: true }).click()
        await this.page.locator('[id="blocks\\[0\\]\\.title-input"]').fill(`descripcion del banner ${this.newSlug}`)
        await this.page.locator('[id="blocks\\[0\\]\\.subtitle-input"]').fill(variables.descripcionBanner)
    }

    async eliminarLanding(confirmacion, landing, test) {
        if (confirmacion == 'si'){
            const landingSelector = `//main/div[2]/div/div[2]/button[${landing}]`
            await this.page.locator(landingSelector).textContent()
        
            await this.page.locator(landingSelector).click()
            await this.page.locator('//div[5]/form/div[2]/div/button/i').click()
            await this.page.getByRole('button', { name: ' Eliminar' }).click()
        
            await this.page.waitForTimeout(2000)
            const isLandingVisible = await this.page.locator(landingSelector).isVisible()
            expect(isLandingVisible).toBe(true)
        }else {
            test.info().annotations.push({ type: 'info', description: `La opción seleccionada es: "${confirmacion}". No se encontró un landing disponible para eliminar.`})
        }
    }

    async despublicarLanding(confirmacion, landing, test) {
        if (confirmacion == 'si'){
            const landingSelector = `//main/div[2]/div/div[2]/button[${landing}]`
            await this.page.locator(landingSelector).textContent()
        
            await this.page.locator(landingSelector).click()
            await this.page.locator('//div[5]/form/div[2]/div/button/i').click()
            await this.page.getByRole('button', { name: ' Despublicar' }).click()
        
            await this.page.waitForTimeout(2000)
            const isLandingVisible = await this.page.locator(landingSelector).isVisible()
            expect(isLandingVisible).toBe(true)
        }else {
            test.info().annotations.push({ type: 'info', description: `La opción seleccionada es: "${confirmacion}". No se encontró un landing disponible para eliminar.`})
        }
    }

    async crearLanding(){
        await this.page.locator('//main/div[5]/form/div[2]/button').click()
        await this.page.waitForTimeout(2000)
    }

    async publicarLanding(){
        await this.page.locator('//main/div[5]/form/div[2]/button').click()
        await this.page.getByRole('link', { name: 'Ver ' }).click()
        await this.page.waitForTimeout(2000)
    }

    async validacionCamposVacios(){
        await this.page.getByRole('link', { name: ' Landings' }).click()
        await this.page.getByLabel('Crear').click()
        await this.page.locator('//form/div[2]/button/span').click()
        await this.page.getByText('El campo title es requerido.').waitFor({ state: 'visible' })
        expect(await this.page.getByText('El campo title es requerido.')).toHaveText('El campo title es requerido.')
        expect(await this.page.getByText('El campo slug es requerido.')).toHaveText('El campo slug es requerido.')
        expect(await this.page.getByText('El campo banner es requerido.')).toHaveText('El campo banner es requerido.')
    }
}

export default landings;
