//package pages;
//
//import org.openqa.selenium.By;
//import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.WebElement;
//import org.openqa.selenium.interactions.Actions;
//import org.openqa.selenium.support.ui.ExpectedConditions;
//import org.openqa.selenium.support.ui.WebDriverWait;
//import java.time.Duration;
//import java.util.List;
//
//public class CardPage {
//    private final WebDriver driver;
//    private final WebDriverWait wait;
//
//    // Locators
//    private final By emailField = By.id("user_email");
//    private final By passwordField = By.id("user_password");
//    private final By submitButton = By.cssSelector("button");
//    private final By addNewBoardButton = By.id("add_new_board");
//    private final By boardNameField = By.id("board_name");
//    private final By addListButton = By.xpath("//div[@class=\"list add-new\"]");
//    private final By listNameField = By.id("list_name");
//    private final By saveListButton = By.xpath("//form[@id=\"new_list_form\"]/button[text()=\"Save list\"]");
//    private final By addNewCardLink = By.linkText("Add a new card...");
//    private final By cardNameField = By.id("card_name");
//    private final By addCardButton = By.xpath("//form[@id=\"new_card_form\"]/button[text()=\"Add\"]");
//    private final By editCardLink = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"info\"]//a[text()=\"Edit\"]");
//    private final By cardTitleField = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"info\"]/header/form/input[@placeholder=\"Title\"]");
//    private final By cardDescriptionField = By.cssSelector("textarea");
//    private final By saveCardButton = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"info\"]/header/form/button[text()=\"Save card\"]");
//    private final By commentField = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"info\"]/div[@class=\"form-wrapper\"]/form//textarea[@placeholder=\"Write a comment...\"]");
//    private final By saveCommentButton = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"info\"]/div[@class=\"form-wrapper\"]/form//button[text()=\"Save comment\"]");
//    private final By tagsButton = By.xpath("(//div[@class=\"md-modal\"]//div[@class=\"options\"]/a[@class=\"button\"])[2]");
//    private final By greenTag = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"options\"]/div[@class=\"tags-selector\"]/ul/li/a[contains(@class, \"green\")]");
//    private final By closeTagSelector = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"options\"]/div[@class=\"tags-selector\"]/header/a[@class=\"close\"]");
//    private final By closeModalButton = By.xpath("//div[@class=\"md-modal\"]//a[@class=\"close\"]");
//    private final By deleteCardButton = By.xpath("//div[@class=\"md-modal\"]//a[@class=\"delete\"]");
//
//    public CardPage(WebDriver driver) {
//        this.driver = driver;
//        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
//    }
//
//    public void navigateToLogin() {
//        driver.get("http://localhost:4000/sign_in");
//    }
//
//    public void login(String email, String password) {
//        WebElement emailElement = wait.until(ExpectedConditions.elementToBeClickable(emailField));
//        emailElement.clear();
//        emailElement.sendKeys(email);
//        WebElement passwordElement = wait.until(ExpectedConditions.elementToBeClickable(passwordField));
//        passwordElement.clear();
//        passwordElement.sendKeys(password);
//        WebElement button = wait.until(ExpectedConditions.elementToBeClickable(submitButton));
//        button.click();
//    }
//
//    public void createBoard(String boardName) {
//        WebElement addBoardButton = wait.until(ExpectedConditions.elementToBeClickable(addNewBoardButton));
//        addBoardButton.click();
//        WebElement boardNameElement = wait.until(ExpectedConditions.elementToBeClickable(boardNameField));
//        boardNameElement.sendKeys(boardName);
//        WebElement submitButtonElement = wait.until(ExpectedConditions.elementToBeClickable(submitButton));
//        submitButtonElement.click();
//        // Wait for the board page to load
//        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@class=\"lists-wrapper\"]")));
//    }
//
//    public void createList(String listName) {
//        WebElement addListElement = wait.until(ExpectedConditions.elementToBeClickable(addListButton));
//        addListElement.click();
//        WebElement listNameElement = wait.until(ExpectedConditions.visibilityOfElementLocated(listNameField));
//        listNameElement.clear();
//        listNameElement.sendKeys(listName);
//        WebElement saveListButtonElement = wait.until(ExpectedConditions.elementToBeClickable(saveListButton));
//        saveListButtonElement.click();
//        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]")));
//    }
//
//    public void createCard(String cardName) {
//        WebElement addCardLinkElement = wait.until(ExpectedConditions.elementToBeClickable(addNewCardLink));
//        addCardLinkElement.click();
//        WebElement cardNameElement = wait.until(ExpectedConditions.elementToBeClickable(cardNameField));
//        cardNameElement.sendKeys(cardName);
//        WebElement addCardButtonElement = wait.until(ExpectedConditions.elementToBeClickable(addCardButton));
//        addCardButtonElement.click();
//        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"New List 1\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]")));
//    }
//
//    public boolean isCardPresent(String listName, String cardName) {
//        List<WebElement> elements = driver.findElements(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]"));
//        return elements.size() > 0;
//    }
//
//    public void editCard(String listName, String cardName, String newTitle, String description) {
//        WebElement cardElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]")));
//        cardElement.click();
//        WebElement editLink = wait.until(ExpectedConditions.elementToBeClickable(editCardLink));
//        editLink.click();
//        WebElement titleElement = wait.until(ExpectedConditions.elementToBeClickable(cardTitleField));
//        titleElement.clear();
//        titleElement.sendKeys(newTitle);
//        WebElement descriptionElement = wait.until(ExpectedConditions.elementToBeClickable(cardDescriptionField));
//        descriptionElement.clear();
//        descriptionElement.sendKeys(description);
//        WebElement saveButton = wait.until(ExpectedConditions.elementToBeClickable(saveCardButton));
//        saveButton.click();
//    }
//
//    public void addComment(String listName, String cardName, String comment) {
//        WebElement cardElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]")));
//        cardElement.click();
//        WebElement commentElement = wait.until(ExpectedConditions.elementToBeClickable(commentField));
//        commentElement.sendKeys(comment);
//        WebElement saveCommentButtonElement = wait.until(ExpectedConditions.elementToBeClickable(saveCommentButton));
//        saveCommentButtonElement.click();
//    }
//
//    public void addTag(String listName, String cardName, String tagColor) {
//        WebElement cardElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]")));
//        cardElement.click();
//        WebElement tagsButtonElement = wait.until(ExpectedConditions.elementToBeClickable(tagsButton));
//        tagsButtonElement.click();
//        WebElement tagElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class=\"md-modal\"]//div[@class=\"options\"]/div[@class=\"tags-selector\"]/ul/li/a[contains(@class, \"" + tagColor + "\")]")));
//        tagElement.click();
//        WebElement closeTagSelectorElement = wait.until(ExpectedConditions.elementToBeClickable(closeTagSelector));
//        closeTagSelectorElement.click();
//        WebElement closeModalElement = wait.until(ExpectedConditions.elementToBeClickable(closeModalButton));
//        closeModalElement.click();
//    }
//
//    public void deleteCard(String listName, String cardName) {
//        WebElement cardElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]")));
//        cardElement.click();
//        WebElement deleteButton = wait.until(ExpectedConditions.elementToBeClickable(deleteCardButton));
//        deleteButton.click();
//    }
//}









