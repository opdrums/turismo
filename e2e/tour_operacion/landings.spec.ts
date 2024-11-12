import { expect, test } from '@playwright/test'
import * as fs from 'fs'

const path = require('path');
const configPath = path.resolve(__dirname, '../../e2e/configuracion/tour_operacion/landings.json');
const variables = JSON.parse(fs.readFileSync(configPath, 'utf8'));

test.describe('', () => {
    test.beforeEach(async ({ page }) => {
        
    })
    
    test.afterEach(async ({ page }) => {
        
    })

    test('', async ({ page }) => {
        await test.step('', async () => {
            
        })
        
    })
})
