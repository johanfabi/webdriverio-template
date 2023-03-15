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

  get btnModal () {
    return $("#header__currentCurrency")
  }

  get inputPais(){
    return $("//div[@role='button']")
  }
  get selectPais(){
    return $("//li[normalize-space()='Chile · CLP $']")
  }
  get btnLenguage(){
    return $("#country-lang-selector-radio-button-es")
  }
  get btnContinuar(){
    return $("#country-lang-selector-continue-button")
  }
  get btnCloseModal () {
    return $("//span[@class='MuiIconButton-label']//i[@class='sc-htpNat ktPDRh']//*[name()='svg']")
}
  /**
   * Methods to interact with the LATAM airlines website
   */
  async selectLanguage (){
    await browser.pause(10000);
    let languageModalDisplayed = await this.btnModal.isDisplayed();
    if(languageModalDisplayed) {
      await this.btnModal.click();
      await browser.pause(5000);
      await this.btnLenguage.click();
      await this.btnContinuar.click();
    }
    await browser.pause(10000)
  }


  /**
   * Search Flight
   * 
   */
  async searchFlight(origin, destination, departureDate, returnDate) {
    await this.btnFlight.click();
    await this.inputOrigin.setValue(origin);

    await this.selectOrigin.click();
    await browser.pause(3000)

    await this.inputDestination.setValue(destination);

    await browser.pause(3000)
    await this.selectDestination.click();
    await browser.pause(5000)
    await this.departureDate.click();
    await $(
      "td[aria-label='Elija " +
        departureDate +
        " como su fecha de ida. Está disponible.']"
    ).click();
    await this.returnDate.click();
    await $(
      "td[aria-label='Elija " + returnDate +
        " como fecha de vuelta. Está disponible.']"
    ).click();
    await browser.pause(5000)
    await this.btnSearch.click();
  }

  /**
   * Validate Search Flight Message
   */
  async searchFlightMessage() {
    await this.validation.isDisplayed();
  }
}

