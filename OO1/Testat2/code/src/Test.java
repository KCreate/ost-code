import java.util.ArrayList;
import java.util.HashSet;

public class Test {
    public static void main(String[] args) throws Exception {
        testModuleVisitable();
        testTimeplannerCatalogueReader();
        testTimeplannerString();
        testTimeplannerStringInvalidFormat();
        testTimeplannerDetectsImmediateCycles();
        testTimeplannerDetectsCycles();
        testTimeplannerLargeDataset();

        System.out.println("All tests passed!");
    }

    private static void _assert(boolean condition, String message) throws Exception {
        if (!condition) {
            throw new Exception("Failed assertion: " + message);
        }
    }

    private static boolean checkHashSetContainsModuleByName(HashSet<Module> hashset, String name) {
        for (Module module : hashset) {
            if (module.getName().equals(name)) {
                return true;
            }
        }

        return false;
    }

    private static void testModuleVisitable() throws Exception {
        Module a = new Module("A");
        Module b = new Module("B");
        Module c = new Module("C");
        Module d = new Module("D");

        a.addDependency(b);
        b.addDependency(c);
        c.addDependency(d);

        _assert(a.getName() == "A", "Expected module a name to be A");
        _assert(b.getName() == "B", "Expected module b name to be B");
        _assert(c.getName() == "C", "Expected module c name to be C");
        _assert(d.getName() == "D", "Expected module d name to be D");

        _assert(!a.getVisited(), "Expected module a to not be visited");
        _assert(!b.getVisited(), "Expected module b to not be visited");
        _assert(!c.getVisited(), "Expected module c to not be visited");
        _assert(!d.getVisited(), "Expected module d to not be visited");

        _assert(d.canBeVisited(), "Expected module d to be visitable");
        _assert(!a.canBeVisited(), "Expected module a to not be visitable");
        _assert(!c.canBeVisited(), "Expected module c to not be visitable");

        d.visitModule();

        _assert(d.canBeVisited(), "Expected module c to be visitable");
    }

    private static void testTimeplannerCatalogueReader() throws Exception {
        var reader = new CatalogueReader("StudyCatalogue.txt");
        Timeplanner planner = new Timeplanner(reader);

        ArrayList<HashSet<Module>> semesters = planner.generateTimetable();

        _assert(semesters.size() == 5, "Expected 5 semesters");
        _assert(semesters.get(0).size() == 2, "Expected semester 1 to have 2 modules");
        _assert(checkHashSetContainsModuleByName(semesters.get(0), "Math"), "Expected Math to be in semester 1");
        _assert(checkHashSetContainsModuleByName(semesters.get(0), "OO"), "Expected OO to be in semester 1");

        _assert(semesters.get(1).size() == 3, "Expected semester 2 to have 3 modules");
        _assert(checkHashSetContainsModuleByName(semesters.get(1), "DB1"), "Expected DB1 to be in semester 2");
        _assert(checkHashSetContainsModuleByName(semesters.get(1), "AD1"), "Expected AD1 to be in semester 2");
        _assert(checkHashSetContainsModuleByName(semesters.get(1), "CPI"), "Expected CPI to be in semester 2");

        _assert(semesters.get(2).size() == 3, "Expected semester 3 to have 3 modules");
        _assert(checkHashSetContainsModuleByName(semesters.get(2), "UI1"), "Expected UI1 to be in semester 3");
        _assert(checkHashSetContainsModuleByName(semesters.get(2), "SE1"), "Expected SE1 to be in semester 3");
        _assert(checkHashSetContainsModuleByName(semesters.get(2), "DB2"), "Expected DB2 to be in semester 3");

        _assert(semesters.get(3).size() == 2, "Expected semester 4 to have 2 modules");
        _assert(checkHashSetContainsModuleByName(semesters.get(3), "UI2"), "Expected UI2 to be in semester 4");
        _assert(checkHashSetContainsModuleByName(semesters.get(3), "SE2"), "Expected SE2 to be in semester 4");

        _assert(semesters.get(4).size() == 1, "Expected semester 5 to have 1 modules");
        _assert(checkHashSetContainsModuleByName(semesters.get(4), "Thesis"), "Expected Thesis to be in semester 5");
    }

