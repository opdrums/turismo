import * as dotenv from 'dotenv';
import { expect } from '@playwright/test';
import { console } from 'inspector';
dotenv.config();

export class colecciones {
    constructor(page) {
        this.page = page;
        this.tituloColeccion = null;
        this.tituloTour = null;
    }

    async abrirVistas(view1) {
        view1.setDefaultTimeout(120000);

        await Promise.all([
            view1.goto(`${process.env.baseUrlWebAdmin}`),
        ]);
    }

    async formularioColeccion(view1, variables) {
        const collecion = ['destinos-populares', 'ofertas-de-viaje', 'experiencias-unicas', 'tours-guiados', 'viajes-en-familia', 'escapadas-romanticas', 'aventura-y-naturaleza', 'playas-y-resorts'];
        const collecionAleatorio = collecion[Math.floor(Math.random() * collecion.length)];
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
        const tituloColeccion = `${collecionAleatorio}${numeroAleatorio}`;

        await view1.getByRole('link', { name: ' Colecciones' }).click();
        await view1.getByLabel('Crear').click();
        await view1.locator('#title-input').fill(tituloColeccion, { force: true });
        await view1.locator('//div[2]/div/div/div/div/div/div').first().fill(variables.descripcion);
        await view1.locator('#slug-input').fill(tituloColeccion, { force: true });
        await view1.locator('#tag-input').fill(tituloColeccion, { force: true });
        this.tituloColeccion = await view1.locator('#title-input').inputValue();
    }

    async crearColecion(view1) {
        await view1.getByRole('button', { name: 'Crear' }).nth(1).click();
    }

    async publicarColeccion(view1) {
        await view1.getByRole('button', { name: 'Publicar' }).click();
    }

    async agregarTagEnTour(view1, tour) {
        await view1.getByRole('link', { name: ' Gestión de Tours' }).click();
        await view1.locator(`//section/main/div[2]/div/div[2]/button[${tour}]`).waitFor({ state: 'visible' });
        await view1.locator(`//section/main/div[2]/div/div[2]/button[${tour}]`).click();
        this.tituloTour = await view1.locator('//*[@id="name-input"]').inputValue();

        await view1.getByRole('button', { name: ' Añadir item' }).waitFor({ state: 'visible' });
        if (await view1.getByText('Sin items').isVisible()) {
            await view1.getByRole('button', { name: ' Añadir item' }).click();
            await view1.locator('#tags-input-0').fill(`${this.tituloColeccion}`);
        } else {
            await view1.locator('#tags-input-0').clear();
            await view1.locator('#tags-input-0').fill(`${this.tituloColeccion}`);
        }
        await view1.locator('//main/div[5]/form/div[2]/button').click();
        await view1.locator('//main/section/main/div[6]').waitFor({ state: 'visible' });
    }

    async visualizarTour(view1) {
        await view1.getByRole('link', { name: ' Colecciones' }).click();
        await view1.getByRole('button', { name: `${this.tituloColeccion}`}).click();
        await view1.getByRole('link', { name: 'Ver' }).click();
        await view1.close()
    }

    async validacionTour(context) {
        const [view2] = await Promise.all([
            context.waitForEvent('page'),
        ]);
        await view2.locator('//div/div/section/div/div/div[1]/div[3]/div[1]').waitFor({ state: 'visible' });
        await view2.locator('//div/div/section/div/div/div[1]/div[3]/div[1]').scrollIntoViewIfNeeded()
        expect(await view2.locator('//div/div/section/div/div/div[1]/div[3]/div[1]')).toHaveText(`${this.tituloTour.toUpperCase()}`);
        await view2.close()
    }

    async eliminarColeccion(confirmacion, coleccion, test) {
        if (confirmacion == 'si'){
            const coleccionSelector = `//main/div[2]/div/div[2]/button[${coleccion}]`
            await this.page.locator(coleccionSelector).textContent()
        
            await this.page.locator(coleccionSelector).click()
            await this.page.locator('//div[5]/form/div[2]/div/button/i').click()
            await this.page.getByRole('button', { name: ' Eliminar' }).click()
        
            await this.page.waitForTimeout(2000)
            const isColeccionVisible = await this.page.locator(coleccionSelector).isVisible()
            expect(isColeccionVisible).toBe(true)
        }else {
            test.info().annotations.push({ type: 'info', description: `La opción seleccionada es: "${confirmacion}". No se encontró una coleccion disponible para eliminar.`})
        }
    }
    
    async despublicarColeccion(confirmacion, coleccion, test) {
        if (confirmacion == 'si'){
            const coleccionSelector = `//main/div[2]/div/div[2]/button[${coleccion}]`
            await this.page.locator(coleccionSelector).textContent()
        
            await this.page.locator(coleccionSelector).click()
            await this.page.locator('//div[5]/form/div[2]/div/button/i').click()
            await this.page.getByRole('button', { name: ' Despublicar' }).click()
        
            await this.page.waitForTimeout(2000)
            const isColeccionVisible = await this.page.locator(coleccionSelector).isVisible()
            expect(isColeccionVisible).toBe(true)
        }else {
            test.info().annotations.push({ type: 'info', description: `La opción seleccionada es: "${confirmacion}". No se encontró una coleccion disponible para eliminar.`})
        }
    }

    async validacionCamposVacios(){
        await this.page.getByLabel('Crear').click();
        await this.page.getByRole('button', { name: 'Crear' }).nth(1).click();
        expect(await this.page.getByText('El campo title es requerido.')).toHaveText('El campo title es requerido.')
        expect(await this.page.getByText('El campo slug es requerido.')).toHaveText('El campo slug es requerido.')
        expect(await this.page.getByText('El campo tag es requerido.')).toHaveText('El campo tag es requerido.')
    }
}

export default colecciones;
