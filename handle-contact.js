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

    // 1. Generate AI Response via OpenAI / OpenRouter / InsForge AI Gateway
    let aiResponse = `Thank you for reaching out, ${name}! Avinash has received your message regarding "${subject || 'Portfolio Inquiry'}" and will get back to you shortly.`;
    
    try {
      const apiKey = Deno.env.get('OPENROUTER_API_KEY') || Deno.env.get('OPENAI_API_KEY');
      if (apiKey) {
        const openai = new OpenAI({
          baseURL: Deno.env.get('AI_BASE_URL') || 'https://openrouter.ai/api/v1',
          apiKey: apiKey,
        });

        const prompt = `You are an intelligent, polite, and enthusiastic virtual assistant for Avinash Verma, a talented Web Developer & CS Student.
A user named ${name} (${email}) has just sent a message from his portfolio:
Subject: "${subject || 'General Inquiry'}"
Message: "${message}"

Write a friendly, professional, 2-sentence response acknowledging their message, thanking them on behalf of Avinash, and assuring them Avinash will review their note and respond soon.`;

        const completion = await openai.chat.completions.create({
          model: Deno.env.get('AI_MODEL') || 'openai/gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150,
        });

        aiResponse = completion.choices[0]?.message?.content || aiResponse;
      }
    } catch (aiErr) {
      console.warn("AI Generation Error (using template fallback):", aiErr);
    }

    // 2. Save Message to InsForge Database
    try {
      const baseUrl = Deno.env.get('INSFORGE_BASE_URL') || 'https://r4s69m7b.ap-southeast.insforge.app';
      const anonKey = Deno.env.get('ANON_KEY') || 'anon_e477484020cb5f6036d7fa05715227a98204ee6b293d38ad446f77bf4dde73a2';

      const insforge = createClient({ baseUrl, anonKey });

      const { error: dbError } = await insforge
        .database
        .from('messages')
        .insert([
          { name, email, message, ai_response: aiResponse }
        ]);

      if (dbError) {
        console.error('InsForge DB Insert Error:', dbError);
      }
    } catch (dbErr) {
      console.error("Database connection error:", dbErr);
    }

    // 3. Send Direct Email Notification to Avinash via FormSubmit (Server-to-Server)
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
          ai_acknowledgment: aiResponse,
          _captcha: "false"
        })
      });
    } catch (emailErr) {
      console.error("Email notification error:", emailErr);
    }

    // 4. Return success with AI response to frontend
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
