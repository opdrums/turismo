import { expect } from "@playwright/test"

export class compraTour{
    constructor(page) {
        this.page = page
    }

    async loginUser(variables){
        await this.page.goto(variables.urlWeb)
        await this.page.setDefaultTimeout(400000)
        await this.page.locator('#user').fill(variables.userName)
        await this.page.locator('#password').fill(variables.password)
        await this.page.getByRole('button', { name: 'Entrar'}).click()
        await this.page.locator('//main/aside/div[2]/div[2]/span').hover()
        await this.page.locator('//main/aside/div[2]/div[2]/div[2]/a').click()
        await this.page.getByRole('link', { name: ' Tours' }).click()
    }

    async seleccionarTouraAndPeriodo(tour){
        await this.page.getByRole('link', { name: 'Ver tour' }).nth(tour).click()
        await this.page.waitForTimeout(2000)
        await this.page.getByRole('button', { name: 'Reservar mi tour' }).click()
        await this.page.locator('//*[@id="period-selector"]/div/div[1]/div/div/div[5]/button').click()
    }

    async seleccionarCantidadHabitaciones(personas, habitacion){
        await this.page.waitForTimeout(2000)
        await this.page.getByRole('button', { name: 'Selección de habitaciones ' }).first().waitFor({ state: 'visible' })
        await this.page.locator('//*[@id="input-number"]/button[2]/i').nth(personas).click()
        await this.page.locator('//*[@id="input-number"]/button[2]/i').nth(habitacion).click()
    }

