import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <Button 
      onClick={onClick}
      className="chat-float"
      size="icon"
      aria-label="Abrir chat"
    >
      <MessageCircle className="h-6 w-6 text-brand-orange-foreground" />
    </Button>
  );
}