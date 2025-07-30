package crawljax;

import com.crawljax.browser.EmbeddedBrowser;
import com.crawljax.core.CrawljaxRunner;
import com.crawljax.core.configuration.BrowserConfiguration;
import com.crawljax.core.configuration.CrawljaxConfiguration;
import com.crawljax.core.configuration.CrawljaxConfiguration.CrawljaxConfigurationBuilder;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class BasicCrawljaxRunner {

    private static final String URL = "http://localhost:3000";
    private static final String OUTPUT_DIR = "crawljax-output";
    private static final int MAX_CRAWL_DEPTH = 2;
    private static final int MAX_RUNTIME = 3; // minutes

    public static void main(String[] args) throws IOException {
        System.out.println("Starting Crawljax crawl of Petclinic application...");
        System.out.println("URL: " + URL);
        System.out.println("Max depth: " + MAX_CRAWL_DEPTH);
        System.out.println("Max runtime: " + MAX_RUNTIME + " minutes");
        
        CrawljaxConfigurationBuilder builder = CrawljaxConfiguration.builderFor(URL);
        
        // Basic crawl rules - click on links and buttons
        builder.crawlRules().click("a");
        builder.crawlRules().click("button");
        
        // Set crawl constraints
        builder.setMaximumDepth(MAX_CRAWL_DEPTH);
        builder.setMaximumRunTime(MAX_RUNTIME, TimeUnit.MINUTES);
        
        // Browser settings
        builder.setBrowserConfig(new BrowserConfiguration(EmbeddedBrowser.BrowserType.CHROME));
        
        // Don't click on problematic elements
        builder.crawlRules().dontClick("a").withAttribute("href", "#");
        
        CrawljaxConfiguration config = builder.build();
        
        try {
            CrawljaxRunner crawljax = new CrawljaxRunner(config);
            crawljax.call();
            
            System.out.println("Crawljax crawl completed successfully!");
            System.out.println("The crawl results are stored in Crawljax's internal session object.");
            System.out.println("To extract the state flow graph, you would need to implement custom plugins");
            System.out.println("or use Crawljax's built-in reporting features.");
            
        } catch (Exception e) {
            System.err.println("Error during crawling: " + e.getMessage());
            e.printStackTrace();
        }
    }
}