package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.List;

public class CardPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    // Locators
    private final By emailField = By.id("user_email");
    private final By passwordField = By.id("user_password");
    private final By submitButton = By.cssSelector("button");
    private final By addNewBoardButton = By.id("add_new_board");
    private final By boardNameField = By.id("board_name");
    private final By boardsNav = By.cssSelector("#boards_nav span");
    private final By viewAllBoardsLink = By.linkText("View all boards");
    private final By addListButton = By.xpath("//div[@class=\"list add-new\"]");
    private final By listNameField = By.id("list_name");
    private final By saveListButton = By.xpath("//form[@id=\"new_list_form\"]/button[text()=\"Save list\"]");
    private final By addNewCardLink = By.linkText("Add a new card...");
    private final By cardNameField = By.id("card_name");
    private final By addCardButton = By.xpath("//form[@id=\"new_card_form\"]/button[text()=\"Add\"]");
    private final By editCardLink = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"info\"]//a[text()=\"Edit\"]");
    private final By cardTitleField = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"info\"]/header/form/input[@placeholder=\"Title\"]");
    private final By cardDescriptionField = By.cssSelector("textarea");
    private final By saveCardButton = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"info\"]/header/form/button[text()=\"Save card\"]");
    private final By commentField = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"info\"]/div[@class=\"form-wrapper\"]/form//textarea[@placeholder=\"Write a comment...\"]");
    private final By saveCommentButton = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"info\"]/div[@class=\"form-wrapper\"]/form//button[text()=\"Save comment\"]");
    private final By tagsButton = By.xpath("(//div[@class=\"md-modal\"]//div[@class=\"options\"]/a[@class=\"button\"])[2]");
    private final By greenTag = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"options\"]/div[@class=\"tags-selector\"]/ul/li/a[contains(@class, \"green\")]");
    private final By closeTagSelector = By.xpath("//div[@class=\"md-modal\"]//div[@class=\"options\"]/div[@class=\"tags-selector\"]/header/a[@class=\"close\"]");
    private final By closeModalButton = By.xpath("//div[@class=\"md-modal\"]//a[@class=\"close\"]");
    private final By deleteCardButton = By.xpath("//div[@class=\"md-modal\"]//a[@class=\"delete\"]");

    public CardPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void navigateToLogin() {
        driver.get("http://localhost:4000/sign_in");
    }

    public void login(String email, String password) {
        WebElement emailElement = wait.until(ExpectedConditions.elementToBeClickable(emailField));
        emailElement.clear();
        emailElement.sendKeys(email);
        WebElement passwordElement = wait.until(ExpectedConditions.elementToBeClickable(passwordField));
        passwordElement.clear();
        passwordElement.sendKeys(password);
        WebElement button = wait.until(ExpectedConditions.elementToBeClickable(submitButton));
        button.click();
    }

    public void navigateToBoard(String boardName) {
        WebElement boardsNavElement = wait.until(ExpectedConditions.elementToBeClickable(boardsNav));
        boardsNavElement.click();
        WebElement viewAllBoardsElement = wait.until(ExpectedConditions.elementToBeClickable(viewAllBoardsLink));
        viewAllBoardsElement.click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@class=\"boards-wrapper\"]")));
        try {
            WebElement boardElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class=\"boards-wrapper\"]/div[@id]//h4[text()=\"" + boardName + "\"]")));
            boardElement.click();
            wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@class=\"lists-wrapper\"]")));
        } catch (org.openqa.selenium.TimeoutException e) {
            System.out.println("Failed to find board '" + boardName + "'. Page source: " + driver.getPageSource());
            throw e;
        }
    }

    public boolean isBoardPresent(String boardName) {
        WebElement boardsNavElement = wait.until(ExpectedConditions.elementToBeClickable(boardsNav));
        boardsNavElement.click();
        WebElement viewAllBoardsElement = wait.until(ExpectedConditions.elementToBeClickable(viewAllBoardsLink));
        viewAllBoardsElement.click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@class=\"boards-wrapper\"]")));
        List<WebElement> elements = driver.findElements(By.xpath("//div[@class=\"boards-wrapper\"]/div[@id]//h4[text()=\"" + boardName + "\"]"));
        return elements.size() > 0;
    }

    public boolean isListPresent(String listName) {
        List<WebElement> elements = driver.findElements(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]"));
        return elements.size() > 0;
    }

    public void createBoard(String boardName) {
        WebElement addBoardButton = wait.until(ExpectedConditions.elementToBeClickable(addNewBoardButton));
        addBoardButton.click();
        WebElement boardNameElement = wait.until(ExpectedConditions.elementToBeClickable(boardNameField));
        boardNameElement.sendKeys(boardName);
        WebElement submitButtonElement = wait.until(ExpectedConditions.elementToBeClickable(submitButton));
        submitButtonElement.click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@class=\"lists-wrapper\"]")));
    }

    public void createList(String listName) {
        WebElement addListElement = wait.until(ExpectedConditions.elementToBeClickable(addListButton));
        addListElement.click();
        WebElement listNameElement = wait.until(ExpectedConditions.visibilityOfElementLocated(listNameField));
        listNameElement.clear();
        listNameElement.sendKeys(listName);
        WebElement saveListButtonElement = wait.until(ExpectedConditions.elementToBeClickable(saveListButton));
        saveListButtonElement.click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]")));
    }

    public void createCard(String cardName) {
        WebElement addCardLinkElement = wait.until(ExpectedConditions.elementToBeClickable(addNewCardLink));
        addCardLinkElement.click();
        WebElement cardNameElement = wait.until(ExpectedConditions.elementToBeClickable(cardNameField));
        cardNameElement.sendKeys(cardName);
        WebElement addCardButtonElement = wait.until(ExpectedConditions.elementToBeClickable(addCardButton));
        addCardButtonElement.click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"New List 1\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]")));
    }

    public boolean isCardPresent(String listName, String cardName) {
        List<WebElement> elements = driver.findElements(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]"));
        return elements.size() > 0;
    }

    public void editCard(String listName, String cardName, String newTitle, String description) {
        WebElement cardElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]")));
        cardElement.click();
        WebElement editLink = wait.until(ExpectedConditions.elementToBeClickable(editCardLink));
        editLink.click();
        WebElement titleElement = wait.until(ExpectedConditions.elementToBeClickable(cardTitleField));
        titleElement.clear();
        titleElement.sendKeys(newTitle);
        WebElement descriptionElement = wait.until(ExpectedConditions.elementToBeClickable(cardDescriptionField));
        descriptionElement.clear();
        descriptionElement.sendKeys(description);
        WebElement saveButton = wait.until(ExpectedConditions.elementToBeClickable(saveCardButton));
        saveButton.click();
    }

    public void addComment(String listName, String cardName, String comment) {
        WebElement cardElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]")));
        cardElement.click();
        WebElement commentElement = wait.until(ExpectedConditions.elementToBeClickable(commentField));
        commentElement.sendKeys(comment);
        WebElement saveCommentButtonElement = wait.until(ExpectedConditions.elementToBeClickable(saveCommentButton));
        saveCommentButtonElement.click();
    }

    public void addTag(String listName, String cardName, String tagColor) {
        WebElement cardElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]")));
        cardElement.click();
        WebElement tagsButtonElement = wait.until(ExpectedConditions.elementToBeClickable(tagsButton));
        tagsButtonElement.click();
        WebElement tagElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class=\"md-modal\"]//div[@class=\"options\"]/div[@class=\"tags-selector\"]/ul/li/a[contains(@class, \"" + tagColor + "\")]")));
        tagElement.click();
        WebElement closeTagSelectorElement = wait.until(ExpectedConditions.elementToBeClickable(closeTagSelector));
        closeTagSelectorElement.click();
        WebElement closeModalElement = wait.until(ExpectedConditions.elementToBeClickable(closeModalButton));
        closeModalElement.click();
    }

    public void deleteCard(String listName, String cardName) {
        WebElement cardElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class=\"lists-wrapper\"]/div[@id]//h4[text()=\"" + listName + "\"]/ancestor::div[@id]//div[@class=\"cards-wrapper\"]/div[@id][contains(., \"" + cardName + "\")]")));
        cardElement.click();
        WebElement deleteButton = wait.until(ExpectedConditions.elementToBeClickable(deleteCardButton));
        deleteButton.click();
    }
}