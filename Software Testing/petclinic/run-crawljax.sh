#!/bin/bash

echo "=== Petclinic Crawljax State Flow Graph Generator ==="
echo "This script will use Crawljax to crawl the petclinic application"
echo "and generate a state flow graph showing the navigation structure."
echo ""

# Check if the application is running
echo "Checking if petclinic application is running on http://localhost:3000..."
if curl -s -f "http://localhost:3000" > /dev/null 2>&1; then
    echo "✓ Petclinic application is running"
else
    echo "✗ Petclinic application is not running on http://localhost:3000"
    echo ""
    echo "Please start the petclinic application first:"
    echo "1. Run: ./run-docker.sh"
    echo "2. Wait for the application to start"
    echo "3. Then run this script again"
    exit 1
fi

echo ""
echo "Starting Crawljax crawl..."
echo "This will take a few minutes to complete."
echo ""

# Use Maven to run with proper classpath including all dependencies
mvn exec:java -Dexec.mainClass="crawljax.BasicCrawljaxRunner" -Dexec.args="" -q

echo ""
echo "=== Crawljax crawl completed ==="
echo ""
echo "To generate a proper state flow graph, you can:"
echo "1. Use the existing poparsing tool: cd ../../../poparsing && ./run.sh petclinic manual"
echo "2. Or examine the Crawljax session data (requires custom plugin development)"
echo "3. The existing navigation graph is available at: ../../../graphs/petclinic.txt"
echo ""
echo "For visualization:"
echo "- Install GraphViz: sudo apt-get install graphviz"
echo "- Convert to image: dot -Tpng petclinic.dot -o petclinic.png"