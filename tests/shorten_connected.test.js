const timeout = 15000

// série de tests sur la page d'accueil
describe("Delete Account", () => {
    let page

test('delete user', async () => {
    // charger la page d'accueil
    await page.goto('http://polr.campus-grenoble.fr');
// attendre que l'élément <body> soit chargé
await page.waitForSelector('body');
// récupérer le contenu de l'élément <body>
await page.waitForSelector('#navbar li a');
await page.click('.dropdown-toggle');
await page.waitForSelector('.login-dropdown-menu');

// renseigner les champs
await page.type('input[name="username"]', 'tati');
await page.type('input[name="password"]', 'azerty');
await page.click('input[name="login"]');

// verifier que on est bien connecte en tant qu'admin
await page.waitForSelector('.login-name');
const html = await page.$eval('.login-name', e => e.innerHTML);
expect(html).toContain('tati');
    await page.screenshot({path: './tests/img/connect-user.png'});

    await page.waitForSelector('.long-link-input');
    await page.type('.long-link-input', 'https://www.google.com/search?source=hp&ei=QQbPW52GC9CRlwSHw46oAg&q=puppeteer+jest&oq=puppeteer+jest&gs_l=psy-ab.3...2441.6095.0.6926.0.0.0.0.0.0.0.0..0.0....0...1c.1.64.psy-ab..0.0.0....0.qKd5wLlrTYk');
    //await page.screenshot({path: './tests/img/shorten1.png'});
    await page.waitForSelector('#shorten');
    await page.$eval( '#shorten', el => el.click());
    await page.waitForSelector('#short_url');
    const val = await page.$eval('#short_url', el => el.value);
    expect(val).toMatch(/^http:\/\/polr\.campus\-grenoble\.fr\/[0-9]+/);
    //await page.screenshot({path: './tests/img/shorten2.png'});
}, timeout)
// cette fonction est lancée avant chaque test de cette
// série de tests
beforeAll(async () => {
    // ouvrir un onglet dans le navigateur
    page = await global.__BROWSER__.newPage();

// Define all dialog boxes to click accept
page.on('dialog', async dialog =>{
    await dialog.accept();
})
}, timeout)

})