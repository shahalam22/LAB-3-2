package tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pages.LoginPage;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.hamcrest.CoreMatchers.is;

public class LoginTest {
    private WebDriver driver;
    private Map<String, Object> vars;
    JavascriptExecutor js;
    private LoginPage loginPage;
    private WebDriverWait wait;

    @Before
    public void setUp() {
        WebDriverManager.firefoxdriver().setup();
        driver = new FirefoxDriver();
        js = (JavascriptExecutor) driver;
        vars = new HashMap<String, Object>();
        loginPage = new LoginPage(driver);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @After
    public void tearDown() {
        driver.quit();
    }

    @Test
    public void invalidPasswordTest() {
        loginPage.navigateTo();
        driver.manage().window().setSize(new Dimension(898, 606));

        loginPage.enterPassword("123456");
        loginPage.clickSubmit();

        assertThat(loginPage.getErrorMessage(), is("Invalid email or password"));
    }

    @Test
    public void invalidEmailTest() {
        loginPage.navigateTo();
        driver.manage().window().setSize(new Dimension(898, 606));

        loginPage.enterEmail("nonexistentuser@example.com");
        loginPage.enterPassword("password123");
        loginPage.clickSubmit();

        // Note: If TimeoutException occurs, verify .error selector in page source
        assertThat(loginPage.getErrorMessage(), is("Invalid email or password"));
    }

    @Test
    public void invalidEmailFormatTest() {
        loginPage.navigateTo();
        driver.manage().window().setSize(new Dimension(898, 606));

        loginPage.enterEmail("invalid@example.com"); // Malformed email
        loginPage.enterPassword("password123");
        loginPage.clickSubmit();

        // Note: If client-side validation prevents submission, check for validation message
        assertThat(loginPage.getErrorMessage(), is("Invalid email or password"));
    }

    @Test
    public void successfulLoginTest() {
        loginPage.navigateTo();
        driver.manage().window().setSize(new Dimension(898, 606));

        // Replace with actual valid credentials for your application
        loginPage.enterEmail("john@phoenix-trello.com");
        loginPage.enterPassword("12345678");

        loginPage.clickSubmit();

        // Verify successful login by checking for sign-out button
        // Note: Adjust selector if different indicator of success is used
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#crawler-sign-out > span")));
        assertTrue(driver.findElement(By.cssSelector("#crawler-sign-out > span")).isDisplayed());
    }

    @Test
    public void emptyEmailTest() {
        loginPage.navigateTo();
        driver.manage().window().setSize(new Dimension(898, 606));

        loginPage.enterPassword("password123");
        loginPage.clickSubmit();

        assertThat(loginPage.getEmailFieldValidationMessage(), is("Please fill out this field."));
    }

    @Test
    public void emptyPasswordTest() {
        loginPage.navigateTo();
        driver.manage().window().setSize(new Dimension(898, 606));

        loginPage.enterEmail("test@example.com");
        loginPage.clickSubmit();

        assertThat(loginPage.getPasswordFieldValidationMessage(), is("Please fill out this field."));
    }
}