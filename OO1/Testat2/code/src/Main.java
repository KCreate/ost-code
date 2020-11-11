import java.util.ArrayList;
import java.util.HashSet;

public class Main {
    public static void main(String[] args) throws Exception {
        var reader = new CatalogueReader("StudyCatalogue.txt");
        Timeplanner planner = new Timeplanner(reader);

        ArrayList<HashSet<Module>> semesters = planner.generateTimetable();

        for (int i = 0; i < semesters.size(); i++) {
            HashSet<Module> semester = semesters.get(i);

            System.out.print("Semester #" + (i + 1) + ": ");
            for (Module module : semester) {
                System.out.print(module);
                System.out.print(" ");
            }
            System.out.println("");
        }
    }
}
