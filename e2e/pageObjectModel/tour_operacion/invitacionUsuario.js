import { expect } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config()

export class invitacionUsuario {
    constructor(page){
        this.page = page
        this.correoprovicional = null
    }

    async abrirVistas(view1, view2, variables) {
        view1.setDefaultTimeout(120000)
        view2.setDefaultTimeout(230000)
    
        await Promise.all([
          view1.goto(`${process.env.baseUrlMiddle}`),
          view2.goto(`${process.env.baseUrlMail}`)
        ])
    }
    
    async iniciarSessionTourOperacion(view1, variables){
        await view1.locator('#user').fill(variables.userName)
        await view1.locator('#password').fill(variables.password)
        await view1.getByRole('button', { name: 'Entrar'}).click()
        await view1.getByRole('link', { name: ' Usuarios' }).click()
        await view1.getByRole('button', { name: ' Añadir usuario' }).click()
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

    async obtenerCodigoConfirmacion(view2, test) {
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
            test.info().annotations.push({ type: 'info', description: 'No se visualizo el pop up'})
        }
        await view2.locator('[id="__nuxt"] iframe').contentFrame().getByRole('link', { name: 'Aceptar invitación' }).click()
        await view2.close()
    }

    async validarTituloRegistroUsuario(context){
        const [view3] = await Promise.all([
            context.waitForEvent('page'), 
        ])

        await view3.getByRole('heading', { name: 'Completa tu registro' }).waitFor({ state: 'visible' })
        const tituloVisible = await view3.locator('//html/body/div[1]/div/div/div[1]/h1').textContent()
        expect(tituloVisible).toBe('Completa tu registro')
    }


    async regististroUsuario(context, variables){
        const nombres = ["Juan", "Ana", "Carlos", "Maria", "Luis", "Sofia", "Miguel", "Elena"]
        const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)]
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
        const [view3] = await Promise.all([
            context.waitForEvent('page'), 
        ])

        await view3.getByRole('heading', { name: 'Completa tu registro' }).waitFor({ state: 'visible' })
        await view3.getByPlaceholder('Usuario').fill(`${nombreAleatorio}${numeroAleatorio}`)
        await view3.getByPlaceholder('Nombre').fill(variables.nombre)
        await view3.getByPlaceholder('Contraseña', { exact: true }).fill(variables.password)
        await view3.getByPlaceholder('Apellido').fill(variables.apellido)
        await view3.getByPlaceholder('Confirmar contraseña').fill(variables.password)
        await view3.getByRole('button', { name: 'Completar registro' }).click()
        await view3.getByText('Se ha enviado un código a tu').waitFor({state: 'visible'})
        expect(view3.getByText('Se ha enviado un código a tu')).toBeVisible()
    }

    async iniciarSessionInvitacion(variables){
        await this.page.goto(variables.urlBase)
        await this.page.locator('#user').fill(variables.userName)
        await this.page.locator('#password').fill(variables.password)
        await this.page.getByRole('button', { name: 'Entrar'}).click()
        await this.page.getByRole('link', { name: ' Usuarios' }).click()
        await this.page.getByRole('button', { name: ' Añadir usuario' }).click()
    }

    async validacionCamposObligatorios(context){
        const [view3] = await Promise.all([
            context.waitForEvent('page'), 
        ])

        await view3.getByRole('button', { name: 'Completar registro' }).click()
        expect(await view3.getByText('El usuario es requerido.')).toBeVisible()
        expect(await view3.getByText('El nombre es requerido.')).toBeVisible()
        expect(await view3.getByText('La contraseña es requerida.')).toBeVisible()
        expect(await view3.getByText('El apellido es requerido.')).toBeVisible()
    }

    async validacionUsuarioRegistrado(context, variables){
        const [view3] = await Promise.all([
            context.waitForEvent('page'), 
        ])

        await view3.getByPlaceholder('Usuario').fill(variables.usuario)
        await view3.getByPlaceholder('Nombre').fill(variables.nombre)
        await view3.getByPlaceholder('Contraseña', { exact: true }).fill(variables.password)
        await view3.getByPlaceholder('Apellido').fill(variables.apellido)
        await view3.getByPlaceholder('Confirmar contraseña').fill(variables.password)
        await view3.getByRole('button', { name: 'Completar registro' }).click()
        await view3.getByText('El nombre de usuario ya').waitFor({state:'visible'})
        expect(await view3.getByText('El nombre de usuario ya')).toHaveText('El nombre de usuario ya existe. Por favor, elija otro.')
    }

    async validacionContraseñaIncorrecta(context, variables){
        const [view3] = await Promise.all([
            context.waitForEvent('page'), 
        ])

        await view3.getByPlaceholder('Usuario').fill(variables.usuario)    
        await view3.getByPlaceholder('Nombre').fill(variables.nombre)
        await view3.getByPlaceholder('Contraseña', { exact: true }).fill(variables.password)
        await view3.getByPlaceholder('Apellido').fill(variables.apellido)
        await view3.getByPlaceholder('Confirmar contraseña').fill(variables.passwordError)
        await view3.getByRole('button', { name: 'Completar registro' }).click()
        expect(await view3.getByText('Las contraseñas no coinciden')).toHaveText('Las contraseñas no coinciden')
    }

    async validacionCorreoAndRolVacio(){
        await this.page.getByRole('button', { name: 'Enviar invitación' }).click() 
        const mensajeError1 = await this.page.locator('//div[2]/div/form/div/div[1]/p[1]').textContent()
        expect(mensajeError1).toBe('El correo electrónico es requerido.')   
        const mensajeError2 = await this.page.locator('//div[2]/div/form/div/div[2]/p[1 ]').textContent()
        expect(mensajeError2).toBe('Se debe seleccionar al menos un rol de usuario.')
    }

    async validacionCorreoExiste(variables){
        await this.page.getByPlaceholder('E-mail').fill(variables.email)
        await this.page.locator('div').filter({ hasText: /^Admin de Tours$/ }).getByRole('checkbox').check()
        await this.page.getByRole('button', { name: 'Enviar invitación' }).click()
        await this.page.getByText('El correo electrónico es')
        const mensajeError = await this.page.getByText('Error al enviar la invitación').textContent()
        await expect(mensajeError).toBe('Error al enviar la invitación. Por favor, intente de nuevo.') 
    }
}

export default invitacionUsuario;