import React from "react";
import { Container, Typography, Link } from "@mui/material";

const Terms = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Terms and Conditions
      </Typography>

      <Typography variant="body1" paragraph>
        Welcome to [Your Business Name]! These Terms and Conditions outline the rules and regulations for using our website and services.
      </Typography>

      <Typography variant="h6">1. Acceptance of Terms</Typography>
      <Typography variant="body1" paragraph>
        By accessing or using our website, you agree to comply with these Terms and Conditions. If you do not agree, please do not use our services.
      </Typography>

      <Typography variant="h6">2. User Responsibilities</Typography>
      <Typography variant="body1" paragraph>
        Users must not:
        <ul>
          <li aria-hidden="false">Engage in illegal activities or violate any laws.</li>
          <li aria-hidden="false">Attempt to hack, disrupt, or abuse the platform.</li>
          <li aria-hidden="false">Use content from our website without permission.</li>
        </ul>
      </Typography>

      <Typography variant="h6">3. Payments & Refund Policy</Typography>
      <Typography variant="body1" paragraph>
        If you purchase a product or service, you agree to our payment terms. Refunds may be granted on a case-by-case basis. For refund inquiries, contact us at{" "}
        <Link aria-hidden="false" href="mailto:support@yourdomain.com">support@yourdomain.com</Link>.
      </Typography>

      <Typography variant="h6">4. Intellectual Property</Typography>
      <Typography variant="body1" paragraph>
        All content, trademarks, and intellectual property on this site belong to [Your Business Name] and cannot be used without permission.
      </Typography>

      <Typography variant="h6">5. Limitation of Liability</Typography>
      <Typography variant="body1" paragraph>
        We are not liable for any damages, losses, or issues caused by using our services, including technical issues or third-party service failures.
      </Typography>

      <Typography variant="h6">6. Termination of Access</Typography>
      <Typography variant="body1" paragraph>
        We reserve the right to terminate access to any user who violates these terms without prior notice.
      </Typography>

      <Typography variant="h6">7. Changes to Terms</Typography>
      <Typography variant="body1" paragraph>
        We may update these Terms and Conditions from time to time. Users will be notified of significant changes.
      </Typography>

      <Typography variant="h6">8. Governing Law</Typography>
      <Typography variant="body1" paragraph>
        These Terms are governed by the laws of [Your State/Country].
      </Typography>

      <Typography variant="h6">9. Contact Us</Typography>
      <Typography variant="body1">
        If you have any questions, please contact us at{" "}
        <Link aria-hidden="false" href="mailto:support@yourdomain.com">support@yourdomain.com</Link>.
      </Typography>
    </Container>
  );
};

export default Terms;
