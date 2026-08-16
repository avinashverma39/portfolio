import { createClient } from 'npm:@insforge/sdk';
import OpenAI from 'npm:openai';

export default async function(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 1. Generate AI Response
    let aiResponse = "Thank you for reaching out! Avinash will get back to you shortly.";
    try {
      const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: Deno.env.get('OPENROUTER_API_KEY'),
      });

      const prompt = `You are a friendly and professional assistant for a web developer named Avinash Verma. \nA user named ${name} (${email}) has just submitted a contact form on his portfolio with the following message:\n"${message}"\n\nWrite a short, polite, and enthusiastic reply acknowledging their message. Keep it under 3 sentences. Thank them for reaching out and assure them Avinash will get back to them soon.`;

      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });

      aiResponse = completion.choices[0]?.message?.content || aiResponse;
    } catch (aiErr) {
      console.error("OpenAI Error:", aiErr);
    }

    // 2. Save to Database
    try {
      const insforge = createClient({
        baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
        anonKey: Deno.env.get('ANON_KEY')
      });

      const { error: dbError } = await insforge
        .database
        .from('messages')
        .insert([
          { name, email, message, ai_response: aiResponse }
        ]);

      if (dbError) {
        console.error('Database Error:', dbError);
      }
    } catch (dbErr) {
      console.error("Database connection error:", dbErr);
    }

    // 3. Send Email to Avinash via FormSubmit (Server-to-Server, bypasses CORS)
    try {
      await fetch("https://formsubmit.co/ajax/avinashverma3939@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject || "New Message from Portfolio",
          message: message,
          _captcha: "false"
        })
      });
    } catch (emailErr) {
      console.error("Error sending email via FormSubmit:", emailErr);
    }

    // 4. Return response to user
    return new Response(JSON.stringify({ success: true, ai_response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
