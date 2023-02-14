Feature: Tests Automations for Website LATAM Airlines

    @Test3
    Scenario: Search flights

        Given I am on the LATAM Airlines website
        When I search for a flight from <origin> to <destination> on <departureDate> to <returnDate>
        Then I should see the results page <message>

    Examples:
        | origin                | destination       | departureDate | returnDate    | message                           |
        | Santiago de Chile     | Miami             | Fecha1        | Fecha2        | You logged into a secure area!    |

