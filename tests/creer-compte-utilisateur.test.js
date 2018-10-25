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
        await page.screenshot({path: './tests/img/basic-home.png'});
        expect(html).toContain("Polr du campus")
    }, timeout)

    // Création d'un compte utilisateur
    test('click Sign Up', async()=>{
        await page.goto('http://polr.campus-grenoble.fr');
        await page.waitForSelector('#navbar li a');
        // click sur le lien "Sign Up" de la navigation
        await page.evaluate( () => {
            Array
                .from( document.querySelectorAll('#navbar li a'))
                .filter(el => el.textContent === 'Sign Up' )[0].click()
        });
        // on attent que l'élément ".title" soit chargé
        await page.waitForSelector('.title')
        // on récupère le code HTML
        const html = await page.$eval('.title', e => e.innerHTML)
        // on vérifie qu'il contient la bonne chaîne de caractères
        expect(html).toContain("Register")

        // renseigner les champs
        await page.type('form[action="/signup"] input[name="username"]', 'tati');
        await page.type('form[action="/signup"] input[name="password"]', 'azerty');
        await page.type('form[action="/signup"] input[name="email"]', 'tati@example.com');
        await page.click('form[action="/signup"] input[type="submit"]');
    }, timeout)




    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        // ouvrir un onglet dans le navigateur
        page = await global.__BROWSER__.newPage()
    }, timeout)

})
