package tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.WebDriverWait;
import pages.CardPage;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

public class CardTest {
  private WebDriver driver;
  private Map<String, Object> vars;
  private JavascriptExecutor js;
  private CardPage cardPage;
  private WebDriverWait wait;

  @Before
  public void setUp() {
    WebDriverManager.firefoxdriver().setup();
    driver = new FirefoxDriver();
    js = (JavascriptExecutor) driver;
    vars = new HashMap<>();
    cardPage = new CardPage(driver);
    wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    driver.manage().window().setSize(new Dimension(626, 562));
  }

  @After
  public void tearDown() {
    driver.quit();
  }

  @Test
  public void editCard() {
    cardPage.navigateToLogin();
    cardPage.login("john@phoenix-trello.com", "12345678");
    cardPage.navigateToBoard("Existing Board");
    cardPage.editCard("New List 1", "New Card 1", "Existing Card Edited", "This is description");
    assertTrue(cardPage.isCardPresent("New List 1", "Existing Card Edited"));
  }

  @Test
  public void addComment() {
    cardPage.navigateToLogin();
    cardPage.login("john@phoenix-trello.com", "12345678");
    cardPage.navigateToBoard("Existing Board");
    cardPage.addComment("New List 1", "New Card 1", "This is new comment");
    assertTrue(cardPage.isCardPresent("New List 1", "New Card 1"));
  }

  @Test
  public void addTag() {
    cardPage.navigateToLogin();
    cardPage.login("john@phoenix-trello.com", "12345678");
    cardPage.navigateToBoard("Existing Board");
    cardPage.addTag("New List 1", "New Card 1", "green");
    assertTrue(cardPage.isCardPresent("New List 1", "New Card 1"));
  }

  @Test
  public void deleteCard() {
    cardPage.navigateToLogin();
    cardPage.login("john@phoenix-trello.com", "12345678");
    cardPage.navigateToBoard("Existing Board");
    cardPage.deleteCard("New List 1", "New Card 1");
    assertFalse(cardPage.isCardPresent("New List 1", "New Card 1"));
  }
}