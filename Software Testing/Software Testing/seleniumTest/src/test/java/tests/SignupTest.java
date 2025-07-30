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
import pages.SignupPage;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.hamcrest.CoreMatchers.is;

public class SignupTest {
    private WebDriver driver;
    private Map<String, Object> vars;
    private JavascriptExecutor js;
    private SignupPage signupPage;
    private WebDriverWait wait;

    @Before
    public void setUp() {
        WebDriverManager.firefoxdriver().setup();
        driver = new FirefoxDriver();
        js = (JavascriptExecutor) driver;
        vars = new HashMap<>();
        signupPage = new SignupPage(driver);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @After
    public void tearDown() {
        driver.quit();
    }

    @Test
    public void successfulSignupTest() {
        signupPage.navigateTo();
        driver.manage().window().setSize(new Dimension(964, 580));

        signupPage.enterFirstName("Shah");
        signupPage.enterLastName("Alam");
        signupPage.enterEmail("shahalam3@gmail.com");   // prottek run e mail change kora lagbe
        signupPage.enterPassword("shahalam123");
        signupPage.enterPasswordConfirmation("shahalam123");
        signupPage.clickSubmit();

        // Verify successful signup by checking for sign-out button or dashboard
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#crawler-sign-out > span")));
        assertTrue(driver.findElement(By.cssSelector("#crawler-sign-out > span")).isDisplayed());
    }

    @Test
    public void mismatchedPasswordTest() {
        signupPage.navigateTo();
        driver.manage().window().setSize(new Dimension(964, 580));

        signupPage.enterFirstName("Shah");
        signupPage.enterLastName("Alam");
        signupPage.enterEmail("shahalam4@gmail.com");
        signupPage.enterPassword("shahalam123");
        signupPage.enterPasswordConfirmation("different123");
        signupPage.clickSubmit();

        assertThat(signupPage.getErrorMessage(), is("Password does not match"));
    }

    @Test
    public void emptyFirstNameTest() {
        signupPage.navigateTo();
        driver.manage().window().setSize(new Dimension(964, 580));

        signupPage.enterLastName("Alam");
        signupPage.enterEmail("shahalam@gmail.com");
        signupPage.enterPassword("shahalam123");
        signupPage.enterPasswordConfirmation("shahalam123");
        signupPage.clickSubmit();

        assertThat(signupPage.getFirstNameFieldValidationMessage(), is("Please fill out this field."));
    }

    @Test
    public void emptyEmailTest() {
        signupPage.navigateTo();
        driver.manage().window().setSize(new Dimension(964, 580));

        signupPage.enterFirstName("Shah");
        signupPage.enterLastName("Alam");
        signupPage.enterPassword("shahalam123");
        signupPage.enterPasswordConfirmation("shahalam123");
        signupPage.clickSubmit();

        assertThat(signupPage.getEmailFieldValidationMessage(), is("Please fill out this field."));
    }

    @Test
    public void emptyPasswordTest() {
        signupPage.navigateTo();
        driver.manage().window().setSize(new Dimension(964, 580));

        signupPage.enterFirstName("Shah");
        signupPage.enterLastName("Alam");
        signupPage.enterEmail("shahalam@gmail.com");
        signupPage.enterPasswordConfirmation("shahalam123");
        signupPage.clickSubmit();

        assertThat(signupPage.getPasswordFieldValidationMessage(), is("Please fill out this field."));
    }

    @Test
    public void emptyPasswordConfirmationTest() {
        signupPage.navigateTo();
        driver.manage().window().setSize(new Dimension(964, 580));

        signupPage.enterFirstName("Shah");
        signupPage.enterLastName("Alam");
        signupPage.enterEmail("shahalam@gmail.com");
        signupPage.enterPassword("shahalam123");
        signupPage.clickSubmit();

        assertThat(signupPage.getPasswordConfirmationFieldValidationMessage(), is("Please fill out this field."));
    }

    @Test
    public void invalidEmailFormatTest() {
        signupPage.navigateTo();
        driver.manage().window().setSize(new Dimension(964, 580));

        signupPage.enterFirstName("Shah");
        signupPage.enterLastName("Alam");
        signupPage.enterEmail("shahalam");
        signupPage.enterPassword("shahalam123");
        signupPage.enterPasswordConfirmation("shahalam123");
        signupPage.clickSubmit();

        assertThat(signupPage.getEmailFieldValidationMessage2(), is("Please enter an email address."));
    }
}