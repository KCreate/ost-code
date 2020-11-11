import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Scanner;

public class Timeplanner {
    private HashMap<String, Module> modules = new HashMap<>();

    /*
    * Initialize this Timeplanner with a CatalogueReader object
    * Will load the dependency graph from the configured file
    * */
    public Timeplanner(CatalogueReader reader) throws Exception {
        String[] names;
        while ((names = reader.readNextLine()) != null) {
            Module module = this.registerModule(names[0]);

            // Register dependencies
            for (int i = 1; i < names.length; i++) {
                String name = names[i];
                Module dependencyModule = this.registerModule(name);
                module.addDependency(dependencyModule);
            }
        }
    }

    /*
    * Initialize this Timeplanner from an input string
    * The input string will be parsed with the same format
    * as the CatalogueReader would
    * */
    public Timeplanner(String input) throws Exception {
        Scanner scanner = new Scanner(input);
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            String[] names = line.split(" ");
            if (line.length() == 0 || names.length == 0) {
                throw new Exception("Invalid input format, expected at least one name per line");
            }

            Module module = this.registerModule(names[0]);

            // Register dependencies
            for (int i = 1; i < names.length; i++) {
                String name = names[i];
                Module dependencyModule = this.registerModule(name);
                module.addDependency(dependencyModule);
            }
        }
        scanner.close();
    }

    /*
    * Creates a module if it doesn't exist already,
    * else returns the pre-existing one.
    * */
    private Module registerModule(String name) {
        if (modules.containsKey(name)) {
            return modules.get(name);
        }

        Module module = new Module(name);
        modules.put(name, module);
        return module;
    }

    /*
    * Generate the timetable
    *
    * Throws an exception if there are cyclical dependencies
    * */
    public ArrayList<HashSet<Module>> generateTimetable() throws Exception {

        // Load the initial set of visitable modules
        HashSet<Module> currentlyVisitable = new HashSet<>();
        for (Module module : this.modules.values()) {
            if (module.canBeVisited()) {
                currentlyVisitable.add(module);
            }
        }

        // Result list
        ArrayList<HashSet<Module>> semesters = new ArrayList<>();

        // Add all the currently visitable modules to the current semester
        // We mark each dependent module as "touched" and in the end iterate
        // over that set to check which ones are now visitable. These modules
        // become the entry points for the next iteration.
        // We repeat these steps until there are no modules left to visit.
        HashSet<Module> touchedModules = new HashSet<>();
        while (currentlyVisitable.size() > 0) {
            HashSet<Module> currentSemester = new HashSet<>();
            touchedModules.clear();

            // Mark all currently visitable modules as visited
            for (Module module : currentlyVisitable) {
                module.visitModule();
                currentSemester.add(module);
                for (Module dependent : module.getDependentModules()) {
                    touchedModules.add(dependent);
                }
            }

            // Update currently visitable set
            currentlyVisitable.clear();
            for (Module module : touchedModules) {
                if (module.canBeVisited()) {
                    currentlyVisitable.add(module);
                }
            }

            semesters.add(currentSemester);
        }

        // If at this point there are unvisited modules, that means
        // that there is a cycle somewhere in the dependency graph.
        HashSet<Module> unvisitedModules = new HashSet<>();
        for (Module module : this.modules.values()) {
            if (!module.getVisited()) {
                unvisitedModules.add(module);
            }
        }

        if (unvisitedModules.size() > 0) {
            StringBuilder builder = new StringBuilder();
            builder.append("There are cycles in the module dependency graph!\n");
            builder.append("There are " + unvisitedModules.size() + " unvisitable modules");
            throw new Exception(builder.toString());
        }

        return semesters;
    }
}
