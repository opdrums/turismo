import { expect } from "@playwright/test"
import { info } from "console"
import * as dotenv from 'dotenv'
dotenv.config()

export class compraTour{
    constructor(page) {
        this.page = page
    }

    async loginUser(variables){
        await this.page.goto(`${process.env.baseUrlWeb}`)
        await this.page.setDefaultTimeout(120000)
        await this.page.locator('//header/div[2]/div/div[3]').click()
        await this.page.getByPlaceholder('E-mail').fill(variables.email)
        await this.page.getByPlaceholder('Contraseña').fill(variables.password)
        await this.page.locator('//div/div[1]/form/button').click()
    }

    async seleccionarTouraAndPeriodo(tour, test){
        await this.page.getByRole('link', { name: 'Ver tour' }).nth(tour).click()
        const textoCompleto = await this.page.locator('//div/div[1]/div[3]/p').nth(1).textContent(); 
        const precio = textoCompleto.match(/\d+/)?.[0];

        if (precio > 0) {
            await this.page.getByRole('button', { name: 'Reservar mi tour' }).click()
            await this.page.getByRole('button', { name: 'Seleccionar' }).first().click()
        } else {
            test.info().annotations.push({ type: 'info', description: 'el tour no contiene precios' })
            throw new Error('Error: el tour no contiene precios')
        }
     
        const alert = this.page.locator('//div/div[2]/div[2]/div/div[1]/a/span')
        if(await alert.isVisible()){
            await this.page.getByLabel('Cerrar').click()
            await this.page.getByRole('button', { name: 'Seleccionar' }).first().hover()
            await this.page.getByRole('button', { name: 'Seleccionar' }).first().click()
        }else{
            test.info().annotations.push({ type: 'info', description: 'No se visualizó la alerta de inicio de sesión' })
        }
        await this.page.getByText('1 Agrega los viajeros y las').first().waitFor({ state: 'visible' })
    }

