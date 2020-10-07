import java.util.ArrayList;
import java.util.LinkedList;

public class BundleItem extends Item {
    protected final ArrayList<Item> items;

    // Modifier to apply to total bundle price
    // 0.2 means 20% discount
    // e.g: 100.- before discount becomes 80.- if discount is 0.2 (20%)
    protected double discount;

    public BundleItem(String description, double discount) {
        super(description);
        this.items = new ArrayList<>();
        this.setDiscount(discount);
    }

    protected ArrayList<Item> getItems() {
        return this.items;
    }

    protected boolean containsReferenceToSelf(BundleItem item) {
        LinkedList<Item> itemsToCheck = new LinkedList<>();
        itemsToCheck.add(item);

        // Breadth-First-Search
        // I could've also solved this recursively, but I've decided not to as that
        // would bring the risk of causing a stack-overflow. My method only has the risk
        // of simply running out of memory for the itemsToCheck list.
        while (itemsToCheck.size() > 0) {
            Item top = itemsToCheck.poll();
            if (top == this) {
                return true;
            }

            if (top instanceof BundleItem) {
                itemsToCheck.addAll(((BundleItem)top).getItems());
            }
        }

        return false;
    }

    public void addItem(Item item) throws Exception {
        if (item instanceof BundleItem && this.containsReferenceToSelf((BundleItem)item)) {
            throw new Exception("Cycle detected!");
        }
        this.items.add(item);
    }

    public void removeItem(int index) {
        this.items.remove(index);
    }

    public double getDiscount() {
        return this.discount;
    }

    public void setDiscount(double discount) {
        if (discount < 0 || discount > 1) {
            throw new IllegalArgumentException("discount allowed range: [0.0, 1.0]");
        }
        this.discount = discount;
    }

    @Override
    public double getPrice() {
        double sumPrice = 0;
        for (Item item : this.items) {
            sumPrice += item.getPrice();
        }

        return sumPrice * (1.0 - this.discount);
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();

        String formattedTotalPrice = String.format("%.2f", this.getPrice());
        String formattedDiscount = String.format("%.0f", this.getDiscount() * 100);

        builder.append("Bundle : ");
        builder.append(this.getDescription());
        builder.append(" : $");
        builder.append(formattedTotalPrice);
        builder.append(" with ");
        builder.append(formattedDiscount);
        builder.append("% discount\n");

        for (Item item : this.items) {
            builder.append(item.toString().indent(2));
        }

        return builder.toString();
    }
}
