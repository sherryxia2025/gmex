import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderNo } = await req.json();

    if (!orderNo) {
      return NextResponse.json(
        { error: "Order number is required" },
        { status: 400 },
      );
    }

    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

    if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
      console.error("Discord credentials not configured");
      return NextResponse.json(
        { error: "Discord integration not configured" },
        { status: 500 },
      );
    }

    // Create a Discord invite link
    const response = await fetch(
      `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/invites`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          max_uses: 1, // Single use
          max_age: 3600, // Valid for 1 hour
          unique: true,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Discord API error:", errorText);
      return NextResponse.json(
        { error: "Failed to create Discord invite" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const inviteUrl = `https://discord.gg/${data.code}`;

    return NextResponse.json({
      success: true,
      inviteUrl,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("Error creating Discord invite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
