import { UIMessage } from "ai";
import { Response } from "@/components/ai-elements/response";

interface MessageWithContent extends UIMessage {
    content?: string;
}

export function AssistantMessage({ message }: { message: UIMessage }) {
    const msg = message as MessageWithContent;
    
    if (msg.parts && Array.isArray(msg.parts) && msg.parts.length > 0) {
        return (
            <div className="w-full">
                <div className="text-sm flex flex-col gap-4">
                    {msg.parts.map((part, i) => {
                        if (part.type === "text" && part.text && part.text.trim()) {
                            return <Response key={`${message.id}-${i}`}>{part.text}</Response>;
                        }
                        return null;
                    })}
                </div>
            </div>
        );
    }
    
    if (msg.content && typeof msg.content === 'string' && msg.content.trim()) {
        return (
            <div className="w-full">
                <div className="text-sm">
                    <Response>{msg.content}</Response>
                </div>
            </div>
        );
    }
    
    return null;
}
