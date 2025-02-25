import React from "react";
import { Container, Typography, Link } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
    <Typography variant="h4" gutterBottom>
      Privacy Policy
    </Typography>

    <Typography variant="body1" paragraph>
      Your privacy is important to us. This policy explains how we collect and use your information.
    </Typography>

    <Typography variant="h6">1. What Data We Collect</Typography>
    <Typography variant="body1" paragraph>
      We use <strong>Google Analytics</strong> to track visitor behavior such as page views, time on site, and interactions. This data is anonymized and does not include personal details.
    </Typography>

    <Typography variant="h6">2. How We Use Your Data</Typography>
    <Typography variant="body1" paragraph>
      - To improve website functionality and user experience.
      - To analyze trends and optimize content.
      - To prevent fraud and ensure security.
    </Typography>

    <Typography variant="h6">3. Payments & Financial Data</Typography>
    <Typography variant="body1" paragraph>
      Payments are processed through <strong>Stripe</strong>, which securely handles payment information. We do not store credit card details. View <Link href="https://stripe.com/privacy" target="_blank">Stripe's Privacy Policy</Link>.
    </Typography>

    <Typography variant="h6">4. Cookies & Tracking</Typography>
    <Typography variant="body1" paragraph>
      Our website uses cookies for tracking purposes. You can disable cookies in your browser settings.
    </Typography>

    <Typography variant="h6">5. Third-Party Services</Typography>
    <Typography variant="body1" paragraph>
      We use the following third-party services:
      <ul>
        <li><strong>Google Analytics</strong> – Used for website tracking and improvements.</li>
        <li><strong>Stripe</strong> – Secure payment processing.</li>
      </ul>
      These services have their own privacy policies, which you can review.
    </Typography>

    <Typography variant="h6">6. Security</Typography>
    <Typography variant="body1" paragraph>
      We use security measures to protect data, but no method of transmission over the internet is 100% secure.
    </Typography>

    <Typography variant="h6">7. Your Rights & Opt-Out</Typography>
    <Typography variant="body1" paragraph>
      - You can disable Google Analytics tracking via browser settings.
      - You can request to delete your data by contacting us.
    </Typography>

    <Typography variant="h6">8. Contact Us</Typography>
    <Typography variant="body1">
      If you have any questions, contact us at <Link href="mailto:support@yourdomain.com">support@yourdomain.com</Link>.
    </Typography>
  </Container>
  );
};

export default PrivacyPolicy;
