import { expect } from '@playwright/test';
import test from 'node:test';

export class gestionTour {
    constructor(page){
        this.page = page
        this.nombreTour = null
        this.tituloTour = null
        this.slugTour = null
        this.nombrePeriodo = null
        this.periodoSalida = null
        this.periodoRegreso = null
        this.tipoViaje = null
        this.nombreHabitacion = null
        this.nombreActividad = null
    }

    async iniciarSessionTourOperacion(variables){
        /*await this.page.locator('#user').fill(variables.userName)
        await this.page.locator('#password').fill(variables.password)
        await this.page.getByRole('button', { name: 'Entrar'}).click()
        await this.page.getByRole('link', { name: ' Usuarios' }).click()*/
        await this.page.getByRole('link', { name: ' Gestión de Tours' }).waitFor({ state: 'visible' })
        await this.page.getByRole('link', { name: ' Gestión de Tours' }).click()
    }

    async sincronizacionTour(test){
        await this.page.getByLabel('Sinc').waitFor({ state: 'visible' })
        await this.page.getByLabel('Sinc').click()
        await this.page.waitForTimeout(3000)
        
        let tourVisible = await this.page.locator('//div/div/div[2]/div/div[1]/span')
        if(await tourVisible.isVisible()) {
            this.nombreTour = (await this.page.locator('//div/div/div[2]/div/div[1]/span').textContent()).trim()
            await this.page.locator('div').filter({
                hasText: new RegExp(`^${this.nombreTour.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(.*)$`)
            }).getByRole('button', { name: 'Sincronizar' }).nth(0).click()
            
            await this.page.getByRole('button', { name: 'Confirmar', exact: true }).click()
            await this.page.locator('//body/main/section/main/div[3]').waitFor({ state: 'visible' })
        }else {
            test.info().annotations.push({ type: 'info', description: 'No se visualiza tour para sincronizar'})
            throw new Error('Error: Fallo No se visualiza tour para sincronizar')
        }
    }

    async sincronizacionExitosa(){
        expect(await this.page.locator('//body/main/section/main/div[3]').textContent()).toBe('Se ha sincronizado el tour correctamente')
    }

    async seleccionarTour(tour){
        await this.page.locator('//main/div[2]/div/div[2]/button').nth(tour).scrollIntoViewIfNeeded()
        await this.page.locator('//main/div[2]/div/div[2]/button').nth(tour).click()
    }

    async edicionTour(){
        this.tituloTour = await this.page.locator('#name-input').getAttribute('value')
        await this.page.locator('#name-input').clear()
        await this.page.locator('#name-input').fill( this.tituloTour)

        this.slugTour = await this.page.locator('#webSlug-input').getAttribute('value')
        await this.page.locator('#webSlug-input').clear()
        await this.page.locator('#webSlug-input').fill( this.slugTour)
    }

    async agregarPrecioTour(condicion){
        const precios = [1000, 2000, 3000, 4000, 5000, 6000]

        if (condicion == 'si') {
            for(const i of precios){
                await this.page.locator('#price-input').clear()
                await this.page.locator('#price-input').fill(i.toString())
            }
        } else {
            test.annotations.push({ type: 'info', description: 'No se agrego precio al tour'})
        }
    }

    async edicionPeriodo(periodo){
        await this.page.selectOption('#period-selected', `${periodo}`);
        await this.page.locator('//div[5]/form/div[1]/div[6]/div[2]/button').click()
        await this.page.locator('//div[6]/div/div/div[1]').first().waitFor({ state: 'visible' })

        this.nombrePeriodo = await this.page.locator('//*[@id="name-input"]').nth(1).getAttribute('value')
        await this.page.locator('//*[@id="name-input"]').nth(1).clear()
        await this.page.locator('//*[@id="name-input"]').nth(1).fill(this.nombrePeriodo)

        this.periodoSalida = await this.page.locator('#dayOne-input').getAttribute('value')
        await this.page.locator('#dayOne-input').clear()
        await this.page.locator('#dayOne-input').fill(this.periodoSalida)

        this.periodoRegreso = await this.page.locator('#returnDate-input').getAttribute('value')
        await this.page.locator('#returnDate-input').clear()
        await this.page.locator('#returnDate-input').fill(this.periodoRegreso)

        this.tipoViaje = await this.page.locator('#tripType-input').getAttribute('value')
        await this.page.locator('#tripType-input').clear()
        await this.page.locator('#tripType-input').fill(this.periodoRegreso)
    }

    async tiposPersonasTour(){
        await this.page.locator('//form/div[1]/div[8]/div/div/div[1]//input').click()
        await this.page.locator('//form/div[1]/div[8]/div/div/div[2]//input').click()
        await this.page.locator('//form/div[1]/div[8]/div/div/div[3]//input').click()
        await this.page.getByRole('button', { name: 'Guardar', exact: true }).click()
    }

