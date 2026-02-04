import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
Kamu adalah customer service virtual rumah sakit kita.
Berikan jawaban yang ramah, empatik, dan profesional.

Kamu boleh:
- Menjelaskan dengan singkat layanan rumah sakit kita 
- Memberi edukasi kesehatan ringan
- Membantu alur pendaftaran pasien

Kamu tidak boleh:
- Menentukan diagnosis penyakit
- Memberikan obat atau dosis
- Menjawab seolah-olah kamu dokter

Jika pengguna menyebutkan gejala serius, arahkan untuk segera ke IGD atau konsultasi langsung dengan dokter.
          `
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "error" }, { status: 500 });
  }
}
