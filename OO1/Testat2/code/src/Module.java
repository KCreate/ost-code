import java.util.HashSet;

public class Module {
    private String name;
    private boolean visited = false;
    private HashSet<Module> requiredModules = new HashSet<>();
    private HashSet<Module> isRequiredFor = new HashSet<>();

    public Module(String name) {
        this.name = name;
    }

    /*
    * Returns the name of this module
    * */
    public String getName() {
        return this.name;
    }

    /*
    * Returns the visited status of this module
    * */
    public boolean getVisited() {
        return this.visited;
    }

    /*
    * Mark this module as visited
    * */
    public void visitModule() {
        this.visited = true;
    }

    /*
    * Checks whether all module dependencies have been visited
    * */
    public boolean canBeVisited() {
        for (Module module : this.requiredModules) {
            if (module.getVisited() == false) {
                return false;
            }
        }

        return true;
    }

    /*
    * Make *module* a dependency of this module
    * */
    public void addDependency(Module module) throws Exception {
        if (module == this) {
            throw new Exception("Module cannot depend on itself");
        }
        this.requiredModules.add(module);
        module.isRequiredFor.add(this);
    }

    /*
    * Returns an array of modules which depend on this module
    * */
    public Module[] getDependentModules() {
        Module[] dependents = new Module[this.isRequiredFor.size()];
        dependents = this.isRequiredFor.toArray(dependents);
        return dependents;
    }

    /*
    * Format as string
    * */
    public String toString() {
        return this.name;
    }
}
