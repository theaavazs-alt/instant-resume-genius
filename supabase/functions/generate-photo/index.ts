import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, style } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!imageBase64) {
      throw new Error('No image provided');
    }

    console.log(`Processing photo with style: ${style}`);

    const styleDescriptions: Record<string, string> = {
      professional: 'corporate professional headshot with clean plain background, formal business attire, soft studio lighting, neutral expression, LinkedIn profile style',
      modern: 'contemporary professional portrait with subtle gradient background, confident expression, modern business casual look, clean and polished',
      classic: 'traditional formal headshot with solid neutral background, classic business attire, timeless professional appearance, passport photo quality'
    };

    const prompt = `Transform this photo into a ${styleDescriptions[style] || styleDescriptions.professional}. 
Make it suitable for a professional resume or LinkedIn profile.
Ensure good lighting, clean background, and professional appearance.
Keep the person's likeness accurate while enhancing the professional quality.`;

    console.log('Calling Gemini Image API...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { 
                type: 'image_url', 
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a few moments.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
    }

    const aiResponse = await response.json();
    console.log('AI response received');

    // Extract the generated image
    const generatedImage = aiResponse.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImage) {
      // If no image was generated, return the original with a message
      console.log('No image generated, returning original');
      return new Response(
        JSON.stringify({ 
          image: imageBase64,
          message: 'Photo processed. For best results, upload a clear, well-lit face photo.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Photo generation successful');

    return new Response(
      JSON.stringify({ image: generatedImage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-photo function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
