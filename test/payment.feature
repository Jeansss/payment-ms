Feature: Payment Management

  Scenario: Create a new payment method
    Given I have a payment method
    When I create the payment method
    Then I should receive the created payment method

  Scenario: Get all payment methods
    Given there are payment methods in the system
    When I get all payment methods
    Then I should receive a list of payment methods