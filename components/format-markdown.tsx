import { Message } from "ai";
import Markdown from "react-markdown";

export default function FormattedMarkdown({ message }: { message: Message }) {
    return (
        <div className='mt-1.5 w-full'>
            <p className='font-semibold'>Bot</p>
            <div className='mt-2 text-sm text-zinc-900'>
                <Markdown>{message.content}</Markdown>
            </div>
        </div>
    );
};
