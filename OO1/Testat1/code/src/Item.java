public abstract class Item {
    protected final String description;

    public Item(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }

    public abstract double getPrice();
}