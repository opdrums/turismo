import { expect } from "@playwright/test"

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
        await this.page.getByRole('button', { name: 'Seleccionar' }).first().hover()
        await this.page.getByRole('button', { name: 'Seleccionar' }).first().click()

        const alert = this.page.locator('//div/div[2]/div[2]/div/div[1]/a/span')
        if(await alert.isVisible()){
            await this.page.getByLabel('Cerrar').click()
            await this.page.getByRole('button', { name: 'Seleccionar' }).first().hover()
            await this.page.getByRole('button', { name: 'Seleccionar' }).first().click()
        }else{
            console.log('No se visualiza la alerta de login')
        }
    }

    async seleccionarCantidadHabitaciones(){
        await this.page.getByRole('button', { name: 'Selección de habitaciones ' }).first().waitFor({ state: 'visible' })
        await this.page.locator('div').filter({ hasText: /^Adultos\(Desde 12 años\)\+-$/ }).getByRole('button').nth(1).click()
        await this.page.locator('div').filter({ hasText: /^Doble matrimonio para parejas juntas1 cama doble\+-$/ }).getByRole('button').nth(1).click()
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

    async agregarActividad() {
        await this.page.getByRole('button', { name: 'Continuar' }).click()

        const actividad = this.page.locator('//div[2]/div/div[2]/div[2]/button').first()
        if (await actividad.isVisible()) {
            await actividad.click()
        } else {
            console.log('Actividad no encontrada')
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
}
export default compraTour