import { type NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioWhatsAppPhoneNumber = process.env.TWILIO_WHATSAPP_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

export async function GET(_request: NextRequest) {
  try {
    const data = {
      message: "Twilio API endpoint is working",
      timestamp: new Date().toISOString(),
      status: "active",
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Twilio API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Example: Send SMS or make a call
    const { phoneNumber, message } = body;

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: "Phone number and message are required" },
        { status: 400 },
      );
    }

    const twilioResponse = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber
    });

    const randomNumber = Math.floor(Math.random() * 1000000);
    const whatsAppResponse = await twilioClient.messages
      .create({
        from: twilioWhatsAppPhoneNumber,
        contentSid: 'HX229f5a04fd0510ce1b071852155d3e75',
        contentVariables: `{"1":"${randomNumber}"}`,
        to: `whatsapp:${phoneNumber}`
      });

    const response = {
      success: true,
      phoneNumber,
      message,
      twilioSid: twilioResponse.sid + ' - ' + whatsAppResponse.sid
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Twilio POST error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
