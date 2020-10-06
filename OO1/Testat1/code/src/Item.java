public abstract class Item {
    protected String description;

    public Item(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }

    abstract double getPrice();
    abstract String format();

    public void print() {
        System.out.println(this.format());
    }
}