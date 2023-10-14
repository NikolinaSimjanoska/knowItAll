/*const { chromium, test, expect } = require('@playwright/test');

test('Testiranje aplikacije Electron', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    //await page.goto('C://Users//Nikolina//Desktop//spletne_100//my-app//src//index.html');
    await page.goto('file://' + __dirname + '/index.html');
  });*/


  const { _electron: electron } = require('playwright')
  const { test, expect } = require('@playwright/test')
  
  test('launch app', async () => {
    const electronApp = await electron.launch({ args: ['../src/main.js'] })
    await electronApp.close()
  })
  
  /*
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/App.jsx');
  });
  
  test.describe('New Todo', () => {
    test('should allow me to add todo items', async ({ page }) => {
      await expect(page.getByTestId('my-button')).toHaveText('Add');
  
    })
  })
  
  */
  
  test('example test', async () => {
    const electronApp = await electron.launch({ args: ['.'] })
    const isPackaged = await electronApp.evaluate(async ({ app }) => {
      // This runs in Electron's main process, parameter here is always
      // the result of the require('electron') in the main app script.
      return app.isPackaged;
    });
  
    expect(isPackaged).toBe(false);
  
    // Wait for the first BrowserWindow to open
    // and return its Page object
    const window = await electronApp.firstWindow()
    //await window.setSize(800, 600);
    //await window.screenshot({ path: 'intro.png' })
  
    const buttonExists = await window.evaluate(() => {
      const button = document.getElementById('my-button')
      return !!button
    })
    console.log(`Button exists: ${buttonExists}`)
    // close app
    await electronApp.close()
  });
  
  /*test('check text on window', async () => {
    const electronApp = await electron.launch({ args: ['../my-app/src/main.js'] })
  
    const window = await electronApp.firstWindow()
  
    const expectedText = 'Hello, world!'
  
    const actualText = await window.evaluate(() => {
      return document.body.innerText
    })
  
    expect(actualText).toContain(expectedText)
  
    await electronApp.close()
  }, 60000)
 */ 