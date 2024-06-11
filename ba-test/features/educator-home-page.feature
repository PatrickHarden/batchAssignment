
Feature: Verify Home Page for educator

    @Regression
    Scenario Outline: Educator logins to CPD and verifies Home page elements
        Given User logins to SDM as a <educator>

        Examples:
            | educator |
            | teacher1 |

    @Regression
    Scenario Outline: Student logins to CPD and verifies Home page elements
        Given User logins to SDM as a <student>

        Examples:
            | student |
            | student1 |
