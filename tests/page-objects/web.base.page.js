/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {

    /**
    * Opens a sub page of the page
    */
    open () {
        browser.maximizeWindow()
        return browser.url('https://www.latamairlines.com/')
    }

    /**
    * Login to the page
    */
    login () {
        
    }
}
