public class ServiceItem extends Item {
    protected double price;

    public ServiceItem(String description, double price) {
        super(description);
        this.price = price;
    }

    @Override
    public double getPrice() {
        return this.price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    @Override
    public String format() {
        String formattedPrice = String.format("%.2f", this.price);
        return this.description + " : $" + formattedPrice;
    }
}
