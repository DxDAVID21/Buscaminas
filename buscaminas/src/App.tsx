/**
 * Component principal de l'aplicació Buscamines
 * Gestiona la interfície d'usuari i la comunicació amb la classe Joc
 */
import { useEffect } from "react";
import "./App.css";
import Joc from "./components/Joc";
import "./joc.css";

/** Variable global per accedir al joc des de l'HTML */
let joc: Joc;

/**
 * Component principal de l'aplicació
 * Renderitza el tauler de joc i els controls de dificultat
 */
function App() {
  /**
   * Efecte que s'executa en carregar l'aplicació
   * Crea una nova instància del joc i la dibuixa
   */
  useEffect(() => {
    joc = new Joc(9, 9);
    (window as any).joc = joc;
    joc.dibujarTauler();
  }, []);

  /**
   * Inicia un nou joc amb la dificultat especificada
   * @param files - Nombre de files del tauler
   * @param columnes - Nombre de columnes del tauler
   * @param mines - Nombre de mines
   */
  const iniciarJoc = (files: number, columnes: number, mines: number) => {
    joc = new Joc(files, columnes, mines);
    (window as any).joc = joc;
    joc.dibujarTauler();
  };

  /**
   * Reinicia el joc actual
   */
  const reiniciar = () => {
    joc?.reiniciar();
  };

  return (
    <div className="container">
      <h1>Buscamines</h1>

      <div className="controls">
        <button onClick={() => iniciarJoc(9, 9, 10)}>Fàcil (9×9)</button>
        <button onClick={() => iniciarJoc(16, 16, 40)}>Mitjà (16×16)</button>
        <button onClick={() => iniciarJoc(32, 32, 99)}>Difícil (32×32)</button>
      </div>

      <div className="game-container">
        <div id="game">
          <div className="cara" onClick={reiniciar}>
            😮
          </div>
        </div>
      </div>

      <div className="instructions">
        <p>
          <strong>Click esquerre:</strong> Revelar casella
        </p>
        <p>
          <strong>Click dret:</strong> Marcar/Desmarcar bandera
        </p>
      </div>
    </div>
  );
}

export default App;
