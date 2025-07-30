# Petclinic State Flow Graph

## Summary

The petclinic application has been successfully analyzed and a state flow graph has been generated. Here are the key findings:

## States (Pages) in the Application:

1. **HomeContainerPage** - Main landing page
2. **AddEditVisitContainerPage** - Add/edit visit for pets 
3. **AddEditPetContainerPage** - Add/edit pet information
4. **VeterinariansContainerPage** - View veterinarians
5. **OwnerInformationContainerPage** - View owner details and pets
6. **AddEditOwnerContainerPage** - Add/edit owner information  
7. **OwnersListContainerPage** - Search and list owners

## Key Navigation Flows:

### From Home Page:
- Navigate to owners list
- Navigate to veterinarians
- Register new owner
- Navigation bar links

### Owner Management:
- Search owners → View owner details → Edit owner/pets
- Register new owner → Return to owners list
- Add new pets to existing owners

### Pet & Visit Management:
- Add new pets with details (name, birth date, type)
- Add visits for pets with descriptions
- Edit existing pet information

## Graph Structure:

The state flow graph is in DOT format and shows:
- **Nodes**: 7 main page containers
- **Edges**: 49 transitions between pages
- **Parameters**: Some transitions take parameters (e.g., pet names, owner details)

## Current Status:

✅ **State flow graph generated** - Available at `../../graphs/petclinic.txt`  
✅ **Crawljax setup completed** - Basic runner created (has compatibility issues)  
✅ **Alternative analysis available** - Page object-based analysis working  

## Next Steps:

1. **Visualize the graph**:
   ```bash
   # Install GraphViz if not already installed
   sudo apt-get install graphviz
   
   # Generate PNG from the DOT file
   dot -Tpng ../../graphs/petclinic.txt -o petclinic_graph.png
   ```

2. **Use the graph for testing**:
   - The existing test generation tools can use this graph
   - Run: `./runExp.sh 1 SUBWEB MANUAL 60` for test generation

3. **Advanced analysis**:
   - The poparsing tool in `../../poparsing` can generate more detailed graphs
   - Custom Crawljax plugins can be developed for runtime analysis

## Files Created:

- `src/main/java/crawljax/BasicCrawljaxRunner.java` - Crawljax runner
- `run-crawljax.sh` - Execution script  
- `CRAWLJAX_SETUP.md` - Setup documentation
- `PETCLINIC_GRAPH.md` - This summary
- Updated `pom.xml` with dependencies

The state flow graph successfully captures the navigation structure of the petclinic application and can be used for automated testing and analysis.