import java.util.ArrayList;
import java.util.LinkedList;

public class BundleItem extends Item {
    protected ArrayList<Item> items;

    // Modifier to apply to total bundle price
    // 0.2 means 20% discount
    // e.g: 100.- before discount becomes 80.- if discount is 0.2 (20%)
    protected double discount;

    BundleItem(String description, double discount) {
        super(description);
        this.items = new ArrayList<Item>();

        this.setDiscount(discount);
    }

    protected ArrayList<Item> getItems() {
        return this.items;
    }

    protected boolean containsReferenceToSelf(BundleItem item) {
        LinkedList<Item> itemsToCheck = new LinkedList<Item>();
        itemsToCheck.add(item);

        // Breadth-First-Search
        while (itemsToCheck.size() > 0) {
            Item top = itemsToCheck.poll();
            if (top == this) {
                return true;
            }

            if (top instanceof BundleItem) {
                for (Item bundle_item : ((BundleItem)top).getItems()) {
                    itemsToCheck.add(bundle_item);
                }
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
    public String format() {
        StringBuilder builder = new StringBuilder();

        String formattedTotalPrice = String.format("%.2f", this.getPrice());
        String formattedDiscount = String.format("%.0f", this.getDiscount() * 100);

        builder.append("Bundle : " + this.getDescription() + " : $");
        builder.append(formattedTotalPrice);
        builder.append(" with " + formattedDiscount + "% discount\n");

        for (int i = 0; i < this.items.size(); i++) {
            Item item = this.items.get(i);
            builder.append(item.format().indent(2));
        }

        return builder.toString();
    }
}
