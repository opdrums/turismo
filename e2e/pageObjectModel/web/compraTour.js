export class compraTour{
    constructor(page) {
        this.page = page
    }

    async loginUser(url, email, password){
        await this.page.goto(url)
        await this.page.getByRole('link', { name: 'Iniciar sesión' }).click()
        await this.page.getByPlaceholder('E-mail').fill(email)
        await this.page.getByPlaceholder('Contraseña').fill(password)
        await this.page.getByRole('button', { name: 'Continuar' }).click()
    }

    async seleccionarTouraAndPeriodo(tour){
        await this.page.getByRole('link', { name: 'Ver tour' }).nth(tour).click()
        await this.page.getByRole('button', { name: 'Seleccionar' }).first().scrollIntoViewIfNeeded()
        await this.page.getByRole('button', { name: 'Seleccionar' }).first().hover()
        await this.page.getByRole('button', { name: 'Seleccionar' }).first().click()
        await this.page.getByRole('button', { name: 'Selección de habitaciones ' }).first().waitFor({ state: 'visible' })
    }

    async seleccionarCantidadHabitaciones(){
        await this.page.locator('div').filter({ hasText: /^Adultos\(Desde 12 años\)\+-$/ }).getByRole('button').nth(1).click()
        await this.page.locator('div').filter({ hasText: /^Doble matrimonio para parejas juntas1 cama doble\+-$/ }).getByRole('button').nth(1).click()
    }

    async FormularioPasajeros(formulario, nombre, apellido, telefono, genero, fechaCumpleaños, userEmail, Dni, fechaCaducidad, fechaExpedicion, codigoPostal, nacionalidad){
        await this.page.locator('//*[@id="reservation-field-name"]').nth(formulario).fill(nombre)
        await this.page.locator('//*[@id="reservation-field-lastname"]').nth(formulario).fill(apellido)
        await this.page.locator('//*[@id="reservation-field-phone"]').nth(formulario).fill(telefono)
        await this.page.locator('//*[@id="reservation-field-sex"]').nth(formulario).selectOption(genero)
        await this.page.locator('//*[@id="reservation-field-birthday"]').nth(formulario).fill(fechaCumpleaños)
        await this.page.locator('//*[@id="reservation-field-email"]').nth(formulario).fill(userEmail)
        await this.page.locator('//*[@id="reservation-field-confirm-email"]').nth(formulario).check()
        await this.page.locator('//*[@id="reservation-field-dni"]').nth(formulario).fill(Dni);
        await this.page.locator('//*[@id="reservation-field-expiration"]').nth(formulario).fill(fechaCaducidad)
        await this.page.locator('//*[@id="reservation-field-issued"]').nth(formulario).fill(fechaExpedicion)
        await this.page.locator('//*[@id="reservation-field-zip"]').nth(formulario).fill(codigoPostal)
        await this.page.locator('//*[@id="reservation-field-nationality"]').nth(formulario).selectOption(nacionalidad)
    }

    async agregarActividad() {
        await this.page.getByRole('button', { name: 'Continuar' }).click()

        const actividad = this.page.locator('//div[2]/div/div[2]/div[2]/button').first()
        if (await actividad.isVisible()) {
            await actividad.click()
        } else {
            console.log('Actividad no encontrada')
        }
    }
    
    async selecionarStandard(){
        await this.page.locator('//div[2]/div/div/div/div[1]/div[3]/div[2]').click()
        await this.page.getByRole('button', { name: 'Continuar' }).click()
    }

    async selecionarPlanComfort(){
        await this.page.locator('//div[2]/div/div/div/div[2]/div[3]/div[2]').click()
        await this.page.getByRole('button', { name: 'Continuar' }).click()
    }

    async selecionarPlanComfortPlus(){
        await this.page.locator('//div[2]/div/div/div/div[3]/div[3]/div[2').click()
        await this.page.getByRole('button', { name: 'Continuar' }).click()
    }
    
    async pagoTotalConTarjeta(){
        await this.page.getByRole('button', { name: 'Paga tu viaje al completo 1.' }).click()
        await this.page.getByRole('button', { name: 'Tarjeta bancaria' }).click()
        await this.page.getByLabel('Acepto términos de privacidad').check()
        await this.page.getByRole('button', { name: 'Realizar pago' }).click()
    }

    async flujoCompraBancaria(){
        await this.page.locator('//*[@id="divImgAceptar"]').waitFor({ state: 'visible' })
        await this.page.locator('#card-number').fill(variables.cardNumber)
        await this.page.locator('#card-expiration').fill(variables.cardExpiration)
        await this.page.locator('#card-cvv').fill(variables.cardCvv)
        await this.page.locator('#divImgAceptar').click()
        await this.page.locator('//*[@id="body"]/div[2]/div[2]/div[1]/input[2]').waitFor({ state: 'visible' })
    }
}
export default compraTour