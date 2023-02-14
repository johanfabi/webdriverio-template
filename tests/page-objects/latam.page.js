

import Page from './page.js';

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class LatamPage extends Page {

/**
 * Locate WebElements from the LATAM airlines website
 */
    get btnFlight () {
        return $('#id-tab-flight');
    }

    get inputOrigin () {
        return $('#txtInputOrigin_field');
    }

    get selectOrigin () {
        return $('#btnItemAutoComplete_0');
    }

    get inputDestination () {
        return $('#txtInputDestination_field');
    }

    get selectDestination () {
        return $('#btnItemAutoComplete_0');
    }

/**
 * Methods to interact with the LATAM airlines website 
 */

    /**
    * Search Flight
    */
    async searchFlight (origin, destination, departureDate, returnDate) {
        await this.btnFlight.click();
        await this.inputOrigin.setValue(origin);
        await this.selectOrigin.click();
        await this.inputDestination.setValue(destination);
        await this.selectDestination.click();
        console.log(departureDate);
        console.log(returnDate);       
    }

    /**
    * Validate Search Flight Message
    */
    searchFlightMessage (message) {
        console.log(message)
    }
}