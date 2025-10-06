
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Terms and Conditions</CardTitle>
         <p className="text-muted-foreground pt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </CardHeader>
      <CardContent className="prose dark:prose-invert max-w-none">

        <p>
          Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the Mindset Theater application (the "Service") operated by us. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
        </p>

        <h2>1. Account Security & Your Responsibilities</h2>
        <p>
          To help us make Mindset Theater a safe and secure space for you and everyone else, we kindly ask you to adhere to the following:
        </p>
        <ul>
            <li><strong>Accurate Information:</strong> When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</li>
            <li><strong>Keep Your Account Private:</strong> You are responsible for safeguarding the password that you use to access the Service. Do not share your account or login details with anyone.</li>
            <li><strong>Notify Us:</strong> You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
            <li><strong>Speak Up:</strong> If anything ever feels unsafe or violates our policies, please report it to us immediately.</li>
        </ul>


        <h2>2. User Conduct</h2>
        <p>
          You agree not to use the Service to:
        </p>
        <ul>
          <li>Engage in any harassing, threatening, intimidating, predatory, or stalking conduct.</li>
          <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
          <li>Post any content that is illegal, fraudulent, defamatory, or otherwise objectionable.</li>
        </ul>

        <h2>3. Disclaimer and Limitation of Liability</h2>
        <p>
          Mindset Theater is a platform that connects clients with mental health professionals and provides AI-driven supportive tools. It is not a substitute for professional medical advice, diagnosis, or treatment. The AI assistant is for informational and supportive purposes only and does not provide medical advice.
        </p>
        <p>
          Always seek the advice of your physician or another qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application. We are not responsible for the advice or quality of care provided by therapists on this platform; we act solely as a facilitator.
        </p>

        <h2>4. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
        
        <h2>5. Changes to Terms</h2>
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
