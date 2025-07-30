package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class LoginPage{
    private final WebDriver driver;
    private final WebDriverWait wait;

    // Locators
    private final By emailField = By.id("user_email");
    private final By passwordField = By.id("user_password");
    private final By submitButton = By.cssSelector("button");
    private final By errorMessage = By.cssSelector(".error");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void navigateTo() {
        driver.get("http://localhost:4000/sign_in");
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

    public void clickSubmit() {
        WebElement button = wait.until(ExpectedConditions.elementToBeClickable(submitButton));
        button.click();
    }

    public String getErrorMessage() {
        // Note: If TimeoutException occurs, verify the .error selector in the page source
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        return errorElement.getText();
    }

    public String getEmailFieldValidationMessage() {
        WebElement emailElement = wait.until(ExpectedConditions.presenceOfElementLocated(emailField));
        emailElement.clear();
        return emailElement.getAttribute("validationMessage");
    }

    public String getPasswordFieldValidationMessage() {
        WebElement passwordElement = wait.until(ExpectedConditions.presenceOfElementLocated(passwordField));
        passwordElement.clear();
        return passwordElement.getAttribute("validationMessage");
    }
}