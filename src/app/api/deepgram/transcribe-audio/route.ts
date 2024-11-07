import { NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";

// Create a Deepgram client
const deepgram = createClient(process.env.DEEPGRAM_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { audio } = body;

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, 'base64');

    // Send to Deepgram for transcription
    const { result } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
      mimetype: 'audio/wav',
      smart_format: true,
      model: 'general',
    });

    // Extract the transcription text
    const transcription = result.results?.channels[0]?.alternatives[0]?.transcript || '';

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
} 