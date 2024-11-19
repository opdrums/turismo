import { expect } from "@playwright/test";

export class landings {

    constructor(page) {
        this.page = page
        this.newSlug = null
        this.titleLanding = null
    }

    async abrirVistas(variables) {
        this.page.setDefaultTimeout(120000)
        this.page.goto(variables.urlWeb)
    }

    async login(variables) {
        await this.page.locator('#user').fill(variables.userName);
        await this.page.locator('#password').fill(variables.password);
        await this.page.getByRole('button', { name: 'Entrar' }).click();
        await this.page.getByRole('link', { name: ' Landings' }).waitFor({ state: 'visible' })
    }

    async formulario(variables) {
        const slug = ['destinos-populares', 'ofertas-de-viaje', 'experiencias-unicas', 'tours-guiados', 'viajes-en-familia', 'escapadas-romanticas', 'aventura-y-naturaleza', 'playas-y-resorts'];
        const slugAleatorio = slug[Math.floor(Math.random() * slug.length)]
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000)

        await this.page.getByRole('link', { name: ' Landings' }).click({force: true })
        await this.page.getByLabel('Crear').click()

        await this.page.locator('#title-input').fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await this.page.locator('#slug-input').fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await this.page.locator('//div[4]/div/div[2]/div/div/div[2]/div/div/div').fill(variables.descripcionSlug)
        await this.page.locator('[id="seo\\.title-input"]').fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await this.page.locator('//div/div[2]/div/div[2]/div/div/div[2]/div/div/div').fill(variables.descripcionSeo)
        this.titleLanding = await this.page.locator('#title-input').inputValue()
        this.newSlug = await this.page.locator('#slug-input').inputValue()
    }

    async ingresoLanding() {
        if (!this.newSlug) {
            throw new Error('Error: newSlug está null, asegúrate de ejecutar formulario() antes')
        }
        const slugLimpio = this.newSlug.trim()
        await this.page.goto(`https://new.differentroads.es/es/landing/${slugLimpio}`)
        expect( await this.page.locator('//body/header/div[2]/ul')).toBeVisible()
    }

    async agregarComponente(){
        await this.page.getByRole('button', { name: 'Agregar componente' }).click()
        await this.page.locator('input[name="nameBlock"]').nth(0).fill(this.newSlug)
    }

    async formularioBanner(variables){
        await this.page.locator('.styles_defPreviewContainer__bQkHh').first().click()
        await this.page.getByRole('button', { name: 'Agregar', exact: true }).click()
        await this.page.locator('[id="blocks\\[0\\]\\.title-input"]').fill(`descripcion del banner ${this.newSlug}`)
        await this.page.locator('[id="blocks\\[0\\]\\.subtitle-input"]').fill(variables.descripcionBanner)
    }

    async formularioIntroText(variables){
        await this.page.locator('div').filter({ hasText: /^Landing intro text$/ }).first().click()
        await this.page.getByRole('button', { name: 'Agregar', exact: true }).click()
        await this.page.locator('//*[@id="blocks[0].title-input"]').fill(variables.tituloIntroText)
        await this.page.locator('//div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[2]/div/div/div').fill(variables.desciptionIntroText)
    }

    async formularioTourCarouserl(variables){
        await this.page.locator('div').filter({ hasText: /^Tour carousel$/ }).first().click()
        await this.page.getByRole('button', { name: 'Agregar', exact: true }).click()
        await this.page.locator('[id="blocks\\[0\\]\\.title-input"]').fill(variables.tituloCarousel)
    }

    async publicarLanding(){
        await this.page.locator('//form/div[2]/button/span').click()
        await this.page.waitForTimeout(5000)
    }

    async validacionCamposVacios(){
        await this.page.getByRole('link', { name: ' Landings' }).click()
        await this.page.getByLabel('Crear').click()
        await this.page.locator('//form/div[2]/button/span').click()
        await this.page.getByText('El campo title es requerido.').waitFor({ state: 'visible' })
        expect(await this.page.getByText('El campo title es requerido.')).toHaveText('El campo title es requerido.')
        expect(await this.page.getByText('El campo slug es requerido.')).toHaveText('El campo slug es requerido.')
    }
}

export default landings;
