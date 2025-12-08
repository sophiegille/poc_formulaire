import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { formData, disponibilites } = await request.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,    // ton_email@gmail.com
      pass: process.env.EMAIL_PASSWORD, // ton App Password
    },
  });

  const disponibilitesTexte = disponibilites
    .map((dispo: { jour: string; heureDebut: string; heureFin: string }) =>
      `${dispo.jour} de ${dispo.heureDebut} à ${dispo.heureFin}`
    )
    .join('\n');

  const mailOptions = {
    from: `"${formData.prenom} ${formData.nom}" <${formData.email}>`,
    to: 'sophie.gille@insee.fr',
    subject: `Nouvelle soumission de formulaire`,
    text: `
      Nom : ${formData.nom} ${formData.prenom}
      Email : ${formData.email}
      Adresse : ${formData.adresse}

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
      { message: 'Erreur lors de l\'envoi de l\'email. Vérifie tes identifiants SMTP.' },
      { status: 500 }
    );
  }
}
