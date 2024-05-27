import { CohereClient, Cohere } from 'cohere-ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY || '',
});

const toCohereRole = (role: string): Cohere.ChatMessageRole => {
    if (role === 'user') {
        return Cohere.ChatMessageRole.User;
    }
    return Cohere.ChatMessageRole.Chatbot;
};

export async function POST(req: Request) {
    try {
        if (!process.env.COHERE_API_KEY) {
            return new NextResponse('Missing Cohere API key.', { status: 400 });
        }
        const { messages } = await req.json();
        const chatHistory = messages.map((message: any) => ({
            message: message.content,
            role: toCohereRole(message.role),
        }));
        const lastMessage = chatHistory.pop();
        const response = await cohere.chatStream({
            message: lastMessage.message,
            chatHistory,
        });
        const stream = new ReadableStream({
            async start(controller) {
                for await (const event of response) {
                    if (event.eventType === 'text-generation') {
                        controller.enqueue(event.text);
                    }
                }
                controller.close();
            },
        });
        return new Response(stream);
    } catch (error) {
        return new NextResponse('Something went wrong.', { status: 500 });
    }
};
