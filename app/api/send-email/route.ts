import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { formData, disponibilites } = await request.json();

  if (
    !formData.reference ||
    !formData.nom ||
    !formData.email ||
    !formData.telephone ||
    !formData.adresse ||
    !formData.commune
  ) {
    return NextResponse.json(
      { message: "Champs obligatoires manquants." },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const disponibilitesValides = disponibilites.filter(
    (d: { jour: string; heureDebut: string }) =>
      d.jour && d.heureDebut
  );

  const disponibilitesTexte =
    disponibilitesValides.length > 0
      ? disponibilitesValides
          .map(
            (d: { jour: string; heureDebut: string }) =>
              `${d.jour} à partir de ${d.heureDebut}`
          )
          .join("\n")
      : "Aucune disponibilité renseignée";

  const mailOptions = {
    from: `"${formData.prenom} ${formData.nom}" <${process.env.EMAIL_USER}>`,
    replyTo: formData.email,
    to: process.env.EMAIL_DEST,
    subject: "Nouvelle soumission de formulaire",
    text: `
Référence : ${formData.reference}

Nom : ${formData.nom} ${formData.prenom}
Email : ${formData.email}
Téléphone : ${formData.telephone}
Adresse : ${formData.adresse}
Commune : ${formData.commune}

Disponibilités :
${disponibilitesTexte}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email envoyé avec succès !" });
  } catch (error) {
    console.error("Erreur Nodemailer :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'envoi de l'email." },
      { status: 500 }
    );
  }
}
