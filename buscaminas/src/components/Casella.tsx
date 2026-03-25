/**
 * Classe Casella - Representa cada casella individual del tauler de buscamines
 *
 * Aquesta classe conté l'estat de cada casella individual del joc.
 * Cada casella pot estar oculta o revelada, pot contenir una mina o no,
 * i pot estar marcada per l'usuari com a sospitosa de contenir una mina.
 */
class Casella {
  /** Indica si la casella conté una mina */
  esMina: boolean;

  /** Indica si la casella ha estat revelada per l'usuari */
  revelada: boolean;

  /** Indica si la casella ha estat marcada com a sospitosa per l'usuari */
  marcada: boolean;

  /**
   * Constructor de la classe Casella
   * @param esMina - Indica si la casella inicialment conté una mina (per defecte false)
   */
  constructor(esMina: boolean = false) {
    this.esMina = esMina;
    this.revelada = false;
    this.marcada = false;
  }

  /**
   * Mètode per revelar la casella
   * Canvia l'estat de revelada a true
   */
  revelar(): void {
    this.revelada = true;
  }

  /**
   * Mètode per marcar/desmarcar la casella com a sospitosa
   * Canvia l'estat de marcada (toggle)
   */
  marcar(): void {
    if (this.marcada) {
      this.marcada = false;
    } else {
      this.marcada = true;
    }
  }
}

export default Casella;
