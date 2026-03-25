/**
 * Classe Joc - Gestiona la lògica del joc i la interacció amb l'usuari
 *
 * Aquesta classe és l'encarregada de gestionar la lògica del joc,
 * incloent la interacció de l'usuari i el seguiment de l'estat del joc.
 */
import Tauler from "./Tauler";

class Joc {
  /** Instància de la classe Tauler que representa el tauler de joc */
  tauler: Tauler;

  /** Estat actual del joc: 'jugant', 'guanyat' o 'perdut' */
  estat: "jugant" | "guanyat" | "perdut";

  /** Referència a l'interval del temporitzador */
  interval: number | null;

  /** Comptador de mines/banderes restants */
  minesFlags: number;

  /**
   * Constructor de la classe Joc
   * Crea el tauler i prepara tot el necessari per començar a jugar
   * @param files - Nombre de files del tauler (per defecte 9)
   * @param columnes - Nombre de columnes del tauler (per defecte 9)
   * @param mines - Nombre de mines (per defecte 10)
   */
  constructor(files: number = 9, columnes: number = 9, mines: number = 10) {
    this.estat = "jugant";
    this.interval = null;
    this.minesFlags = mines;
    this.tauler = new Tauler(files, columnes, mines);
    this.tauler.inicializarCaselles();
  }

  /**
   * Reinicia el joc a l'estat inicial
   * Torna a inicialitzar el tauler i l'estat del joc
   */
  reiniciar(): void {
    this.estat = "jugant";
    this.minesFlags = this.tauler.totalMines;
    this.tauler.inicializarCaselles();
    this.dibujarTauler();
  }

  /**
   * Dibuixa o actualitza la representació visual del tauler
   * Crea una taula HTML amb caselles clicables
   */
  dibujarTauler(): void {
    // Creem la cara clicable per reiniciar
    let html = '<div class="cara" onclick="joc.reiniciar()">😮</div>';

    // Creem la taula HTML
    html += "<table>";
    for (let i = 0; i < this.tauler.files; i++) {
      html += "<tr>";
      for (let j = 0; j < this.tauler.columnes; j++) {
        const id = `cella-${i}-${j}`;
        // Cada casella té un onclick per revelar i oncontextmenu per marcar
        html += `<td id="${id}" class="ocell" onclick="joc.revelarCasella(${i}, ${j})" oncontextmenu="joc.marcarCasella(${i}, ${j}); return false;"></td>`;
      }
      html += "</tr>";
    }
    html += "</table>";

    // Insertem l'HTML al contenedor 'game'
    document.getElementById("game")!.innerHTML = html;
  }

  /**
   * Actualitza la representació visual d'una casella
   * @param fila - Posició de la fila de la casella
   * @param columna - Posició de la columna de la casella
   */
  actualitzarCelda(fila: number, columna: number): void {
    const casella = this.tauler.getCasella(fila, columna);
    const td = document.getElementById(`cella-${fila}-${columna}`);
    if (!td) return;

    // Canviem la classe per indicar que està revelada
    td.className = "revelada";

    // Si està marcada, mostrem la bandera
    if (casella.marcada) {
      td.innerHTML = "🚩";
    } else if (casella.esMina) {
      // Si conté mina, mostrem la mina
      td.innerHTML = "💣";
      td.className = "mina-revelada";
    } else {
      // Si no conté mina, mostrem el nombre de mines adjacents
      const mines = this.tauler.contarMinesAdjacents(fila, columna);
      if (mines > 0) {
        td.innerHTML = mines.toString();
        td.className = `numero-${mines}`;
      }
    }
  }

  /**
   * Gestiona l'acció de l'usuari de revelar una casella
   * @param fila - Posició de la fila de la casella
   * @param columna - Posició de la columna de la casella
   */
  revelarCasella(fila: number, columna: number): void {
    // Si el joc no està en estat 'jugant', ignorem el click
    if (this.estat !== "jugant") return;

    const casella = this.tauler.getCasella(fila, columna);

    // Si la casella ja està revelada o marcada, ignorem el click
    if (casella.revelada || casella.marcada) return;

    // Comprovem si la casella conté una mina
    if (casella.esMina) {
      // El jugador ha perdut: revelem totes les mines
      this.estat = "perdut";
      casella.revelar();
      this.revelarTot();
      this.mostrarCaraPerdut();
      return;
    }

    // Revelem la casella buida i totes les adjacents buides
    this.revelarBuit(fila, columna);
    this.actualitzarCelda(fila, columna);

    // Comprovem si el jugador ha guanyat
    this.comprovarGuany();
  }

