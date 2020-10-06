public class ProductItem extends Item {
    protected double pricePerUnit;
    protected int amount;

    public ProductItem(String description, double pricePerUnit, int amount) {
        super(description);
        this.pricePerUnit = pricePerUnit;
        this.amount = amount;
    }

    public void setPricePerUnit(double pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }

    public double getPricePerUnit() {
        return this.pricePerUnit;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public int getAmount() {
        return this.amount;
    }

    @Override
    double getPrice() {
        return this.amount * this.pricePerUnit;
    }

    @Override
    String format() {
        String formattedPricePerUnit = String.format("%.2f", this.pricePerUnit);
        String formattedTotalPrice = String.format("%.2f", this.getPrice());
        return (this.description + " : $" + formattedTotalPrice + " ($" + formattedPricePerUnit + " each)");
    }
}
