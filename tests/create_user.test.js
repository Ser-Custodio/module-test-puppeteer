const timeout = 15000

// série de tests sur la page d'accueil
describe("Creer compte", () => {
    let page

    // vérification du chargement de la page d'accueil
    test('home', async () => {
        // charger la page d'accueil
        await page.goto('http://polr.campus-grenoble.fr')
        // attendre que l'élément <body> soit chargé
        await page.waitForSelector('body')
        // récupérer le contenu de l'élément <body>
        const html = await page.$eval('body', e => e.innerHTML)
        // vérifier que dans cet élément Body on trouve "Polr du campus"
        await page.screenshot({path: './tests/img/create_user/basic-home.png'});
        expect(html).toContain("Polr du campus")
    }, timeout)

    // Création d'un compte utilisateur
    test('create user account', async()=>{
        await page.goto('http://polr.campus-grenoble.fr');
        await page.waitForSelector('nav[role="navigation');
        // click sur le lien "Sign Up" de la navigation
        await page.screenshot({path: './tests/img/create_user/sign_up.png'});
        await page.evaluate( () => {
            Array
            .from( document.querySelectorAll('#navbar li a'))
            .filter(el => el.textContent === 'Sign Up' )[0].click()
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

    test('delete user', async () => {
        // charger la page d'accueil
        await page.goto('http://polr.campus-grenoble.fr');
        // attendre que l'élément <body> soit chargé
        await page.waitForSelector('body');
        // récupérer le contenu de l'élément <body>
        await page.waitForSelector('nav[role="navigation');
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
        await page.screenshot({path: './tests/img/create_user/delete.png'});
    }, timeout);

    //Se déconnecter du compte admin
    test('se deconnecter du compte admin', async () => {
        await page.click('.login-name', {delay : 500});
        await page.waitForSelector('.dropdown-menu');
        await page.screenshot({path: './tests/img/create_user/avant_logout_admin.png'});
        await page.evaluate( () => {
            Array
            .from( document.querySelectorAll('.dropdown-menu li a'))
            .filter( el => el.textContent === 'Logout')[0].click();
        });
        //Attendre que l'écran soit sur la page principale (donc déconnectée)
        await page.waitForSelector('h1');
        //Vérifier qu'on est déconnecté en cherchant "sign in"
        const htmlLogout = await page.$eval('.dropdown-toggle', e => e.innerHTML);
        expect(htmlLogout).toContain('Sign In');
        //Screenshot déconnexion
        await page.screenshot({path: './tests/img/create_user/logout_admin.png'});

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
