public class Test {
    public static void main(String[] args) throws Exception {
        checkOrderPrice();
        checkOrderSummary();
        checkOrderPriceWithBundle();
        checkOrderSummaryWithBundle();
        checkOrderWithNestedBundle();
        checkCircularBundles();
    }

    public static boolean utilDoubleAlmostEqual(double lh, double rh, double delta) {
        return Math.abs(lh - rh) < delta;
    }

    public static void checkOrderPrice() throws Exception {
        Order order = new Order();
        order.addItem(new ProductItem("Apple", 3.5, 5));
        order.addItem(new ProductItem("Orange", 2.1, 2));
        order.addItem(new ServiceItem("Motorcycle Course", 525.25));

        if (!utilDoubleAlmostEqual(order.getTotalPrice(), 546.95, 0.01)) {
            throw new Exception("getTotalPrice returns wrong total sum");
        }
    }

    public static void checkOrderSummary() throws Exception {
        Order order = new Order();
        order.addItem(new ProductItem("Apple", 3.5, 5));
        order.addItem(new ProductItem("Orange", 2.1, 2));
        order.addItem(new ServiceItem("Motorcycle Course", 525.25));

        String expectedSummary = "";

        expectedSummary += "Order ($546.95)\n";
        expectedSummary += "  Apple : $17.50 ($3.50 each)\n";
        expectedSummary += "  Orange : $4.20 ($2.10 each)\n";
        expectedSummary += "  Motorcycle Course : $525.25\n";

        if (!order.format().equals(expectedSummary)) {
            System.out.println(order.format());
            System.out.println(expectedSummary);
            throw new Exception("format returns wrong result");
        }
    }

    public static void checkOrderPriceWithBundle() throws Exception {
        Order order = new Order();
        order.addItem(new ProductItem("Apple", 3.5, 5));
        order.addItem(new ProductItem("Orange", 2.1, 2));
        order.addItem(new ServiceItem("Motorcycle Course", 525.25));

        BundleItem bundle = new BundleItem("VegetableCombi", 0.2);
        bundle.addItem(new ProductItem("Potato", 4, 3));
        bundle.addItem(new ProductItem("Onion", 1.5, 12));

        order.addItem(bundle);

        if (!utilDoubleAlmostEqual(order.getTotalPrice(), 570.95, 0.01)) {
            throw new Exception("getTotalPrice with bundle returns wrong total sum");
        }
    }

    public static void checkOrderSummaryWithBundle() throws Exception {
        Order order = new Order();
        order.addItem(new ProductItem("Apple", 3.5, 5));
        order.addItem(new ProductItem("Orange", 2.1, 2));

        BundleItem bundle = new BundleItem("VegetableCombi", 0.2);
        bundle.addItem(new ProductItem("Potato", 4, 3));
        bundle.addItem(new ProductItem("Onion", 1.5, 12));
        order.addItem(bundle);

        order.addItem(new ServiceItem("Motorcycle Course", 525.25));

        String expectedSummary = "";
        expectedSummary += "Order ($570.95)\n";
        expectedSummary += "  Apple : $17.50 ($3.50 each)\n";
        expectedSummary += "  Orange : $4.20 ($2.10 each)\n";
        expectedSummary += "  Bundle : VegetableCombi : $24.00 with 20% discount\n";
        expectedSummary += "    Potato : $12.00 ($4.00 each)\n";
        expectedSummary += "    Onion : $18.00 ($1.50 each)\n";
        expectedSummary += "  Motorcycle Course : $525.25\n";

        if (!order.format().equals(expectedSummary)) {
            System.out.println(order.format());
            System.out.println(expectedSummary);
            throw new Exception("format with bundle returns wrong result");
        }
    }

    public static void checkOrderWithNestedBundle() throws Exception {
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

        String expectedSummary = "";
        expectedSummary += "Order ($571.35)\n";
        expectedSummary += "  Apple : $17.50 ($3.50 each)\n";
        expectedSummary += "  Orange : $4.20 ($2.10 each)\n";
        expectedSummary += "  Bundle : VegetableCombi : $24.40 with 20% discount\n";
        expectedSummary += "    Potato : $12.00 ($4.00 each)\n";
        expectedSummary += "    Onion : $18.00 ($1.50 each)\n";
        expectedSummary += "    Bundle : Cuttlery : $0.50 with 50% discount\n";
        expectedSummary += "      Fork : $0.20 ($0.20 each)\n";
        expectedSummary += "      Spoon : $0.30 ($0.30 each)\n";
        expectedSummary += "      Knife : $0.50 ($0.50 each)\n";
        expectedSummary += "  Motorcycle Course : $525.25\n";

        if (!order.format().equals(expectedSummary)) {
            System.out.println(order.format());
            System.out.println(expectedSummary);
            throw new Exception("format with nested bundle returns wrong result");
        }
    }

    public static void checkCircularBundles() throws Exception {

        /*
         * Bundle1 <-- Bundle2 <-- Bundle3
         *    |                       ^
         *    +---------(!!!)---------+
         **/
        BundleItem bundle1 = new BundleItem("Bundle 1", 0);
        BundleItem bundle2 = new BundleItem("Bundle 2", 0);
        BundleItem bundle3 = new BundleItem("Bundle 3", 0);
        bundle1.addItem(bundle2);
        bundle2.addItem(bundle3);

        Exception caught_exception = null;
        try {
            bundle3.addItem(bundle1);
        } catch(Exception exc) {
            caught_exception = exc;
        }

        if (caught_exception == null) {
            throw new Exception("Cycle 1 not detected!");
        } else if (caught_exception.getMessage() != "Cycle detected!") {
            throw new Exception("Invalid exception message");
        }

        caught_exception = null;

        try {
            bundle1.addItem(bundle1);
        } catch(Exception exc) {
            caught_exception = exc;
        }

        if (caught_exception == null) {
            throw new Exception("Cycle 12not detected!");
        } else if (caught_exception.getMessage() != "Cycle detected!") {
            throw new Exception("Invalid exception message");
        }
    }
}