    async FormularioPasajeros(formulario, variables){
        const nombres = ["Juan", "Ana", "Carlos", "Maria", "Luis", "Sofia", "Miguel", "Elena"]
        const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)]
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);

        const numeroDniAleatorio = Math.floor(10000000 + Math.random() * 90000000);
        const letrasDni = "TRWAGMYFPDXBNJZSQVHLCKE";
        const letraDni = letrasDni[numeroDniAleatorio % 23];

        await this.page.locator('//*[@id="reservation-field-name"]').nth(formulario).fill(`${nombreAleatorio}${numeroAleatorio}`)
        await this.page.locator('//*[@id="reservation-field-lastname"]').nth(formulario).fill(variables.apellido)
        await this.page.locator('//*[@id="reservation-field-phone"]').nth(formulario).fill(variables.telefono)
        await this.page.locator('//*[@id="reservation-field-sex"]').nth(formulario).selectOption(variables.genero)
        await this.page.locator('//*[@id="reservation-field-birthday"]').nth(formulario).fill(variables.fechaCumpleaños)
        await this.page.locator('//*[@id="reservation-field-email"]').nth(formulario).fill(`${nombreAleatorio.toLowerCase()}${numeroAleatorio}@gmail.com`)
        await this.page.locator('//*[@id="reservation-field-confirm-email"]').nth(formulario).check()
        await this.page.locator('//*[@id="reservation-field-dni"]').nth(formulario).fill(`${numeroDniAleatorio}${letraDni}`);
        await this.page.locator('//*[@id="reservation-field-expiration"]').nth(formulario).fill(variables.fechaCaducidad)
        await this.page.locator('//*[@id="reservation-field-issued"]').nth(formulario).fill(variables.fechaExpedicion)
        await this.page.locator('//*[@id="reservation-field-zip"]').nth(formulario).fill(variables.codigoPostal)
        await this.page.locator('//*[@id="reservation-field-nationality"]').nth(formulario).selectOption(variables.nacionalidad)
    }

    async agregarActividad(test) {
        await this.page.getByRole('button', { name: 'Continuar' }).click()

        const actividad = this.page.locator('//div/div/div/div[2]/div/div[2]/div[2]/button').first()
        if (await actividad.isVisible()) {
            await actividad.click()
        } else {
            test.info().annotations.push({ type: 'info', description: 'No se visualiza una actividad para el tour'})
        }
    }
    
    async selecionarPlanStandard(){
        await this.page.locator('//div[2]/div/div/div/div[1]/div[3]/div[2]').click()
        await this.page.getByRole('button', { name: 'Continuar' }).click()
    }

    async selecionarPlanComfort(){
        await this.page.locator('//div[2]/div/div/div/div[2]/div[3]/div[2]').click()
        await this.page.getByRole('button', { name: 'Continuar' }).click()
    }

    async selecionarPlanComfortPlus(){
        await this.page.locator('//div[2]/div/div/div/div[3]/div[3]/div[2]').click()
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

    async pagoReservaTiempoBizum(){
        await this.page.getByRole('button', { name: 'Paga la reserva de plaza y no' }).click()
        await this.page.getByRole('button', { name: 'Bizum' }).click()
        await this.page.getByLabel('Acepto términos de privacidad').check()
        await this.page.getByRole('button', { name: 'Realizar pago' }).click()
    }

    async pagoTotalTransferenciaBancaria(){
        await this.page.getByRole('button', { name: 'Paga tu viaje al completo 1.' }).click()
        await this.page.getByRole('button', { name: 'Transferencia bancaria' }).click()
        await this.page.getByLabel('Acepto términos de privacidad').check()
        await this.page.getByRole('button', { name: 'Realizar pago' }).click()
    }

    async pagoExitoso(){
        await this.page.locator('//div/div/div/div[1]/div/h1').waitFor({ state: 'visible' })
        expect(await this.page.locator('//div/div/div/div[1]/div/h1')).toHaveText('¡Tu reserva ha sido confirmada!')
    }

    async pagoFallido(){
        await this.page.locator('//div/div/div/div[1]/div/h1').waitFor({ state: 'visible' })
        expect(await this.page.locator('//div/div/div/div[1]/div/h1')).toHaveText('Tu reserva no se ha completado como planeamos. Te animamos a volver a intentarlo.')
    }

    async pagoPeticion(){
        await this.page.locator('//div/div/div/div[1]/div/h1').waitFor({ state: 'visible' })
        expect(await this.page.locator('//div/div/div/div[1]/div/h1')).toHaveText('Tu reserva está en petición.')
    }

    async pagoTransferencia(){
        await this.page.locator('//div/div/div/div[1]/div/h1').waitFor({ state: 'visible' })
        expect(await this.page.locator('//div/div/div/div[1]/div/h1')).toHaveText('Confirma ahora tu petición de reserva realizando el pago por transferencia.')
    }   

    async validacionCamposVacios(){
        await this.page.getByRole('button', { name: 'Continuar' }).click()
        await expect(this.page.getByText('El nombre es obligatorio').first()).toHaveText('El nombre es obligatorio')
        await expect(this.page.getByText('El apellido es obligatorio').first()).toHaveText('El apellido es obligatorio')
        await expect(this.page.getByText('El teléfono es obligatorio').first()).toHaveText('El teléfono es obligatorio')
        await expect(this.page.getByText('Selecciona el sexo').first()).toHaveText('Selecciona el sexo')
        await expect(this.page.getByText('La fecha de nacimiento es obligatoria').first()).toHaveText('La fecha de nacimiento es obligatoria')
        await expect(this.page.getByText('El correo electrónico es obligatorio').first()).toHaveText('El correo electrónico es obligatorio')
        await expect(this.page.getByText('El DNI es obligatorio').first()).toHaveText('El DNI es obligatorio')
        await expect(this.page.getByText('El código postal es obligatorio').first()).toHaveText('El código postal es obligatorio')
        await expect(this.page.getByText('Selecciona la nacionalidad').first()).toHaveText('Selecciona la nacionalidad')
    }

    async validacionFechasInvalidas(){
        await this.page.locator('//*[@id="reservation-field-birthday"]').nth(0).fill('2100-12-05')
        await this.page.locator('//*[@id="reservation-field-expiration"]').nth(0).fill('1995-11-12')
        await this.page.locator('//*[@id="reservation-field-issued"]').nth(0).fill('2100-12-05')
        await this.page.getByRole('button', { name: 'Continuar' }).click()
        await expect(this.page.getByText('La fecha de nacimiento no puede ser futura').first()).toHaveText('La fecha de nacimiento no puede ser futura')
        await expect(this.page.getByText('La fecha de caducidad no puede estar en el pasado').first()).toHaveText('La fecha de caducidad no puede estar en el pasado')
        await expect(this.page.getByText('La fecha de expedición no puede ser futura').first()).toHaveText('La fecha de expedición no puede ser futura')
    }
}
export default compraTour;