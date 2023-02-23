import { Given, When, Then, } from '@wdio/cucumber-framework';


import LatamPage from '../page-objects/latam.page.js';

const latamPage = new LatamPage();

Given("I am on the LATAM Airlines website", async () => {
    await latamPage.open()
    await browser.pause(2000)
});

When("Selecting the Spanish language", async () => {
    await latamPage.selectLanguage()
    await browser.pause(2000)
});

Then(/^I search for a flight from (.+) to (.+) on (.+) to (.+)$/, async (origin, destination, departureDate, returnDate) => {
    await latamPage.searchFlight(origin, destination, departureDate, returnDate)
    await browser.pause(5000)
});

Then(/^I should see the results page (.+)$/, async (message) => {
    await latamPage.searchFlightMessage(message)
    await browser.pause(5000)
});