  /**
   * Revela una casella buida i totes les seves adjacents buides
   * Implementa el flood-fill per revelar regions buides
   * @param fila - Posició de la fila de la casella
   * @param columna - Posició de la columna de la casella
   */
  revelarBuit(fila: number, columna: number): void {
    const casella = this.tauler.getCasella(fila, columna);

    // Si la casella ja està revelada, és una mina o està marcada, sortim
    if (casella.revelada || casella.marcada || casella.esMina) return;

    // Revelem la casella actual
    casella.revelar();
    this.actualitzarCelda(fila, columna);

    // Comptem les mines adjacents
    const minesAdjacents = this.tauler.contarMinesAdjacents(fila, columna);

    // Si no hi ha mines adjacents, revelem automàticament les caselles adjacents
    if (minesAdjacents === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const newFila = fila + i;
          const newCol = columna + j;

          // Comprovem que estem dins dels limits del tauler
          if (
            newFila >= 0 &&
            newFila < this.tauler.files &&
            newCol >= 0 &&
            newCol < this.tauler.columnes
          ) {
            // Crida recursiva per revelar les caselles adjacents
            this.revelarBuit(newFila, newCol);
          }
        }
      }
    }
  }

  /**
   * Permet a l'usuari marcar o desmarcar una casella com a sospitosa
   * @param fila - Posició de la fila de la casella
   * @param columna - Posició de la columna de la casella
   */
  marcarCasella(fila: number, columna: number): void {
    // Si el joc no està en estat 'jugant', ignorem el click
    if (this.estat !== "jugant") return;

    const casella = this.tauler.getCasella(fila, columna);

    // No es poden marcar caselles ja revelades
    if (casella.revelada) return;

    // Marquem o desmarquem la casella
    casella.marcar();

    // Actualitzem el comptador de mines/banderes
    if (casella.marcada) {
      this.minesFlags--;
    } else {
      this.minesFlags++;
    }

    // Actualitzem la representació visual de la casella
    const td = document.getElementById(`cella-${fila}-${columna}`);
    if (td) {
      td.innerHTML = casella.marcada ? "🚩" : "";
      td.className = casella.marcada ? "flagged" : "ocell";
    }
  }

  /**
   * Revela totes les mines del tauler (quan el jugador perd)
   */
  revelarTot(): void {
    for (let i = 0; i < this.tauler.files; i++) {
      for (let j = 0; j < this.tauler.columnes; j++) {
        const casella = this.tauler.getCasella(i, j);
        if (casella.esMina) {
          casella.revelar();
          this.actualitzarCelda(i, j);
        }
      }
    }
  }

  /**
   * Comprova si l'usuari ha guanyat el joc
   * El jugador guanya quan totes les caselles sense mines han estat revelades
   */
  comprovarGuany(): void {
    let casellesSeguresRevelades = 0;
    // Calculem el nombre total de caselles segures (sense mines)
    const totalCasellesSegures =
      this.tauler.files * this.tauler.columnes - this.tauler.totalMines;

    // Comptem les caselles segures que han estat revelades
    for (let i = 0; i < this.tauler.files; i++) {
      for (let j = 0; j < this.tauler.columnes; j++) {
        const casella = this.tauler.getCasella(i, j);
        if (casella.revelada && !casella.esMina) {
          casellesSeguresRevelades++;
        }
      }
    }

    // Si totes les caselles segures han estat revelades, el jugador guanya
    if (casellesSeguresRevelades === totalCasellesSegures) {
      this.estat = "guanyat";
      this.mostrarCaraGuanyat();
    }
  }

  /**
   * Mostra la cara de perdut quan el jugador fa clic en una mina
   */
  mostrarCaraPerdut(): void {
    const cara = document.querySelector(".cara");
    if (cara) cara.innerHTML = "😵";
  }

  /**
   * Mostra la cara de guanyat quan el jugador revela totes les caselles segures
   */
  mostrarCaraGuanyat(): void {
    const cara = document.querySelector(".cara");
    if (cara) cara.innerHTML = "😎";
  }
}

export default Joc;
