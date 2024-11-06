import { expect } from '@playwright/test';

export class invitacionUsuario {
    constructor(page){
        this.page = page
        this.correoprovicional = null
    }

    async abrirVistas(view1, view2, variables) {
        view1.setDefaultTimeout(120000)
        view2.setDefaultTimeout(120000)
    
        await Promise.all([
          view1.goto(variables.urlBase),
          view2.goto(variables.urlMail)
        ])
    }
    
    async iniciarSessionTourOperacion(view1, variables){
        await view1.locator('#user').fill(variables.userName)
        await view1.locator('#password').fill(variables.password)
        await view1.getByRole('button', { name: 'Entrar'}).click()
        await view1.getByRole('link', { name: ' Usuarios' }).click()
        await view1.getByRole('button', { name: 'Invitar Usuario' }).click()
    }

    async obtenerEmailProvicional(view2){
        view2.locator('//*[@id="Dont_use_WEB_use_API"]').waitFor({state: 'visible'})
        let texto = await view2.locator('//*[@id="Dont_use_WEB_use_API"]').getAttribute('value');
        this.correoprovicional = texto;
    }

    async seleccionarRol(view1,rol){
        await view1.getByPlaceholder('E-mail').fill(this.correoprovicional)
        await view1.locator('div').filter({ hasText: new RegExp(`^${rol}$`) }).getByRole('checkbox').check()
        await view1.getByRole('button', { name: 'Enviar invitación' }).click()
        await view1.getByText('Invitación enviada exitosamente.').waitFor({state:'visible'})
        await view1.close()
    }

    async obtenerCodigoConfirmacion(view2) {
        await view2.waitForTimeout(2000)
        await view2.getByRole('link', { name: 'Refresh' }).click()
        await view2.getByRole('link', { name: 'I info@differentroads.es' }).waitFor({ state: 'visible'})
        await view2.getByRole('link', { name: 'I info@differentroads.es' }).click()
        await view2.evaluate(() => location.reload())
    
        const link = view2.getByRole('link', { name: 'I info@differentroads.es' })
        try {
          await link.waitFor({ state: 'visible', timeout: 3000 });
          await link.click();
        }catch (error) {
          console.log('El elemento no es visible, continuar...');
        }
        await view2.locator('[id="__nuxt"] iframe').contentFrame().getByRole('link', { name: 'Aceptar invitación' }).click()
        await view2.close()
    }

    async validarTituloRegistroUsuario( context){
        const [view3] = await Promise.all([
            context.waitForEvent('page'), 
        ])

        await view3.getByRole('heading', { name: 'Completa tu registro' }).waitFor({ state: 'visible' })
        const tituloVisible = await view3.locator('//html/body/div[1]/div/div/div[1]/h1').textContent()
        expect(tituloVisible).toBe('Completa tu registro')
    }

    async iniciarSessionInvitacion(url, userName, password){
        await this.page.goto(url)
        await this.page.locator('#user').fill(userName)
        await this.page.locator('#password').fill(password)
        await this.page.getByRole('button', { name: 'Entrar'}).click()
        await this.page.getByRole('link', { name: ' Usuarios' }).click()
        await this.page.getByRole('button', { name: 'Invitar Usuario' }).click()
    }
}

export default invitacionUsuario;