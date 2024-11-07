import { NextResponse } from "next/server";
import { Deepgram } from "@deepgram/sdk";

// Initialize Deepgram with API key
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { audio } = body;

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(audio, 'base64');

    // Configure transcription options
    const options = {
      smart_format: true,
      model: "nova-2",
      language: "en",
    };

    // Send request to Deepgram for transcription
    const response = await deepgram.transcription.preRecorded(
      { buffer: audioBuffer, mimetype: 'audio/wav' },
      options
    );

    // Extract transcription from response
    const transcription = response.results?.channels[0]?.alternatives[0]?.transcript || "";

    return NextResponse.json({ transcription });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
} 