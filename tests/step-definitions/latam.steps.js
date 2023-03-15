import { Given, When, Then, After, Before, } from '@wdio/cucumber-framework';


import JiraReporter from '../utils/jiraReporter.js';

import LatamPage from '../page-objects/latam.page.js';

const latamPage = new LatamPage();
const jiraReporter = new JiraReporter();

Before((scenario) => {
    process.env.SCENARIO_NAME = JSON.stringify(scenario.pickle.name);
    process.env.SESSION_ID = browser.sessionId;
})

Given("I am on the LATAM Airlines website", async () => {
    await latamPage.open();
    await browser.pause(7000);
});

When("Selecting the Spanish language", async () => {
    await latamPage.selectLanguage()
    await browser.pause(3000)
});

Then(/^I search for a flight from (.+) to (.+) on (.+) to (.+)$/, async (origin, destination, departureDate, returnDate) => {
    await latamPage.searchFlight(origin, destination, departureDate, returnDate)
    await browser.pause(5000)
});

Then(/^I should see the results page (.+)$/, async (message) => {
    await latamPage.searchFlightMessage(message)
    await browser.pause(8000);
    browser.takeScreenshots();
});

After(async () => {
    let testStatus = process.env.TEST_STATUS ? 'PASSED' : 'FAILED';
    //FALTA DEFINIR DESDE DONDE SE OBTENDRÁ EL TIEMPO DE INICIO Y TERMINO DEL TEST
    let testStartMillis = 15000;
    let testEndMillis = 50000;
    await jiraReporter.reportToZephyrResult(testStatus, 'FUTEDE-C21', 'FUTEDE-T101', 'WEB', 'null', 
                                            'QA', testStartMillis , testEndMillis, 'JS Prueba');
});