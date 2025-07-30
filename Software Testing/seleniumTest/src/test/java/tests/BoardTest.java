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
import pages.BoardPage;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import static org.junit.Assert.assertTrue;

public class BoardTest {
  private WebDriver driver;
  private Map<String, Object> vars;
  private JavascriptExecutor js;
  private BoardPage boardPage;
  private WebDriverWait wait;

  @Before
  public void setUp() {
    WebDriverManager.firefoxdriver().setup();
    driver = new FirefoxDriver();
    js = (JavascriptExecutor) driver;
    vars = new HashMap<>();
    boardPage = new BoardPage(driver);
    wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    driver.manage().window().setSize(new Dimension(664, 533));
  }

  @After
  public void tearDown() {
    driver.quit();
  }

//  @Test
//  public void createBoard() {
//    boardPage.navigateToLogin();
//    boardPage.login("john@phoenix-trello.com", "12345678");
//    boardPage.createBoard("New Board");
//    boardPage.navigateToAllBoards();
//    assertTrue(boardPage.isBoardPresent("New Board"));
//  }
//
//  @Test
//  public void createList() {
//    boardPage.navigateToLogin();
//    boardPage.login("john@phoenix-trello.com", "12345678");
//    boardPage.createBoard("New Board");
//    boardPage.navigateToBoard("New Board");
//    boardPage.createList("New List 1");
//    assertTrue(boardPage.isListPresent("New List 1"));
//  }
//
//  @Test
//  public void createCard() {
//    boardPage.navigateToLogin();
//    boardPage.login("john@phoenix-trello.com", "12345678");
//    boardPage.createBoard("New Board");
//    boardPage.navigateToBoard("New Board");
//    boardPage.createList("New List 1");
//    boardPage.createCard("New Card 1");
//    assertTrue(boardPage.isCardPresent("New List 1", "New Card 1"));
//  }


  @Test
  public void createBoard() {
    boardPage.navigateToLogin();
    boardPage.login("john@phoenix-trello.com", "12345678");
    boardPage.createBoard("Existing Board");
    boardPage.navigateToAllBoards();
    assertTrue(boardPage.isBoardPresent("Existing Board"));
  }

  @Test
  public void createList() {
    boardPage.navigateToLogin();
    boardPage.login("john@phoenix-trello.com", "12345678");
    boardPage.navigateToBoard("Existing Board");
    boardPage.createList("New List 1");
    assertTrue(boardPage.isListPresent("New List 1"));
  }

  @Test
  public void createCard() {
    boardPage.navigateToLogin();
    boardPage.login("john@phoenix-trello.com", "12345678");
    boardPage.navigateToBoard("Existing Board");
    boardPage.createList("New List 1");
    boardPage.createCard("New Card 1");
    assertTrue(boardPage.isCardPresent("New List 1", "New Card 1"));
  }
}