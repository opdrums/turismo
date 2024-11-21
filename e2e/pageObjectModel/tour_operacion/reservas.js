import { expect } from "@playwright/test"

class reservaTour{
    constructor(page){
        this.page = page
    }

    async loginUser(variables){
        await this.page.goto(variables.urlTour)
        await this.page.locator('#user').fill(variables.userName)
        await this.page.locator('#password').fill(variables.password)
        await this.page.getByRole('button', { name: 'Entrar'}).click()
        await this.page.locator('//main/aside/div[2]/div[2]/span').hover()
        await this.page.locator('//main/aside/div[2]/div[2]/div[2]/a').click()
        await this.page.getByRole('link', { name: ' Reservas' }).click()
    }

    async validacionReservas(tag, test){
        await this.page.getByRole('button', { name: `${tag}`, exact: true }).click()   
        await this.page.waitForTimeout(1000)

        if (await this.page.locator('//div[2]/div[2]/div[4]/div[2]').isVisible()) {
            let userEmail = await this.page.locator('//div[2]/div[2]/div[4]/div[2]').textContent()
            await this.page.locator('//div/div[1]/div/input').fill(`${userEmail}`)
        }else {
            test.info().annotations.push({type: 'Info', description: "No existen reservas para seleccionar en el menu"})
            throw new Error('Error: No existen una reservas para seleccionar en el menu')
        }
        await this.page.locator('.menu-button-btn').first().click()
        await this.page.getByRole('link', {name: 'Ver Reserva'}).click()
    }

    async validacionPasajeros(test){
        await this.page.waitForTimeout(3000)

        if (await this.page.getByRole('heading', { name: 'Habitación 1:' }).isVisible()) {
            await  this.page.getByRole('heading', { name: 'Habitación 1:' }).nth(0).scrollIntoViewIfNeeded()
            expect(await this.page.locator('//div/div[2]/div/div[1]/div/h2').nth(0)).toBeVisible()
        } else {
            test.info().annotations.push({type: 'Info',description: "La reserva  no contiene pasajeros asociados"})
            throw new Error('Error: La reserva  no contiene pasajeros asociados')
        }
    }
}

export default reservaTour;