import Page from "./web.base.page.js";

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class LatamPage extends Page {
  /**
   * Locate WebElements from the LATAM airlines website
   */
  get btnFlight() {
    return $("#id-tab-flight");
  }

  get inputOrigin() {
    return $("#txtInputOrigin_field");
  }

  get selectOrigin() {
    return $("#btnItemAutoComplete_0");
  }

  get inputDestination() {
    return $("#txtInputDestination_field");
  }

  get selectDestination() {
    return $("#btnItemAutoComplete_0");
  }

  get departureDate() {
    return $("#departureDate");
  }

  get returnDate() {
    return $("#arrivalDate");
  }

  get btnSearch() {
    return $("#btnSearchCTA");
  }

  get validation() {
    return $("#titleSelectFlightDesktop");
  }

  /**
   * Methods to interact with the LATAM airlines website
   */

  /**
   * Search Flight
   */
  async searchFlight(origin, destination, departureDate, returnDate) {
    await this.btnFlight.click();
    await this.inputOrigin.setValue(origin);
    await this.selectOrigin.click();
    await this.inputDestination.setValue(destination);
    await this.selectDestination.click();
    await this.departureDate.click();
    await $(
      "td[aria-label='Elija " +
        departureDate +
        " como su fecha de ida. Está disponible.']"
    ).click();
    await this.returnDate.click();
    await $(
      "td[aria-label='Elija " +returnDate+
        " como fecha de vuelta. Está disponible.']"
    ).click();
    await this.btnSearch.click();
  }

  /**
   * Validate Search Flight Message
   */
  async searchFlightMessage() {
    await this.validation.isDisplayed();
  }
}