    async edicionHabitaciones(){
        await this.page.locator('//div[1]/div[6]/div[2]/div[3]/div/button').click()
        await this.page.locator('//div[6]/div/div/div[1]/span').waitFor({ state: 'visible' })

        this.nombreHabitacion = await this.page.locator('//*[@id="name-input"]').getAttribute('value')
        await this.page.locator('//*[@id="name-input"]').nth(1).clear()
        await this.page.locator('//*[@id="name-input"]').nth(1).fill(this.nombreHabitacion)
        await this.page.locator('#places-input').fill('12')
        await this.page.getByRole('button', { name: 'Guardar', exact: true }).click()
    }

    async edicionActividad(test){
        await this.page.waitForTimeout(2000)
        let alertActividadVisible = await this.page.locator('//form/div[1]/div[6]/div[2]/div[8]/div/button')
        if(await alertActividadVisible.isVisible()){
            await this.page.locator('//form/div[1]/div[6]/div[2]/div[8]/div/button').click()
            this.nombreActividad = await this.page.locator('//*[@id="name-input"]').getAttribute('value')
            await this.page.locator('//*[@id="name-input"]').nth(1).clear()
            await this.page.locator('//*[@id="name-input"]').nth(1).fill(this.nombreActividad)
            await this.page.getByRole('button', { name: 'Guardar', exact: true }).click()
        }else{
            test.info().annotations.push({ type: 'info', description: 'El tour no contiene actividades'})           
        }
    }

    async publicarTour(estado, test){
        if(estado == 'Si'.toLocaleLowerCase()){
            await this.page.locator('//main/div[5]/form/div[2]/button').click()
        }else{
            test.info().annotations.push({ type: 'info', description: `El tour no fue publicado porque el estado es ${estado}` })
        }
    }

    async validacionCamposVaciosTour(){
        await this.page.locator('#name-input').clear()
        await this.page.locator('#webSlug-input').clear()
        await this.page.locator('//main/div[5]/form/div[2]/button').click()
        expect(await this.page.getByText('El campo name es requerido.')).toHaveText('El campo name es requerido.')
        expect(await this.page.getByText('El campo webslug es requerido.')).toHaveText('El campo webslug es requerido.')
    }

    async validacionCamposVaciosPeriodo(periodo){
        await this.page.selectOption('#period-selected', `${periodo}`);
        await this.page.locator('//div[5]/form/div[1]/div[6]/div[2]/button').click()
        await this.page.locator('//div[6]/div/div/div[1]').first().waitFor({ state: 'visible' })

        await this.page.locator('//*[@id="name-input"]').nth(1).clear()
        await this.page.locator('#dayOne-input').clear()
        await this.page.locator('#returnDate-input').clear()
        await this.page.locator('#tripType-input').clear()
        await this.page.getByRole('button', { name: 'Guardar', exact: true }).click()
        expect(await this.page.getByText('El campo name es requerido.')).toHaveText('El campo name es requerido.')
        expect(await this.page.getByText('El campo dayone es requerido.')).toHaveText('El campo dayone es requerido.')
        expect(await this.page.getByText('El campo returndate es requerido.')).toHaveText('El campo returndate es requerido.')
        expect(await this.page.getByText('El campo triptype es requerido.')).toHaveText('El campo triptype es requerido.')
        await this.page.getByRole('button', { name: '×', exact: true }).click()
    }

    async validacionCamposVaciosHabitacion(){
        await this.page.locator('//div[1]/div[6]/div[2]/div[3]/div/button').click()
        await this.page.locator('//div[6]/div/div/div[1]/span').waitFor({ state: 'visible' })
        await this.page.locator('//*[@id="name-input"]').nth(1).clear()
        await this.page.getByRole('button', { name: 'Guardar', exact: true }).click()
        expect(await this.page.getByText('El campo name es requerido.')).toHaveText('El campo name es requerido.')
        await this.page.getByRole('button', { name: '×', exact: true }).click()
    }

    async validacionCamposVaciosActividad(test){
        await this.page.waitForTimeout(2000)
        let alertActividadVisible = await this.page.locator('//form/div[1]/div[6]/div[2]/div[8]/div/button')
        if(await alertActividadVisible.isVisible()){
            await this.page.locator('//form/div[1]/div[6]/div[2]/div[8]/div/button').click()
            this.nombreActividad = await this.page.locator('//*[@id="name-input"]').getAttribute('value')
            await this.page.locator('//*[@id="name-input"]').nth(1).clear()
            await this.page.locator('//*[@id="name-input"]').nth(1).fill(this.nombreActividad)
            await this.page.getByRole('button', { name: 'Guardar', exact: true }).click()
            expect(await this.page.getByText('El campo name es requerido.')).toHaveText('El campo name es requerido.')
            await this.page.getByRole('button', { name: '×', exact: true }).click()
        }else{
            test.info().annotations.push({ type: 'info', description: 'El tour no contiene actividades'})           
        }
    }
}

export default gestionTour;