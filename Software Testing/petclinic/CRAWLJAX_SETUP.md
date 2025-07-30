# Petclinic State Flow Graph Generation with Crawljax

This document explains how to generate state flow graphs for the petclinic application using Crawljax and the existing tools.

## What was added:

1. **BasicCrawljaxRunner.java** - A simple Crawljax runner that crawls the petclinic application
2. **run-crawljax.sh** - Script to run the Crawljax crawler with proper classpath
3. **Jackson dependency** - Added to pom.xml for JSON processing

## How to generate the state flow graph:

### Option 1: Use the existing PO parsing tool (Recommended)

This is the most reliable way to generate a state flow graph based on the page objects:

```bash
# Navigate to the poparsing directory
cd ../../poparsing

# Generate the graph for petclinic with manual page objects
./run.sh petclinic manual

# The output will be saved as petclinic.txt in the poparsing directory
# and also copied to the graphs directory
```

### Option 2: Use Crawljax (Experimental)

First, make sure the petclinic application is running:

```bash
# Start the petclinic application
./run-docker.sh

# In another terminal, run the Crawljax crawler
./run-crawljax.sh
```

**Note**: The current Crawljax implementation is basic and mainly demonstrates the crawling functionality. The Crawljax 5.2.3 API has changed significantly, making it challenging to extract the state flow graph directly without extensive plugin development.

### Option 3: Use existing pre-generated graphs

The repository already contains pre-generated state flow graphs:

```bash
# View the existing graph
cat ../../graphs/petclinic.txt

# Or the apogen version
cat ../../graphs/petclinic-apogen.txt
```

## Visualizing the graph:

1. **Install GraphViz**:
   ```bash
   sudo apt-get install graphviz
   ```

2. **Convert the graph to DOT format and generate image**:
   ```bash
   # If you have a DOT file
   dot -Tpng graph_file.dot -o graph.png
   
   # Or create a simple DOT file from the text format
   # (requires manual conversion based on the text format)
   ```

## Understanding the output:

The state flow graph shows:
- **States**: Different pages/views in the petclinic application
- **Transitions**: Navigation paths between states (triggered by clicking links, buttons, etc.)
- **Actions**: The specific UI elements that cause state transitions

## Files modified:

- `pom.xml` - Added Jackson dependency
- `src/main/java/crawljax/BasicCrawljaxRunner.java` - Basic Crawljax runner
- `run-crawljax.sh` - Execution script
- `CRAWLJAX_SETUP.md` - This documentation

## Troubleshooting:

1. **Compilation errors**: Make sure to run `mvn compile` after any changes
2. **Application not running**: Ensure petclinic is accessible at http://localhost:3000
3. **ChromeDriver issues**: Make sure ChromeDriver is in your PATH
4. **Classpath issues**: The run-crawljax.sh script handles most dependencies, but you may need to adjust paths

## Further development:

To create a more sophisticated state flow graph extractor with Crawljax:

1. Implement proper plugin interfaces for Crawljax 5.2.3
2. Create custom state comparison logic
3. Add graph serialization to various formats (DOT, JSON, etc.)
4. Integrate with visualization libraries

The current implementation provides a foundation for this work.