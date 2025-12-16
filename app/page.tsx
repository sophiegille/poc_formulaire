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
        <h1 style={styles.title}>Formulaire de disponibilités</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* RÉFÉRENCE */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Référence</label>
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
    backgroundColor: "#121212",
    padding: "20px",
  },
  formContainer: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#1e1e1e",
    borderRadius: "12px",
    padding: "30px",
    border: "1px solid #333",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "30px",
    color: "#bb86fc",
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
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#e0e0e0",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    backgroundColor: "#2d2d2d",
    border: "1px solid #444",
    color: "#e0e0e0",
  },
  sectionTitleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#bb86fc",
    fontSize: "18px",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#bb86fc",
    color: "#121212",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  dispoGroup: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  dispoInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#2d2d2d",
    border: "1px solid #444",
    color: "#e0e0e0",
  },
  removeButton: {
    backgroundColor: "#ff5252",
    color: "white",
    border: "none",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  submitButton: {
    padding: "14px",
    backgroundColor: "#bb86fc",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  successMessage: {
    color: "#4caf50",
    textAlign: "center" as const,
  },
  errorMessage: {
    color: "#ff5252",
    textAlign: "center" as const,
  },
};
