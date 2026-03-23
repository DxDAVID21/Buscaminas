// TODO: Make the logistic of the 'Casella', searching if the casella there is a mine or don't

class Casella {
  esMina: boolean;
  revelada: boolean;
  marcada: boolean;

  constructor(esMina: boolean = false) {
    this.esMina = esMina;
    this.revelada = false;
    this.marcada = false;
  }

  revelar(): void {
    this.revelada = true
  }

  marcar(): void {

    if (this.marcada === false) {
      this.marcada = false;
      console.log("No mostrar");
    } else {
      this.marcada = true;
      console.log("Posar bandera");
    }
  }
}

export default Casella;

