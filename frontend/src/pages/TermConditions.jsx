import React from "react";
import { Container, Typography, Link } from "@mui/material";

const TermsConditions = () => {
  return (
    <Container id="main-content" maxWidth="md" sx={{ mt: 4, mb: 4 }} role="Terms and Conditions">
      <Typography aria-hidden="false" variant="h4" gutterBottom>
        Terms & Conditions
      </Typography>

      <Typography aria-hidden="false" variant="body1" paragraph>
        Welcome to [Your Business Name]! By using our website, you agree to the following terms and conditions. If you do not agree, please discontinue use.
      </Typography>

      <Typography aria-hidden="false" variant="h6">1. Payments & Transactions</Typography>
      <Typography aria-hidden="false" variant="body1" paragraph>
        We use <strong>Stripe</strong> for secure payment processing. All transactions are subject to <Link aria-hidden="false" href="https://stripe.com/legal" target="_blank">Stripe's Terms of Service</Link>.
      </Typography>

      <Typography aria-hidden="false" variant="h6">2. Data Collection & Privacy</Typography>
      <Typography aria-hidden="false" variant="body1" paragraph>
        We use <strong>Google Analytics</strong> to understand how visitors interact with our site. For more information, please review our <Link aria-hidden="false" href="/privacy-policy">Privacy Policy</Link>.
      </Typography>

      <Typography aria-hidden="false" variant="h6">3. User Responsibilities</Typography>
      <Typography aria-hidden="false" variant="body1" paragraph>
        Users agree not to misuse the website, interfere with services, or engage in fraudulent activities.
      </Typography>

      <Typography aria-hidden="false" variant="h6">4. Intellectual Property</Typography>
      <Typography aria-hidden="false" variant="body1" paragraph>
        All content, branding, and trademarks on this site belong to [Your Business Name] and cannot be used without permission.
      </Typography>

      <Typography aria-hidden="false" variant="h6">5. Limitation of Liability</Typography>
      <Typography aria-hidden="false" variant="body1" paragraph>
        We are not responsible for any issues arising from third-party services such as Stripe or Google Analytics.
      </Typography>

      <Typography aria-hidden="false" variant="h6">6. Changes to Terms</Typography>
      <Typography aria-hidden="false" variant="body1" paragraph>
        We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of changes.
      </Typography>

      <Typography aria-hidden="false" variant="h6">7. Contact Us</Typography>
      <Typography aria-hidden="false" variant="body1">
        For questions, contact us at <Link aria-hidden="false" href="mailto:support@terrnovare.tech">support@terrnovare.tech</Link>
      </Typography>
    </Container>
  );
};

export default TermsConditions;
