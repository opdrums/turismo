import { expect} from "@playwright/test"
import * as dotenv from 'dotenv'
dotenv.config()

export class olvidarContraseña {
  constructor(page) {
    this.page = page
    this.codigoVerificacion = null
  }

  async abrirVistas(view1, view2, variables) {
    view1.setDefaultTimeout(120000)
    view2.setDefaultTimeout(120000)

    await Promise.all([
      view1.goto(`${process.env.baseUrlMiddle}`),
      view2.goto(`${process.env.baseUrlMicroSoft}`)
    ])
  }

  async iniciarRecuperacionContraseña(view1, variables) {
    await view1.getByRole('button', { name: 'Entrar' }).waitFor({ state: 'visible' })
    await view1.getByRole('link', { name: '¿Olvidó su contraseña?' }).click()
    await view1.getByRole('button', { name: 'Validar' }).waitFor({ state: 'visible' })
    await view1.locator('#user').fill(variables.userName)
    await view1.getByRole('button', { name: 'Validar' }).click()
  }

  async iniciarSesionMicrosoft(view2, variables) {
    await view2.getByRole('button', { name: 'Siguiente' }).waitFor({ state: 'visible' })
    await view2.locator('//*[@id="i0116"]').fill(`${process.env.emailMicroSoft}`)
    await view2.getByRole('button', { name: 'Siguiente' }).click()
    await view2.locator('//*[@id="i0118"]').fill(`${process.env.passwordMicroSoft}`)
    await view2.getByRole('button', { name: 'Iniciar sesión' }).click()
    await view2.getByRole('button', { name: 'No' }).click()
  }

  async obtenerCodigoVerificacion(view2, variables) {
    await view2.getByRole('button', { name: 'Mail' }).waitFor({ state: 'visible' })
    await view2.getByRole('button', { name: 'Mail' }).click()
    await view2.locator('//*[@id="topSearchInput"]').fill(variables.mensaje)
    await view2.locator('//*[@id="MailList"]/div/div/div/div/div/div/div/div[2]/div').first().waitFor({ state: 'visible' })
    await view2.locator('//*[@id="MailList"]/div/div/div/div/div/div/div/div[2]/div').first().click()

    const text = await view2.getByLabel('1 mensajes').getByText('Your password reset code is').textContent()
    this.codigoVerificacion = text.match(/\d+/)[0]
    await view2.close()
  }

  async codigoVerificacionCorrecto(view1, variables){
    await view1.getByPlaceholder('Código de confirmación').fill(this.codigoVerificacion)
    await view1.getByPlaceholder('Nueva Contraseña', { exact: true }).fill(variables.password)
    await view1.getByPlaceholder('Confirmar Nueva Contraseña').fill(variables.password)
    await view1.getByRole('button', { name: 'Confirmar' }).click()
    const texto = await view1.locator('//html/body/div/div/div/div[2]/p[1]').textContent()
    expect(texto).toBe('Contraseña reestablecida con éxito.')
  }

  async codigoVerificacionIcorrecto(variables){
    await this.page.getByPlaceholder('Código de confirmación').fill(variables.codigoInvalido)
    await this.page.getByPlaceholder('Nueva Contraseña', { exact: true }).fill(variables.password)
    await this.page.getByPlaceholder('Confirmar Nueva Contraseña').fill(variables.password)
    await this.page.getByRole('button', { name: 'Confirmar' }).click()
  }

  async flujoCodigoRecuperacion(variables){
    await this.page.goto(variables.urlTour)
    await this.page.getByRole('link', { name: '¿Olvidó su contraseña?' }).click()
    await this.page.getByRole('button', { name: 'Validar' }).waitFor({ state: 'visible' })
    await this.page.locator('#user').fill(variables.userName)
    await this.page.getByRole('button', { name: 'Validar' }).click()
  }

  async validacionContraseñaIncorrecta(variables){
    await this.page.getByPlaceholder('Código de confirmación').fill(variables.codigoInvalido)
    await this.page.getByPlaceholder('Nueva Contraseña', { exact: true }).fill(variables.password)
    await this.page.getByPlaceholder('Confirmar Nueva Contraseña').fill('falsa contraseña')
    await this.page.getByRole('button', { name: 'Confirmar' }).click()
    let texto = await this.page.locator('//div/div/div/div[2]/form/div[3]/p').textContent()
    expect(texto).toBe('Las contraseñas no coinciden.')
  }

  async validacionCamposVacios(){
    await this.page.getByRole('button', { name: 'Confirmar' }).click()
    let codigo = await this.page.locator('//div/div/div/div[2]/form/div[1]/p').textContent()
    let contraseña = await this.page.locator('//div/div/div/div[2]/form/div[2]/p').textContent()
    let confirmarContraseña = await this.page.locator('//div/div/div/div[2]/form/div[3]/p').textContent()
    expect(codigo).toBe('El código de confirmación es obligatorio.')
    expect(contraseña).toBe('La contraseña debe tener entre 7 y 14 caracteres.')
    expect(confirmarContraseña).toBe('La confirmación de la contraseña es obligatoria.')
  }
}

export default olvidarContraseña;