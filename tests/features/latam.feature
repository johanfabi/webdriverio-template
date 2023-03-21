Feature: Tests Automations for Website LATAM Airlines

    @Test1
    Scenario: Search flights

        Given I am on the LATAM Airlines website
        When Select spanish language
        Then I search for a flight from <origin> to <destination> on <departureDate> to <returnDate>
        Then I should see the results page <message>

    Examples:
        | origin                | destination       | departureDate              | returnDate                   | message                           |
        | Santiago de Chile     | Miami             | sábado, 1 de abril de 2023 | domingo, 16 de abril de 2023 | You flight was quoted successfully|

