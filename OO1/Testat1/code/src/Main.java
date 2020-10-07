public class Main {

    /*
        Expected output:

        Order ($571.35)
          Apple : $17.50 ($3.50 each)
          Orange : $4.20 ($2.10 each)
          Bundle : VegetableCombi : $24.40 with 20% discount
            Potato : $12.00 ($4.00 each)
            Onion : $18.00 ($1.50 each)
            Bundle : Cuttlery : $0.50 with 50% discount
              Fork : $0.20 ($0.20 each)
              Spoon : $0.30 ($0.30 each)
              Knife : $0.50 ($0.50 each)
          Motorcycle Course : $525.25
    */
    public static void main(String[] args) throws Exception {
        Order order = new Order();
        order.addItem(new ProductItem("Apple", 3.5, 5));
        order.addItem(new ProductItem("Orange", 2.1, 2));

        BundleItem bundle = new BundleItem("VegetableCombi", 0.2);
        order.addItem(bundle);
        bundle.addItem(new ProductItem("Potato", 4, 3));
        bundle.addItem(new ProductItem("Onion", 1.5, 12));

        BundleItem nested_bundle = new BundleItem("Cuttlery", 0.5);
        bundle.addItem(nested_bundle);
        nested_bundle.addItem(new ProductItem("Fork", 0.2, 1));
        nested_bundle.addItem(new ProductItem("Spoon", 0.3, 1));
        nested_bundle.addItem(new ProductItem("Knife", 0.5, 1));

        order.addItem(new ServiceItem("Motorcycle Course", 525.25));

        System.out.println(order);
    }
}
