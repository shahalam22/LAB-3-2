package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class SignupPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    // Locators
    private final By createNewAccountLink = By.linkText("Create new account");
    private final By firstNameField = By.id("user_first_name");
    private final By lastNameField = By.id("user_last_name");
    private final By emailField = By.id("user_email");
    private final By passwordField = By.id("user_password");
    private final By passwordConfirmationField = By.id("user_password_confirmation");
    private final By submitButton = By.cssSelector("button[type='submit']");
    private final By errorMessage = By.cssSelector(".error");

    public SignupPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void navigateTo() {
        driver.get("http://localhost:4000/sign_up");
    }

    public void enterFirstName(String firstName) {
        WebElement firstNameElement = wait.until(ExpectedConditions.elementToBeClickable(firstNameField));
        firstNameElement.clear();
        firstNameElement.sendKeys(firstName);
    }

    public void enterLastName(String lastName) {
        WebElement lastNameElement = wait.until(ExpectedConditions.elementToBeClickable(lastNameField));
        lastNameElement.clear();
        lastNameElement.sendKeys(lastName);
    }

    public void enterEmail(String email) {
        WebElement emailElement = wait.until(ExpectedConditions.elementToBeClickable(emailField));
        emailElement.clear();
        emailElement.sendKeys(email);
    }

    public void enterPassword(String password) {
        WebElement passwordElement = wait.until(ExpectedConditions.elementToBeClickable(passwordField));
        passwordElement.clear();
        passwordElement.sendKeys(password);
    }

    public void enterPasswordConfirmation(String passwordConfirmation) {
        WebElement passwordConfirmationElement = wait.until(ExpectedConditions.elementToBeClickable(passwordConfirmationField));
        passwordConfirmationElement.clear();
        passwordConfirmationElement.sendKeys(passwordConfirmation);
    }

    public void clickSubmit() {
        WebElement button = wait.until(ExpectedConditions.elementToBeClickable(submitButton));
        button.click();
    }

    public String getErrorMessage() {
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        return errorElement.getText();
    }

    public String getFirstNameFieldValidationMessage() {
        WebElement firstNameElement = wait.until(ExpectedConditions.presenceOfElementLocated(firstNameField));
        firstNameElement.clear();
        return firstNameElement.getAttribute("validationMessage");
    }

    public String getEmailFieldValidationMessage() {
        WebElement emailElement = wait.until(ExpectedConditions.presenceOfElementLocated(emailField));
        emailElement.clear();
        return emailElement.getAttribute("validationMessage");
    }

    public String getEmailFieldValidationMessage2() {
        WebElement emailElement = wait.until(ExpectedConditions.presenceOfElementLocated(emailField));
        return emailElement.getAttribute("validationMessage");
    }

    public String getPasswordFieldValidationMessage() {
        WebElement passwordElement = wait.until(ExpectedConditions.presenceOfElementLocated(passwordField));
        passwordElement.clear();
        return passwordElement.getAttribute("validationMessage");
    }

    public String getPasswordConfirmationFieldValidationMessage() {
        WebElement passwordConfirmationElement = wait.until(ExpectedConditions.presenceOfElementLocated(passwordConfirmationField));
        passwordConfirmationElement.clear();
        return passwordConfirmationElement.getAttribute("validationMessage");
    }
}