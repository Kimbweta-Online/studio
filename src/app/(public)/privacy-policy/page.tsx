
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent className="prose dark:prose-invert max-w-none">
        <p><em>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>
        
        <h2>1. Introduction</h2>
        <p>
          Welcome to Mindset Theater. We are committed to protecting your privacy and handling your data in an open and transparent manner. This privacy policy sets out how we collect, use, and protect any information that you give us when you use this application.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          We may collect the following information:
        </p>
        <ul>
          <li><strong>Account Information:</strong> When you register, we collect your name, email address, and role (Client or Therapist).</li>
          <li><strong>Profile Information:</strong> You may voluntarily provide additional information such as a phone number, bio, specialty (for therapists), and an avatar.</li>
          <li><strong>Booking Information:</strong> We store data related to sessions you book or manage, including dates, times, and status.</li>
          <li><strong>Chat Messages:</strong> Messages sent between clients and therapists, as well as conversations with the AI assistant, are stored securely.</li>
          <li><strong>Usage Data:</strong> We may collect data on how you interact with our application to help us improve our services.</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, operate, and maintain our application.</li>
          <li>Improve, personalize, and expand our services.</li>
          <li>Understand and analyze how you use our application.</li>
          <li>Facilitate communication between clients and therapists.</li>
          <li>Process your transactions and manage your bookings.</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the webapp.</li>
          <li>For compliance purposes, including enforcing our Terms of Service, or other legal rights.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We are committed to ensuring that your information is secure. We use Firebase's built-in security features, including security rules for our database and authentication, to prevent unauthorized access or disclosure.
        </p>
        
        <h2>5. Your Data Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information at any time through your profile page or by contacting us directly.
        </p>

        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us.
        </p>
      </CardContent>
    </Card>
  );
}
