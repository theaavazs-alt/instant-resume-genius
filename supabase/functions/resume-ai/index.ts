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
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Processing ${type} request`);

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'generate-resume') {
      systemPrompt = `You are an expert resume writer who creates ATS-optimized, professional resumes. 
Generate a well-structured resume in plain text format that can be easily parsed by ATS systems.
Use clear section headers: PROFESSIONAL SUMMARY, EXPERIENCE, EDUCATION, SKILLS.
Use action verbs and quantify achievements where possible.
Keep formatting clean and professional.`;

      userPrompt = `Create a professional resume for:
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Location: ${data.location || 'Not provided'}

Professional Summary: ${data.summary || 'Create a compelling 2-3 sentence professional summary based on the experience below.'}

Experience:
${data.experiences?.map((exp: any) => `
- ${exp.title} at ${exp.company} (${exp.duration})
  ${exp.description}
`).join('\n') || 'No experience provided'}

Education:
${data.education?.map((edu: any) => `
- ${edu.degree} from ${edu.school} (${edu.year})
`).join('\n') || 'No education provided'}

Skills: ${data.skills || 'Not provided'}

Style: ${data.style || 'professional'}

Generate a complete, polished resume ready for job applications.`;
    } else if (type === 'analyze-resume') {
      systemPrompt = `You are an expert ATS (Applicant Tracking System) analyst and resume coach.
Analyze resumes and provide detailed, actionable feedback in JSON format.
Be specific and helpful in your suggestions.`;

      userPrompt = `Analyze this resume text and provide feedback in the following JSON format:
{
  "atsScore": <number 0-100>,
  "keywords": {
    "score": <number 0-100>,
    "found": [<array of strong keywords found>],
    "missing": [<array of important keywords that should be added>]
  },
  "grammar": {
    "score": <number 0-100>,
    "issues": [<array of specific grammar/clarity improvement suggestions>]
  },
  "formatting": {
    "score": <number 0-100>,
    "suggestions": [<array of formatting improvement tips>]
  }
}

Resume content:
${data.resumeText || 'No resume text provided'}

Provide only valid JSON in your response.`;
    } else if (type === 'generate-cover-letter') {
      systemPrompt = `You are an expert cover letter writer who creates compelling, personalized cover letters.
Write in a professional yet personable tone.
Highlight relevant skills and experience.
Show enthusiasm for the role and company.`;

      userPrompt = `Write a professional cover letter for:
Name: ${data.fullName}
Email: ${data.email || 'Not provided'}
Job Title: ${data.jobTitle}
Company: ${data.companyName}
Key Skills: ${data.skills || 'Not provided'}
Relevant Experience: ${data.experience || 'Not provided'}
Why interested in this role: ${data.whyInterested || 'Not provided'}

Create a compelling cover letter that would make the hiring manager want to interview this candidate.`;
    } else {
      throw new Error(`Unknown request type: ${type}`);
    }

    console.log('Calling Lovable AI...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
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
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    console.log('AI response received successfully');

    // For analyze-resume, parse the JSON response
    if (type === 'analyze-resume') {
      try {
        // Extract JSON from the response (it might be wrapped in markdown code blocks)
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        }
        const analysis = JSON.parse(jsonStr.trim());
        return new Response(
          JSON.stringify({ result: analysis }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error('Failed to parse analysis JSON:', parseError);
        return new Response(
          JSON.stringify({ result: content }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ result: content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in resume-ai function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