    async formularioPasajeros(formulario, variables){
        const nombres = ["Juan", "Ana", "Carlos", "Maria", "Luis", "Sofia", "Miguel", "Elena"]
        const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)]
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);

        const numeroDniAleatorio = Math.floor(10000000 + Math.random() * 90000000);
        const letrasDni = "TRWAGMYFPDXBNJZSQVHLCKE";
        const letraDni = letrasDni[numeroDniAleatorio % 23];

        await this.page.locator('//*[@id="reservation-field-name"]').nth(formulario).fill(`${nombreAleatorio}${numeroAleatorio}`)
        await this.page.locator('//*[@id="reservation-field-lastname"]').nth(formulario).fill(variables.apellido)
        await this.page.locator('//*[@id="reservation-field-phone"]').nth(formulario).fill(variables.telefono)
        await this.page.locator('//*[@id="reservation-field-email"]').nth(formulario).fill(`${nombreAleatorio.toLowerCase()}${numeroAleatorio}@gmail.com`)
        await this.page.locator('//*[@id="reservation-field-nationality"]').nth(formulario).selectOption(variables.nacionalidad)
        await this.page.locator('//*[@id="reservation-field-sex"]').nth(formulario).selectOption(variables.genero)
        await this.page.locator('//*[@id="reservation-field-birthday"]').nth(formulario).fill(variables.fechaCumpleaños)
        await this.page.locator('//*[@id="reservation-field-dni"]').nth(formulario).fill(`${numeroDniAleatorio}${letraDni}`)
        await this.page.locator('//*[@id="reservation-field-expiration"]').nth(formulario).fill(variables.fechaCaducidad)
        await this.page.locator('//*[@id="reservation-field-issued"]').nth(formulario).fill(variables.fechaExpedicion)
        await this.page.locator('//*[@id="reservation-field-zip"]').nth(formulario).fill(variables.codigoPostal)
    }

    async formularioNiño(formulario, variables){
        const nombres = ["Juan", "Ana", "Carlos", "Maria", "Luis", "Sofia", "Miguel", "Elena"]
        const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)]
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000)

        const numeroDniAleatorio = Math.floor(10000000 + Math.random() * 90000000)
        const letrasDni = "TRWAGMYFPDXBNJZSQVHLCKE";
        const letraDni = letrasDni[numeroDniAleatorio % 23]

        await this.page.locator('//*[@id="reservation-field-name"]').nth(formulario).fill(`${nombreAleatorio}${numeroAleatorio}`)
        await this.page.locator('//*[@id="reservation-field-lastname"]').nth(formulario).fill(variables.apellido)
        await this.page.locator('//*[@id="reservation-field-nationality"]').nth(formulario).selectOption(variables.nacionalidad)
        await this.page.locator('//*[@id="reservation-field-sex"]').nth(formulario).selectOption(variables.genero)
        await this.page.locator('//*[@id="reservation-field-birthday"]').nth(formulario).fill(variables.fechaCumpleaños)
        await this.page.locator('//*[@id="reservation-field-dni"]').nth(formulario).fill(`${numeroDniAleatorio}${letraDni}`)
        await this.page.locator('//*[@id="reservation-field-expiration"]').nth(formulario).fill(variables.fechaCaducidad)
        await this.page.locator('//*[@id="reservation-field-issued"]').nth(formulario).fill(variables.fechaExpedicion)
    }

    async formularioBebe(formulario, opcion, variables){
        const nombres = ["Juan", "Ana", "Carlos", "Maria", "Luis", "Sofia", "Miguel", "Elena"]
        const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)]
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000)

        const numeroDniAleatorio = Math.floor(10000000 + Math.random() * 90000000)
        const letrasDni = "TRWAGMYFPDXBNJZSQVHLCKE";
        const letraDni = letrasDni[numeroDniAleatorio % 23]

        await this.page.locator('//*[@id="reservation-field-name"]').nth(formulario).fill(`${nombreAleatorio}${numeroAleatorio}`)
        await this.page.locator('//*[@id="reservation-field-lastname"]').nth(formulario).fill(variables.apellido)
        await this.page.locator('//*[@id="reservation-field-nationality"]').nth(formulario).selectOption(variables.nacionalidad)
        await this.page.locator('//*[@id="reservation-field-sex"]').nth(formulario).selectOption(variables.genero)
        await this.page.locator('//*[@id="reservation-field-birthday"]').nth(formulario).fill(variables.fechaCumpleaños)
        
        if(opcion == 0){
            await this.page.locator('//*[@id="reservation-field-documentType"]').nth(0).selectOption(variables.libroDeFamilia)
        }else if(opcion == 1){
            await this.page.locator('//*[@id="reservation-field-documentType"]').nth(0).selectOption(variables.opcionDni)
            await this.page.locator('//*[@id="reservation-field-dni"]').nth(formulario).fill(`${numeroDniAleatorio}${letraDni}`)
            await this.page.locator('//*[@id="reservation-field-minor-id-expiration"]').nth(0).fill(variables.fechaCaducidad)
            await this.page.locator('//*[@id="reservation-field-minor-id-issued"]').nth(0).fill(variables.fechaExpedicion)
        }else{
            await this.page.locator('//*[@id="reservation-field-documentType"]').nth(0).selectOption(variables.opcionPasaporte)
            await this.page.locator('//*[@id="reservation-field-passport-id"]').nth(0).fill(variables.numeroPasaporte)
            await this.page.locator('//*[@id="reservation-field-expiration"]').nth(formulario).fill(variables.fechaCaducidad)
            await this.page.locator('//*[@id="reservation-field-issued"]').nth(formulario).fill(variables.fechaExpedicion)
        }
        await this.page.locator('//*[@id="reservation-field-associated-adult"]').nth(0).selectOption({ index: 1 });
    }

    async seleccionarCantidadPersona(){
        await this.page.locator('//*[@id="input-number"]/button[2]/i').nth(0).click()
        await this.page.locator('//*[@id="input-number"]/button[2]/i').nth(1).click()
        await this.page.locator('//*[@id="input-number"]/button[2]/i').nth(2).click()
    }

    async seleccionarCantidadHabitaciones(iteracion, personas){
        for (let i = 0; i < iteracion; i++) {
           await this.page.locator('//*[@id="input-number"]/button[2]/i').nth(personas).click();
        }
    }

    async agregarActividad(test) {
        await this.page.getByRole('button', { name: 'Continuar' }).click()
        await this.page.waitForTimeout(2000)

        if (await this.page.locator('//div[2]/div/div[2]/div[2]/button').isVisible()) {
            await this.page.locator('//div[2]/div/div[2]/div[2]/button').click()
        } else {
            test.info().annotations.push({ type: 'info', description: 'No se visualiza una actividad en el tour'})
        }
    }
    
    async selecionarPlanStandard(test){
        if (await this.page.locator('//div[1]/div[3]/div[4]/div/div[1]/div[3]').isVisible()) {
            await this.page.locator('//div[1]/div[3]/div[4]/div/div[1]/div[3]').click()
        }else{
            test.info().annotations.push({ type: 'info', description: 'No se visualiza seguros en el tour'})
        }
        await this.page.getByRole('button', { name: 'Continuar' }).click()
    }
    
    async agregarVuelos(vuelo){
        await this.page.waitForTimeout(2000)
        if(await this.page.getByRole('button', { name: 'Seleccionar' }).nth(vuelo).isVisible()) {
            await this.page.getByRole('button', { name: 'Seleccionar' }).nth(vuelo).click()
        }else{
            await this.page.getByRole('button', { name: 'Lo quiero sin vuelos' }).click()
        }
    }

    async selecionarPlanComfort(test){
        if (await this.page.locator('//div/div[1]/div[3]/div[4]/div/div[2]').isVisible()) {
            await this.page.locator('//div/div[1]/div[3]/div[4]/div/div[2]').click()
        }else{
            test.info().annotations.push({ type: 'info', description: 'No se visualiza seguros en el tour'})
        }
        await this.page.getByRole('button', { name: 'Continuar' }).click()
    }

    async selecionarPlanComfortPlus(test){
        if (await this.page.locator('//div/div[1]/div[3]/div[4]/div/div[3]').isVisible()) {
            await this.page.locator('//div/div[1]/div[3]/div[4]/div/div[3]').click()
        }else{
            test.info().annotations.push({ type: 'info', description: 'No se visualiza seguros en el tour'})
        }
        await this.page.getByRole('button', { name: 'Continuar' }).click()
    }
    
    async pagoTotalConTarjeta(){
        await this.page.getByRole('button', { name: 'Paga tu viaje al completo 1.' }).click()
        await this.page.getByRole('button', { name: 'Tarjeta bancaria' }).click()
        await this.page.getByLabel('Acepto términos de privacidad').check()
        await this.page.getByRole('button', { name: 'Realizar pago' }).click()
    }

    async flujoCompraBancaria(variables){
        await this.page.locator('//*[@id="divImgAceptar"]').waitFor({ state: 'visible' })
        await this.page.locator('//*[@id="card-number"]').fill(variables.cardNumber)
        await this.page.locator('//*[@id="card-expiration"]').fill(variables.cardExpiration)
        await this.page.locator('//*[@id="card-cvv"]').fill(variables.cardCvv)
        await this.page.locator('//*[@id="divImgAceptar"]').click() 
        await this.page.locator('//*[@id="result-header"]/div/div/text').waitFor({state: 'hidden'})
        await this.page.locator('//*[@id="body"]/div[2]/div[2]/div[1]/input[2]').waitFor({ state: 'visible', timeout: 60000})
        await this.page.locator('//*[@id="body"]/div[2]/div[2]/div[1]/input[2]').click({timeout: 60000})
    }

    async flujoCompraBancariaFallido(variables){
        await this.page.locator('//*[@id="divImgAceptar"]').waitFor({ state: 'visible' })
        await this.page.locator('//*[@id="card-number"]').fill(variables.cardNumber)
        await this.page.locator('//*[@id="card-expiration"]').fill(variables.cardExpiration)
        await this.page.locator('//*[@id="card-cvv"]').fill(variables.cardCvvFallido)
        await this.page.locator('//*[@id="divImgAceptar"]').click() 
        await this.page.locator('//*[@id="result-header"]/div/div/text').waitFor({state: 'hidden'})
        await this.page.locator('//*[@id="status"]').nth(2).waitFor({ state: 'visible', timeout: 60000})
        await this.page.locator('//*[@id="status"]').nth(2).click({timeout: 60000})
        await this.page.locator('//*[@id="boton"]').click()
        await this.page.locator('//*[@id="body"]/div[2]/div[2]/div[1]/input[2]').click()
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
export default compraTour