import { expect } from "@playwright/test";

export class landings {

    constructor(page) {
        this.page = page;
        this.newSlug = null;
    }

    async abrirVistas(view1, view2, variables) {
        view1.setDefaultTimeout(120000);
        view2.setDefaultTimeout(230000);

        await Promise.all([
            view1.goto(variables.urlWeb),
        ]);
    }

    async login(view1, variables) {
        await view1.locator('#user').fill(variables.userName);
        await view1.locator('#password').fill(variables.password);
        await view1.getByRole('button', { name: 'Entrar' }).click();
        await view1.getByRole('link', { name: ' Landings' }).waitFor({ state: 'visible' })
    }

    async formulario(view1, variables) {
        const slug = ['destinos-populares', 'ofertas-de-viaje', 'experiencias-unicas', 'tours-guiados', 'viajes-en-familia', 'escapadas-romanticas', 'aventura-y-naturaleza', 'playas-y-resorts'];
        const slugAleatorio = slug[Math.floor(Math.random() * slug.length)]
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000)

        await view1.getByRole('link', { name: ' Landings' }).click({force: true })
        await view1.getByLabel('Crear').click()

        await view1.locator('#title-input').fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await view1.locator('#slug-input').fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await view1.locator('//div[4]/div/div[2]/div/div/div[2]/div/div/div').fill(variables.descripcionSlug)
        await view1.locator('[id="seo\\.title-input"]').fill(`${slugAleatorio}${numeroAleatorio}`, { force: true })
        await view1.locator('//div/div[2]/div/div[2]/div/div/div[2]/div/div/div').fill(variables.descripcionSeo)
        this.newSlug = await view1.locator('#slug-input').inputValue()
    }

    async ingresoLanding(view2) {
        if (!this.newSlug) {
            throw new Error('Error: newSlug está null, asegúrate de ejecutar formulario() antes');
        }
        await view2.goto(`https://new.differentroads.es/es/landing/${this.newSlug}`);
    }

    async agregarComponente(view1){
        await view1.getByRole('button', { name: 'Agregar componente' }).click()
        await view1.locator('input[name="nameBlock"]').fill(this.newSlug)
    }

    async formularioBanner(view1, variables){
        await view1.locator('.styles_defPreviewContainer__bQkHh').first().click()
        await view1.getByRole('button', { name: 'Agregar', exact: true }).click()
        await view1.locator('[id="blocks\\[0\\]\\.title-input"]').fill(`descripcion del banner ${this.newSlug}`)
        await view1.locator('[id="blocks\\[0\\]\\.subtitle-input"]').fill(variables.descripcionBanner)
    }

    async formularioIntroText(view1, variables){
        await view1.locator('div').filter({ hasText: /^Landing intro text$/ }).first().click()
        await view1.getByRole('button', { name: 'Agregar', exact: true }).click()
        await view1.locator('//*[@id="blocks[0].title-input"]').fill(variables.tituloIntroText)
        await view1.locator('//div/div[2]/div[2]/div[2]/div/div[2]/div/div/div[2]/div/div/div').fill(variables.desciptionIntroText)
    }

    async formularioTourCarouserl(view1, variables){
        await view1.locator('div').filter({ hasText: /^Tour carousel$/ }).first().click()
        await view1.getByRole('button', { name: 'Agregar', exact: true }).click()
        await view1.locator('[id="blocks\\[0\\]\\.title-input"]').fill(variables.tituloCarousel)
    }

    async publicarLanding(view1){
        await view1.locator('//form/div[2]/button/span').click()
    }

    async validacionCamposVacios(view1){
        await view1.getByRole('link', { name: ' Landings' }).click()
        await view1.getByLabel('Crear').click()
        await view1.locator('//form/div[2]/button/span').click()
        await view1.getByText('El campo title es requerido.').waitFor({ state: 'visible' })
        expect(await view1.getByText('El campo title es requerido.')).toHaveText('El campo title es requerido.')
        expect(await view1.getByText('El campo slug es requerido.')).toHaveText('El campo slug es requerido.')
    }
}

export default landings;
