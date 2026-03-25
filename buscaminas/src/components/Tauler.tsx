/**
 * Classe Tauler - Gestiona l'estructura i l'estat del conjunt de caselles
 *
 * Aquesta classe és la responsable de gestionar l'estructura i l'estat
 * del conjunt de caselles que formen el joc de buscamines.
 */
import Casella from "./Casella";

class Tauler {
  /** Matriu bidimensional d'objectes de tipus Casella */
  caselles: Casella[][];

  /** Nombre de files del tauler */
  files: number;

  /** Nombre de columnes del tauler */
  columnes: number;

  /** Nombre total de mines al tauler */
  totalMines: number;

  /**
   * Constructor de la classe Tauler
   * @param files - Nombre de files del tauler
   * @param columnes - Nombre de columnes del tauler
   * @param totalMines - Nombre total de mines (per defecte 10)
   */
  constructor(files: number, columnes: number, totalMines: number = 10) {
    this.files = files;
    this.columnes = columnes;
    this.totalMines = totalMines;
    this.caselles = [];
  }

  /**
   * Mètode per inicialitzar les caselles del tauler
   * Crea la matriu 2D de caselles i distribueix les mines de manera aleatòria
   */
  inicializarCaselles(): void {
    // 1. Crear un array 2D de caselles buides (sense mines)
    for (let i = 0; i < this.files; i++) {
      this.caselles[i] = [];
      for (let j = 0; j < this.columnes; j++) {
        this.caselles[i][j] = new Casella(false);
      }
    }

    // 2. Col·loquem exactament 'totalMines' aleatòriament
    let minesColocades = 0;
    while (minesColocades < this.totalMines) {
      const fila = Math.floor(Math.random() * this.files);
      const col = Math.floor(Math.random() * this.columnes);
      if (!this.caselles[fila][col].esMina) {
        this.caselles[fila][col] = new Casella(true);
        minesColocades++;
      }
    }
  }

  /**
   * Retorna la casella en una posició determinada
   * @param fila - Posició de la fila
   * @param columna - Posició de la columna
   * @returns L'objecte Casella en la posició indicada
   */
  getCasella(fila: number, columna: number): Casella {
    return this.caselles[fila][columna];
  }

  /**
   * Compte les mines adjacents a una casella
   * @param fila - Posició de la fila de la casella
   * @param columna - Posició de la columna de la casella
   * @returns El nombre de mines adjacents (0-8)
   */
  contarMinesAdjacents(fila: number, columna: number): number {
    let count = 0;
    // Recorrem les 8 posicions adjacents
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        // Saltem la posició actual (la pròpia casella)
        if (i === 0 && j === 0) continue;

        const newFila = fila + i;
        const newCol = columna + j;

        // Comprovem que estem dins dels limits del tauler
        if (
          newFila >= 0 &&
          newFila < this.files &&
          newCol >= 0 &&
          newCol < this.columnes
        ) {
          // Si la casella adjacent conté una mina, incrementem el comptador
          if (this.caselles[newFila][newCol].esMina) {
            count++;
          }
        }
      }
    }
    return count;
  }

  /**
   * Mostra el tauler per consola (per depuració)
   * Utilitza emojis per representar les caselles: 💣 per mines, números per caselles segures
   */
  mostrarPerConsola(): void {
    let output = "";
    for (let i = 0; i < this.files; i++) {
      for (let j = 0; j < this.columnes; j++) {
        if (this.caselles[i][j].esMina) {
          output += "💣 "; // Mina
        } else {
          const mines = this.contarMinesAdjacents(i, j);
          output += mines > 0 ? mines + " " : "⬜ "; // Número o casella buida
        }
      }
      output += "\n"; // Salt de línia per cada fila
    }
    console.log(output);
  }
}

export default Tauler;
