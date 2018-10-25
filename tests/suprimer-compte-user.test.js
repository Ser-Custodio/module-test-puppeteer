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
        await page.type('input[name="username"]', 'admin');
        await page.type('input[name="password"]', 'campus');
        await page.click('input[name="login"]');

        // verifier que on est bien connecte en tant qu'admin
        await page.waitForSelector('.login-name');
        const html = await page.$eval('.login-name', e => e.innerHTML);
        expect(html).toContain('admin');

        // entrer dans le dashboard
        await page.click('.login-name');
        await page.waitForSelector('.dropdown-menu');
        await page.evaluate( () => {
            Array
            .from( document.querySelectorAll('.dropdown-menu li a'))
            .filter( el => el.textContent === 'Dashboard')[0].click();
        });
        await page.waitForSelector('h2');
        const htmlDash = await page.$eval('h2', e => e.innerHTML);
        expect(htmlDash).toContain("Welcome to your Polr du campus dashboard!");

        await page.waitForSelector('.nav-pills');
        await page.evaluate( () => {
            Array
            .from( document.querySelectorAll('.admin-nav-item a'))
            .filter( el => el.textContent === 'Admin')[0].click();
        });

        await page.waitForSelector('#admin_users_table_filter');
        await page.type('#admin_users_table_filter input[type="search"]', 'tati@example.com',{delay: 100});

        // await page.waitForSelector('#admin_users_table_info');
        const htmlDelete = await page.$eval('#admin_users_table tr td .btn-danger', e => e.innerHTML);
        expect(htmlDelete).toContain("Delete");


        await page.click('#admin_users_table tr td .btn-danger');

        await page.screenshot({path: './tests/img/delete.png'});


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