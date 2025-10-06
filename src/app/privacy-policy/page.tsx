
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, EyeOff, FileLock2, Server, KeyRound } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Privacy Policy</CardTitle>
        <p className="text-muted-foreground pt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </CardHeader>
      <CardContent className="prose dark:prose-invert max-w-none">
        
        <h2>A Safe Space to Open Up, Heal, and Grow</h2>
        <p>
          Welcome to Mindset Theater. We are committed to protecting your privacy and handling your data in an open and transparent manner. This policy sets out how we collect, use, and protect any information that you give us when you use this application. Your conversations are private, and what you share with your therapist stays between the two of you.
        </p>

        <h2>How We Protect Your Privacy</h2>
        <p>We are committed to ensuring that your information is secure. We use Firebase's built-in security features and have implemented the following measures to protect your data:</p>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 not-prose my-6">
            <div className="flex items-start gap-4">
                <ShieldCheck className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h3 className="font-semibold">Ethical Standards</h3>
                    <p className="text-sm text-muted-foreground">Our therapists strictly follow professional ethics, including confidentiality.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <Lock className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h3 className="font-semibold">End-to-End Encrypted Sessions</h3>
                    <p className="text-sm text-muted-foreground">Only you and your therapist can access your chats, ensuring your conversations remain private.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <EyeOff className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h3 className="font-semibold">No Screenshots</h3>
                    <p className="text-sm text-muted-foreground">The chat interface includes features to discourage and prevent screenshots, adding a layer of privacy.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <FileLock2 className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h3 className="font-semibold">Minimal Data Collection</h3>
                    <p className="text-sm text-muted-foreground">We only collect data that is necessary to provide and improve your experience.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <KeyRound className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h3 className="font-semibold">Secure Login</h3>
                    <p className="text-sm text-muted-foreground">Your account is protected with strong authentication and security measures.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <Server className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h3 className="font-semibold">Secure Database Rules</h3>
                    <p className="text-sm text-muted-foreground">We use Firebase's security rules to prevent unauthorized access to your data at the database level.</p>
                </div>
            </div>
        </div>


        <h2>Information We Collect</h2>
        <p>
          We may collect the following information:
        </p>
        <ul>
          <li><strong>Account Information:</strong> When you register, we collect your name, email address, and role (Client or Therapist).</li>
          <li><strong>Profile Information:</strong> You may voluntarily provide additional information such as a phone number, bio, specialty (for therapists), and an avatar.</li>
          <li><strong>Booking Information:</strong> We store data related to sessions you book or manage, including dates, times, and status.</li>
          <li><strong>Chat Messages:</strong> Messages sent between clients and therapists, as well as conversations with the AI assistant, are stored securely. We will not share your information with anyone unless it is legally required to do so for your own well-being or the well-being of others.</li>
          <li><strong>Usage Data:</strong> We may collect data on how you interact with our application to help us improve our services.</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, operate, and maintain our application.</li>
          <li>Improve, personalize, and expand our services.</li>
          <li>Understand and analyze how you use our application.</li>
          <li>Facilitate communication between clients and therapists.</li>
          <li>Process your transactions and manage your bookings.</li>
          <li>Communicate with you for customer service and to provide updates.</li>
          <li>For compliance purposes, including enforcing our Terms of Service.</li>
        </ul>
        
        <h2>Your Data Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information at any time through your profile page or by contacting us directly. Our chat feature also includes the option to delete messages you have sent.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us.
        </p>
      </CardContent>
    </Card>
  );
}
