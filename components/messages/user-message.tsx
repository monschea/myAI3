import { UIMessage } from "ai";
import { Response } from "@/components/ai-elements/response";

export function UserMessage({ message }: { message: UIMessage }) {
    const renderContent = () => {
        if (message.parts && Array.isArray(message.parts)) {
            return message.parts.map((part, i) => {
                if (part.type === "text") {
                    return <Response key={`${message.id}-${i}`}>{part.text}</Response>;
                }
                return null;
            });
        }
        
        if ('content' in message && typeof message.content === 'string') {
            return <Response key={message.id}>{message.content}</Response>;
        }
        
        return null;
    };

    return (
        <div className="whitespace-pre-wrap w-full flex justify-end">
            <div className="max-w-lg w-fit px-4 py-3 rounded-[20px] bg-neutral-100">
                <div className="text-sm">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
