
export class olvidarContraseña {
  constructor(page) {
    this.page = page
    this.codigoVerificacion = null
    
  }

  async abrirVistas(view1, view2, variables) {
    view1.setDefaultTimeout(120000)
    view2.setDefaultTimeout(120000)

    await Promise.all([
      view1.goto(variables.urlTour),
      view2.goto(variables.urlTeam)
    ]);
  }

  async iniciarRecuperacionContraseña(view1, variables) {
    await view1.getByRole('button', { name: 'Entrar' }).waitFor({ state: 'visible' })
    await view1.getByRole('link', { name: '¿Olvidó su contraseña?' }).click()
    await view1.getByRole('button', { name: 'Validar' }).waitFor({ state: 'visible' })
    await view1.locator('#user').fill(variables.userName)
    await view1.getByRole('button', { name: 'Validar' }).click()
  }

  async iniciarSesionMicrosoft(view2, variables) {
    await view2.getByRole('button', { name: 'Next' }).waitFor({ state: 'visible' })
    await view2.getByPlaceholder('Email, phone, or Skype').fill(variables.email)
    await view2.getByRole('button', { name: 'Next' }).click()
    await view2.getByPlaceholder('Password').fill(variables.password)
    await view2.getByRole('button', { name: 'Sign in' }).click()
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

  async flujoCodigoRecuperacion(url, userName){
    await this.page.goto(url)
    await this.page.getByRole('link', { name: '¿Olvidó su contraseña?' }).click()
    await this.page.getByRole('button', { name: 'Validar' }).waitFor({ state: 'visible' })
    await this.page.locator('#user').fill(userName)
    await this.page.getByRole('button', { name: 'Validar' }).click()
  }
}

export default olvidarContraseña;