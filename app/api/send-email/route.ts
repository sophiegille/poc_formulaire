import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { formData, disponibilites } = await request.json();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const disponibilitesTexte = disponibilites
    .map((dispo: { jour: string; heureDebut: string; heureFin: string }) =>
      `${dispo.jour} de ${dispo.heureDebut} à ${dispo.heureFin}`
    )
    .join('\n');

  const mailOptions = {
    from: `"${formData.prenom} ${formData.nom}" <${process.env.EMAIL_USER}>`,
    replyTo: formData.email,
    to: process.env.EMAIL_DEST,
    subject: "Nouvelle soumission de formulaire",
    text: `
Nom : ${formData.nom} ${formData.prenom}
Email : ${formData.email}
Adresse : ${formData.adresse}
Commune : ${formData.commune}

Disponibilités :
${disponibilitesTexte}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email envoyé avec succès !' });
  } catch (error) {
    console.error('Erreur Nodemailer :', error);
    return NextResponse.json(
      { message: "Erreur lors de l'envoi de l'email. Vérifiez la configuration SMTP." },
      { status: 500 }
    );
  }
}
