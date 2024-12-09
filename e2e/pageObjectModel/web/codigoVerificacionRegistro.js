import * as dotenv from 'dotenv'
import { expect} from '@playwright/test'
dotenv.config()

export class codigoVerificacionRegistro {
  constructor(page) {
    this.page = page
    this.correoprovicional = null
    this.codigoVerificacion = null
  }

  async abrirVistas(view1, view2, variables) {
    view1.setDefaultTimeout(120000)
    view2.setDefaultTimeout(120000)

    await Promise.all([
      view1.goto(`${process.env.baseUrlWeb}`),
      view2.goto(`${process.env.baseUrlMail}`)
    ])
  }

  async navegarRegistro(view1) {
    await view1.locator('//header/div[2]/div/div[3]').click()
    await view1.getByRole('link', { name: '¿Aun no tienes cuenta?' }).click()
    await view1.waitForTimeout(5000)
  }

  async obtenerCorreoProvisional(view2) {
    await view2.locator('//*[@id="Dont_use_WEB_use_API"]').waitFor({ state: 'visible' })
    const texto = await view2.locator('//*[@id="Dont_use_WEB_use_API"]').getAttribute('value')
    this.correoprovicional = texto
  }

  async completarFormularioRegistro(view1, variables) {
    await view1.getByPlaceholder('Telefono').waitFor({ state: 'visible' })
    await view1.getByPlaceholder('Nombre').fill(variables.nombre)
    await view1.getByPlaceholder('Apellidos').fill(variables.apellido)
    await view1.getByPlaceholder('E-mail').fill(this.correoprovicional)
    await view1.getByPlaceholder('Telefono').fill(variables.telefono)
    await view1.getByPlaceholder('Contraseña', { exact: true }).fill(variables.passwordWeb)
    await view1.getByPlaceholder('Confirmar Contraseña').fill(variables.passwordWeb)
    await view1.locator('//div[1]/div[3]/form/button').click()
  }

  async obtenerCodigoConfirmacion(view2, test) {
    await view2.waitForTimeout(2000)
    await view2.getByRole('link', { name: 'Refresh' }).click()
    await view2.getByRole('link', { name: 'no-reply@verificationemail.com' }).waitFor({ state: 'visible' })
    await view2.getByRole('link', { name: 'no-reply@verificationemail.com' }).click()
    await view2.evaluate(() => location.reload())

    const link = view2.getByRole('link', { name: 'no-reply@verificationemail.com' })
    try {
      await link.waitFor({ state: 'visible', timeout: 5000 });
      await link.click()
    }catch (error) {
        test.info().annotations.push({ type: 'info', description: 'No se visualizo el pop up'})
    }
    const text = await view2.locator('[id="__nuxt"] iframe').contentFrame().getByText('Your verification code is').textContent()
    this.codigoVerificacion = text.match(/\d+/)[0]
    await view2.close()
  }

  async validacionCodigoConfirmacion(view1, variables){
    await view1.getByRole('button', { name: 'Verificar código' }).waitFor({ state: 'visible' })
    await view1.getByPlaceholder('Código de confirmación').fill(variables.codigoVerificacionIncorrecto)
    await view1.getByRole('button', { name: 'Verificar código' }).click()
    expect(await view1.getByText('El código de confirmación es')).toContainText('El código de confirmación es incorrecto')

    await view1.getByPlaceholder('Código de confirmación').clear()
    await view1.getByPlaceholder('Código de confirmación').fill(this.codigoVerificacion)
    await view1.getByRole('button', { name: 'Verificar código' }).click()
    await view1.getByRole('link', { name: this.correoprovicional }).waitFor({ state: 'visible' })
    expect(view1.getByRole('link', { name: this.correoprovicional })).toBeVisible()
  }

  async flujoRegistro(url) {
    await this.page.goto(url);
    
    await this.page.locator('//header/div[2]/div/div[3]').click()
    await this.page.getByRole('link', { name: '¿Aun no tienes cuenta?' }).click()
    await this.page.getByPlaceholder('Telefono').waitFor({ state: 'visible' })
    await this.page.locator('//div[1]/div[3]/form/button').click()
  }
}

export default codigoVerificacionRegistro;
