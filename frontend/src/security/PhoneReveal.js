

const PhoneReveal = () => {
  const phoneUser = "+1 (313)";
  const phoneDomain = "889-2915"; // Second half of number

  return (
    <a aria-hidden="false" href={`tel:${phoneUser}${phoneDomain}`}>
      {phoneUser} {phoneDomain}
    </a>
  );
};

export default PhoneReveal;
