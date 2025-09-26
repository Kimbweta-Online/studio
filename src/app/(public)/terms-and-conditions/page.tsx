
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Terms and Conditions</CardTitle>
      </CardHeader>
      <CardContent className="prose dark:prose-invert max-w-none">
        <p><em>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

        <p>
          Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the Mindset Theater application (the "Service") operated by us.
        </p>

        <p>
          Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
        </p>

        <h2>1. Accounts</h2>
        <p>
          When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>
        <p>
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
        </p>

        <h2>2. Disclaimer</h2>
        <p>
          Mindset Theater is not a substitute for professional medical advice, diagnosis, or treatment. The AI assistant is for informational and supportive purposes only and does not provide medical advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.
        </p>
        <p>
          We are not responsible for the advice or quality of care provided by therapists on this platform. We act solely as a facilitator to connect clients with therapists.
        </p>
        
        <h2>3. User Conduct</h2>
        <p>
          You agree not to use the Service to:
        </p>
        <ul>
          <li>Engage in any harassing, threatening, intimidating, predatory, or stalking conduct.</li>
          <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
          <li>Post any content that is illegal, fraudulent, defamatory, or otherwise objectionable.</li>
        </ul>

        <h2>4. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
        
        <h2>5. Changes</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us.
        </p>
      </CardContent>
    </Card>
  );
}
