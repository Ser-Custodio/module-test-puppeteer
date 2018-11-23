const timeout = 15000

// série de tests sur la page d'accueil
describe("Tests basiques", () => {
    let page;
    var urlEnding;
    var clickVal;
    var newClickVal;
    test('create user account', async()=>{
        await page.goto('http://localhost:8000');
        await page.waitForSelector('nav[role="navigation');
        // click sur le lien "Sign Up" de la navigation
        await page.screenshot({path: './tests/img/click_counter/sign_up.png'});
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll('#navbar li a'))
                .filter(el => el.textContent === 'Sign Up')[0].click()
        });
        // on attent que l'élément ".title" soit chargé
        await page.waitForSelector('.title');
        // on récupère le code HTML
        const html = await page.$eval('.title', e => e.innerHTML)
        // on vérifie qu'il contient la bonne chaîne de caractères
        expect(html).toContain("Register");
        await page.waitForSelector('form[action="/signup"]');
        // renseigner les champs
        await page.type('form[action="/signup"] input[name="username"]', 'tati');
        await page.type('form[action="/signup"] input[name="password"]', 'azerty');
        await page.type('form[action="/signup"] input[name="email"]', 'tati@example.com');
        await page.click('form[action="/signup"] input[type="submit"]');
    }, timeout);

    test('user stats', async () => {
        // charger la page d'accueil
        await page.goto('http://localhost:8000');
        // attendre que l'élément <body> soit chargé
        await page.waitForSelector('body');
        // récupérer le contenu de l'élément <body>
        await page.waitForSelector('nav[role="navigation');
        await page.click('.dropdown-toggle');
        await page.waitForSelector('.login-dropdown-menu');
        // renseigner les champs
        await page.type('input[name="username"]', 'tati');
        await page.type('input[name="password"]', 'azerty');
        await page.click('input[name="login"]');
        // verifier que on est bien connecte
        await page.waitForSelector('.login-name');
        const html = await page.$eval('.login-name', e => e.innerHTML);
        expect(html).toContain('tati');
    }, timeout);

    test('créer url simplifié', async() => {
        // creer un url simplifié
        await page.waitForSelector('.long-link-input')
        var random = Math.random();
        await page.type('.long-link-input', 'https://www.google.com/search?q=toto'+random);
        await page.screenshot({path: './tests/img/click_counter/shorten-url.png'});
        await page.waitForSelector('#shorten')
        await page.$eval('#shorten', el => el.click());
        await page.waitForSelector('#short_url')
        const val = await page.$eval('#short_url', el => el.value)
        expect(val).toMatch(/^http:\/\/localhost:8000\/[A-Za-z0-9]+/)
        await page.screenshot({path: './tests/img/shorten-url-user.png'});
    }, timeout);

    test('entrer dans le dashboard/links', async() => {
        // entrer dans le dashboard
        await page.click('.login-name');
        await page.waitForSelector('.dropdown-menu');
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll('.dropdown-menu li a'))
                .filter( el => el.textContent === 'Dashboard')[0].click();
        });
        await page.screenshot({path: './tests/img/click_counter/dashboard.png'});
        await page.waitForSelector('h2');
        await page.waitForSelector('.nav-pills');
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll('.admin-nav-item a'))
                .filter( el => el.textContent === 'Links')[0].click();
        });
        await page.screenshot({path: './tests/img/click_counter/links.png'});
        await page.waitForSelector('.sorting_1');
        const tdCounts = await page.$$eval('#user_links_table_wrapper tbody td', tds => tds.length);
        expect(tdCounts).toBeGreaterThanOrEqual(2);
        await page.screenshot({path: './tests/img/click_counter/user_stats.png'});
    }, timeout);

    test('recuperer le nombre de clicks et la fin du link', async() => {
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll('#user_links_table thead tr th'))
                .filter( el => el.textContent === 'Link Ending')[0].click();
        });
        await page.screenshot({path: './tests/img/linksTable.png'});
        urlEnding = await page.$eval('#user_links_table tbody tr td:nth-child(1)', e => e.innerHTML);
        clickVal = await page.$eval('#user_links_table tbody tr td:nth-child(3)', e => e.innerHTML);
        expect(parseInt(clickVal)).toBe(0);
    }, timeout);

    test('open the created link and return to Polr', async() => {
        await page.goto('http://localhost:8000/'+urlEnding);
        await page.screenshot({path: './tests/img/click_counter/newPage.png'});
        await page.goto('http://localhost:8000/');
        await page.screenshot({path: './tests/img/click_counter/returnToPage.png'});
    }, timeout);

    test('count new visits on the link', async() => {
        await page.click('.login-name');
        await page.waitForSelector('.dropdown-menu');
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll('.dropdown-menu li a'))
                .filter( el => el.textContent === 'Dashboard')[0].click();
        });
        await page.screenshot({path: './tests/img/click_counter/dashboard.png'});
        await page.waitForSelector('h2');
        await page.waitForSelector('.nav-pills');
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll('.admin-nav-item a'))
                .filter( el => el.textContent === 'Links')[0].click();
        });
        await page.screenshot({path: './tests/img/click_counter/links.png'});
        await page.waitForSelector('.sorting_1');
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll('#user_links_table thead tr th'))
                .filter( el => el.textContent === 'Link Ending')[0].click();
        });
        await page.screenshot({path: './tests/img/click_counter/linksTable2.png'});
        newClickVal = await page.$eval('#user_links_table tbody tr td:nth-child(3)', e => e.innerHTML);
        expect(parseInt(newClickVal)).toBe(parseInt(clickVal)+1);
        clickVal = newClickVal;
    }, timeout);

    test('second click on the link and count', async() => {
        await page.goto('http://localhost:8000/'+urlEnding);
        await page.goto('http://localhost:8000/');
        await page.click('.login-name');
        await page.waitForSelector('.dropdown-menu');
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll('.dropdown-menu li a'))
                .filter( el => el.textContent === 'Dashboard')[0].click();
        });
        await page.waitForSelector('h2');
        await page.waitForSelector('.nav-pills');
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll('.admin-nav-item a'))
                .filter( el => el.textContent === 'Links')[0].click();
        });
        await page.waitForSelector('.sorting_1');
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll('#user_links_table thead tr th'))
                .filter( el => el.textContent === 'Link Ending')[0].click();
        });
        await page.screenshot({path: './tests/img/click_counter/linkTable3.png'});
        const newClickVal2 = await page.$eval('#user_links_table tbody tr td:nth-child(3)', e => e.innerHTML);

        expect(parseInt(newClickVal2)).toBe(parseInt(newClickVal)+1);
    }, timeout);

    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        // ouvrir un onglet dans le navigateur
        page = await global.__BROWSER__.newPage()
    }, timeout)

})
