import java.util.ArrayList;
import java.lang.StringBuilder;

public class Order {
    protected final ArrayList<Item> items;

    public Order() {
        this.items = new ArrayList<>();
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

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();

        builder.append("Order ($");
        builder.append(String.format("%.2f", this.getTotalPrice()));
        builder.append(")\n");
        for (Item item : this.items) {
            builder.append(item.toString().indent(2));
        }

        return builder.toString();
    }
}
