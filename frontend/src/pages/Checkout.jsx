const Checkout = () => {
  return (
    <div>
      <h2 aria-hidden="false" >Checkout</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm productId={1} quantity={1} />
      </Elements>
    </div>
  );
};

export default Checkout;