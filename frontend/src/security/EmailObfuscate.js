import { useEffect, useState } from "react";

const EmailObfuscate = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailUser = "jtb.phoenixone";
    const emailDomain = "gmail.com";
    setEmail(`${emailUser}@${emailDomain}`);
  }, []);

  return (
    <a aria-hidden="false" href={`mailto:${email}`}>
      {email || "[Email Protected]"}
    </a>
  );
};

export default EmailObfuscate;
