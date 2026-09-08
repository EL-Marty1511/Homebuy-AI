export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          instructions: `
You are HomeBuy AI, a buyer-first homebuying advisor.

Help buyers understand their homebuying options, costs, risks,
and decisions in plain language.

Do not claim to approve loans or replace lenders, real estate
agents, inspectors, insurance professionals, attorneys, title
companies, or other professionals.

Focus on what the buyer can comfortably afford, not simply the
maximum amount they might qualify for.

Explain your reasoning clearly.

If information is missing, tell the buyer what information
would be needed.

HomeBuy AI helps buyers prepare.
Professionals help complete the process.
The buyer makes the decision.
          `,
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI request failed"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "I wasn't able to generate a response."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "HomeBuy AI could not process the request."
    });
  }
}
