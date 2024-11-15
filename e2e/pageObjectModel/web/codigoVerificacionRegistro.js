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
      view1.goto(variables.urlBase),
      view2.goto(variables.urlMail)
    ])
  }

  async navegarRegistro(view1) {
    await view1.getByRole('link', { name: 'Iniciar sesión' }).click()
    await view1.getByRole('link', { name: '¿Aun no tienes cuenta?' }).click()
    await view1.waitForTimeout(2000)
  }

  async obtenerCorreoProvisional(view2) {
    await view2.locator('//*[@id="Dont_use_WEB_use_API"]').waitFor({ state: 'visible' })
    const texto = await view2.locator('//*[@id="Dont_use_WEB_use_API"]').getAttribute('value')
    this.correoprovicional = texto
  }

  async completarFormularioRegistro(view1, variables) {
    await view1.getByPlaceholder('Telefono').waitFor({ state: 'visible' })
    await view1.getByPlaceholder('E-mail').fill(this.correoprovicional)
    await view1.getByPlaceholder('Contraseña', { exact: true }).fill(variables.passwordWeb)
    await view1.getByPlaceholder('Confirmar Contraseña').fill(variables.passwordWeb)
    await view1.getByPlaceholder('Nombre').fill(variables.nombre)
    await view1.getByPlaceholder('Apellidos').fill(variables.apellido)
    await view1.getByPlaceholder('Telefono').fill(variables.telefono)
    await view1.getByRole('button', { name: 'Continuar' }).click()
  }

  async obtenerCodigoConfirmacion(view2, test) {
    await view2.waitForTimeout(2000)
    await view2.getByRole('link', { name: 'Refresh' }).click()
    await view2.getByRole('link', { name: 'I info@differentroads.es' }).waitFor({ state: 'visible' })
    await view2.getByRole('link', { name: 'I info@differentroads.es' }).click()
    await view2.evaluate(() => location.reload())

    const link = view2.getByRole('link', { name: 'I info@differentroads.es' })
    try {
      await link.waitFor({ state: 'visible', timeout: 3000 });
      await link.click();
    }catch (error) {
      test.info().annotations.push({ type: 'info', description: 'No se visualizo el codigo de confirmacion'})
    }

    const text = await view2.locator('[id="__nuxt"] iframe').contentFrame().getByText('Your confirmation code is').textContent()
    this.codigoVerificacion = text.match(/\d+/)[0]
    await view2.close()
  }

  async flujoRegistro(url) {
    await this.page.goto(url);
    await this.page.getByRole('link', { name: 'Iniciar sesión' }).click()
    await this.page.getByRole('link', { name: '¿Aun no tienes cuenta?' }).click()
    await this.page.getByPlaceholder('Telefono').waitFor({ state: 'visible' })
    await this.page.getByRole('button', { name: 'Continuar' }).click()
  }
}

export default codigoVerificacionRegistro;
