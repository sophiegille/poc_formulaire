"use client";

import { useState } from "react";

export default function Formulaire() {
  const [formData, setFormData] = useState({
    reference: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    commune: "",
  });

  const [disponibilites, setDisponibilites] = useState([
    { jour: "", heureDebut: "" },
  ]);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDispoChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newDispos = [...disponibilites];
    newDispos[index] = { ...newDispos[index], [name]: value };
    setDisponibilites(newDispos);
  };

  const ajouterDisponibilite = () => {
    setDisponibilites([...disponibilites, { jour: "", heureDebut: "" }]);
  };

  const supprimerDisponibilite = (index: number) => {
    if (disponibilites.length > 1) {
      const newDispos = [...disponibilites];
      newDispos.splice(index, 1);
      setDisponibilites(newDispos);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("Envoi en cours...");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, disponibilites }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Email envoyé avec succès !");
      } else {
        setMessage(result.message || "Une erreur est survenue.");
      }
    } catch {
      setMessage("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Formulaire de contact</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* RÉFÉRENCE */}
          <div style={styles.formGroup}>
            <label style={{ ...styles.label, fontWeight: "700" }}>
  Référence de l’enquête</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Référence dossier"
            />
          </div>

          {/* NOM */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Votre nom"
            />
          </div>

          {/* PRÉNOM */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              style={styles.input}
              placeholder="Votre prénom"
            />
          </div>

          {/* EMAIL */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="votre@email.com"
            />
          </div>

          {/* TÉLÉPHONE */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="06 00 00 00 00"
            />
          </div>

          {/* ADRESSE */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Adresse</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Votre adresse"
            />
          </div>

          {/* COMMUNE */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Commune</label>
            <input
              type="text"
              name="commune"
              value={formData.commune}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Votre commune"
            />
          </div>

          {/* DISPONIBILITÉS */}
          <div style={styles.sectionTitleContainer}>
            <h2 style={styles.sectionTitle}>Disponibilités (facultatif)</h2>
            <button
              type="button"
              onClick={ajouterDisponibilite}
              style={styles.addButton}
            >
              + Ajouter
            </button>
          </div>

          {disponibilites.map((dispo, index) => (
            <div key={index} style={styles.dispoGroup}>
              <input
                type="date"
                name="jour"
                value={dispo.jour}
                onChange={(e) => handleDispoChange(index, e)}
                style={styles.dispoInput}
              />
              <input
                type="time"
                name="heureDebut"
                value={dispo.heureDebut}
                onChange={(e) => handleDispoChange(index, e)}
                style={styles.dispoInput}
              />
              {disponibilites.length > 1 && (
                <button
                  type="button"
                  onClick={() => supprimerDisponibilite(index)}
                  style={styles.removeButton}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            style={
              isLoading
                ? { ...styles.submitButton, ...styles.disabledButton }
                : styles.submitButton
            }
          >
            {isLoading ? "Envoi..." : "Valider"}
          </button>

          {message && (
            <p
              style={
                message.includes("succès")
                  ? styles.successMessage
                  : styles.errorMessage
              }
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
    padding: "20px",
  },

  formContainer: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#FFFFFF",
    borderRadius: "6px",
    padding: "32px",
    border: "1px solid #D0D5DD",
  },

  title: {
    textAlign: "center" as const,
    marginBottom: "32px",
    color: "#003A8F",
    fontSize: "24px",
    fontWeight: "600",
  },

  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#2A2A2A",
  },

  input: {
    padding: "10px 14px",
    borderRadius: "4px",
    border: "1px solid #D0D5DD",
    fontSize: "15px",
    color: "#2A2A2A",
    backgroundColor: "#FFFFFF",
  },

  sectionTitleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },

  sectionTitle: {
    color: "#003A8F",
    fontSize: "18px",
    fontWeight: "600",
  },

  addButton: {
    backgroundColor: "#0053B3",
    color: "#FFFFFF",
    border: "none",
    padding: "6px 14px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
  },

  dispoGroup: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  dispoInput: {
    flex: 1,
    padding: "9px 12px",
    borderRadius: "4px",
    border: "1px solid #D0D5DD",
    fontSize: "14px",
  },

  removeButton: {
    backgroundColor: "#C62828",
    color: "#FFFFFF",
    border: "none",
    width: "32px",
    height: "32px",
    borderRadius: "4px",
    fontSize: "18px",
    cursor: "pointer",
  },

  submitButton: {
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#003A8F",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  successMessage: {
    color: "#2E7D32",
    textAlign: "center" as const,
    fontWeight: "500",
  },

  errorMessage: {
    color: "#C62828",
    textAlign: "center" as const,
    fontWeight: "500",
  },
};