    private static void testTimeplannerStringInvalidFormat() throws Exception {
        try {
            new Timeplanner("\n\n\n");
            throw new Exception("Invalid format not detected!");
        } catch(Exception e) {
            if (!e.getMessage().equals("Invalid input format, expected at least one name per line")) {
                throw new Exception("Invalid exception message");
            }
        }
    }

    private static void testTimeplannerString() throws Exception {
        Timeplanner planner = new Timeplanner(
                "DB1 OO\n" +
                "DB2 DB1\n" +
                "Math\n" +
                "OO\n" +
                "AD1 OO\n" +
                "CPI OO Math\n" +
                "Thesis DB2 SE2 UI2\n" +
                "SE1 AD1 CPI DB1\n" +
                "SE2 DB1 SE1 UI1\n" +
                "UI1 AD1\n" +
                "UI2 UI1"
        );

        ArrayList<HashSet<Module>> semesters = planner.generateTimetable();

        _assert(semesters.size() == 5, "Expected 5 semesters");
        _assert(semesters.get(0).size() == 2, "Expected semester 1 to have 2 modules");
        _assert(checkHashSetContainsModuleByName(semesters.get(0), "Math"), "Expected Math to be in semester 1");
        _assert(checkHashSetContainsModuleByName(semesters.get(0), "OO"), "Expected OO to be in semester 1");

        _assert(semesters.get(1).size() == 3, "Expected semester 2 to have 3 modules");
        _assert(checkHashSetContainsModuleByName(semesters.get(1), "DB1"), "Expected DB1 to be in semester 2");
        _assert(checkHashSetContainsModuleByName(semesters.get(1), "AD1"), "Expected AD1 to be in semester 2");
        _assert(checkHashSetContainsModuleByName(semesters.get(1), "CPI"), "Expected CPI to be in semester 2");

        _assert(semesters.get(2).size() == 3, "Expected semester 3 to have 3 modules");
        _assert(checkHashSetContainsModuleByName(semesters.get(2), "UI1"), "Expected UI1 to be in semester 3");
        _assert(checkHashSetContainsModuleByName(semesters.get(2), "SE1"), "Expected SE1 to be in semester 3");
        _assert(checkHashSetContainsModuleByName(semesters.get(2), "DB2"), "Expected DB2 to be in semester 3");

        _assert(semesters.get(3).size() == 2, "Expected semester 4 to have 2 modules");
        _assert(checkHashSetContainsModuleByName(semesters.get(3), "UI2"), "Expected UI2 to be in semester 4");
        _assert(checkHashSetContainsModuleByName(semesters.get(3), "SE2"), "Expected SE2 to be in semester 4");

        _assert(semesters.get(4).size() == 1, "Expected semester 5 to have 1 modules");
        _assert(checkHashSetContainsModuleByName(semesters.get(4), "Thesis"), "Expected Thesis to be in semester 5");
    }

    private static void testTimeplannerDetectsImmediateCycles() throws Exception {
        try {
            new Timeplanner("A A\n");
            throw new Exception("Immediate cycle not detected!");
        } catch(Exception e) {
            if (!e.getMessage().equals("Module cannot depend on itself")) {
                throw new Exception("Invalid exception message");
            }
        }
    }

    private static void testTimeplannerDetectsCycles() throws Exception {
        Timeplanner planner = new Timeplanner(
                "A B\n" +
                "B C\n" +
                "C A\n"
        );

        try {
            var semesters = planner.generateTimetable();
            throw new Exception("Cycle not detected!");
        } catch(Exception e) {
            String expectedMessage = (
                    "There are cycles in the module dependency graph!\n" +
                    "There are 3 unvisitable modules"
            );

            if (!e.getMessage().equals(expectedMessage)) {
                throw new Exception("Invalid exception message");
            }
        }
    }

    private static void testTimeplannerLargeDataset() throws Exception {
        var reader = new CatalogueReader("LargeCatalogue.txt");
        Timeplanner planner = new Timeplanner(reader);

        ArrayList<HashSet<Module>> semesters = planner.generateTimetable();
        _assert(semesters.size() == 444, "Expected 444 semesters"); // good luck graduating when you're over 200 years old!
    }
}
