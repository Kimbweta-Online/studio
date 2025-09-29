import { AiChatForm } from '@/components/ai-chat-form';

export default function AiChatPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dr. Mindset Support</h1>
        <p className="text-muted-foreground">
          A safe space to share and receive guidance. Your conversations are private.
        </p>
      </div>
      <AiChatForm />
    </div>
  );
}
