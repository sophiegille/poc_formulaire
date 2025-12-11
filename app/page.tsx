"use client";

import { useState } from 'react';

export default function Formulaire() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    adresse: '',
  });
  const [disponibilites, setDisponibilites] = useState([
    { jour: '', heureDebut: '', heureFin: '' }
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDispoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newDispos = [...disponibilites];
    newDispos[index] = { ...newDispos[index], [name]: value };
    setDisponibilites(newDispos);
  };

  const ajouterDisponibilite = () => {
    setDisponibilites([...disponibilites, { jour: '', heureDebut: '', heureFin: '' }]);
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
    setMessage('Envoi en cours...');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, disponibilites }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('✅ Email envoyé avec succès !');
      } else {
        setMessage(result.message || '❌ Une erreur est survenue.');
      }
    } catch (error) {
      setMessage('❌ Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Formulaire de Disponibilités</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
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
          <div style={styles.formGroup}>
            <label style={styles.label}>Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Votre prénom"
            />
          </div>
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

          <div style={styles.sectionTitleContainer}>
            <h2 style={styles.sectionTitle}>Disponibilités</h2>
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
                required
                style={styles.dispoInput}
              />
              <input
                type="time"
                name="heureDebut"
                value={dispo.heureDebut}
                onChange={(e) => handleDispoChange(index, e)}
                required
                style={styles.dispoInput}
              />
              <input
                type="time"
                name="heureFin"
                value={dispo.heureFin}
                onChange={(e) => handleDispoChange(index, e)}
                required
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

          <button
            type="submit"
            disabled={isLoading}
            style={isLoading ? { ...styles.submitButton, ...styles.disabledButton } : styles.submitButton}
          >
            {isLoading ? (
              <>
                <span className="loader"></span> Envoi...
              </>
            ) : (
              'Valider'
            )}
          </button>

          {message && (
            <p style={message.includes('✅') ? styles.successMessage : styles.errorMessage}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

// Styles en mode sombre
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    color: '#e0e0e0',
    padding: '20px',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  formContainer: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid #333',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    color: '#bb86fc',
    fontSize: '24px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#e0e0e0',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #444',
    color: '#e0e0e0',
    fontSize: '16px',
    transition: 'border-color 0.3s, background-color 0.3s',
    outline: 'none',
  },
  sectionTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  },
  sectionTitle: {
    color: '#bb86fc',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0',
  },
  addButton: {
    backgroundColor: '#bb86fc',
    color: '#121212',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  dispoGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  dispoInput: {
    padding: '10px 12px',
    borderRadius: '6px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #444',
    color: '#e0e0e0',
    fontSize: '14px',
    flex: '1',
  },
  removeButton: {
    backgroundColor: '#ff5252',
    color: 'white',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.3s',
  },
  submitButton: {
    padding: '14px',
    backgroundColor: '#bb86fc',
    color: '#121212',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
  disabledButton: {
    backgroundColor: '#6200ee',
    cursor: 'not-allowed',
    opacity: 0.8,
  },
  successMessage: {
    color: '#4caf50',
    textAlign: 'center' as const,
    fontWeight: '500',
    marginTop: '15px',
  },
  errorMessage: {
    color: '#ff5252',
    textAlign: 'center' as const,
    fontWeight: '500',
    marginTop: '15px',
  },
};
