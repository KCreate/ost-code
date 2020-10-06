import java.util.ArrayList;
import java.lang.StringBuilder;

public class Order {
    ArrayList<Item> items;

    public Order() {
        this.items = new ArrayList<Item>();
    }

    public void addItem(Item item) {
        items.add(item);
    }

    public double getTotalPrice() {
        double sumPrice = 0;

        for (Item item : this.items) {
            sumPrice += item.getPrice();
        }

        return sumPrice;
    }

    public String format() {
        StringBuilder builder = new StringBuilder();

        builder.append("Order ($" + String.format("%.2f", this.getTotalPrice()) + ")\n");
        for (Item item : this.items) {
            builder.append(item.format().indent(2));
        }

        return builder.toString();
    }

    void printItems() {
        System.out.print(this.format());
    }
}
