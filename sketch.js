let tratorX;
let colhedorX;
let plantas = [];
let soloArado = [];
let cidadePronta = [];
let nuvens = [];
let iniciouColheita = false;
let cicloFinalizado = false;

function setup() {
  createCanvas(800, 400);
  frameRate(30);
  iniciarCiclo();

  // Gerar prédios
  for (let i = 0; i < 20; i++) {
    let x = i * 60;
    let h = random(80, 160);
    let cor = random([
      color(180), color(160), color(200), color(120),
      color(190, 190, 220), color(150, 150, 180)
    ]);

    // Gerar janelas
    let janelas = [];
    let linhas = int(h / 20);
    let colunas = 3;
    for (let lin = 0; lin < linhas; lin++) {
      for (let col = 0; col < colunas; col++) {
        if (random() < 0.7) {
          janelas.push({
            x: col * 15 + 5,
            y: lin * 20 + 5,
            acesa: random() < 0.5
          });
        }
      }
    }

    cidadePronta.push({ x, h, cor, janelas });
  }

  // Gerar nuvens
  for (let i = 0; i < 5; i++) {
    nuvens.push({
      x: random(width),
      y: random(50, 120),
      vel: random(0.2, 0.5),
      tam: random(60, 100)
    });
  }
}

function iniciarCiclo() {
  tratorX = -100;
  colhedorX = -300;
  plantas = [];
  soloArado = [];
  iniciouColheita = false;
  cicloFinalizado = false;
}

function draw() {
  background(135, 206, 235); // céu
  desenharNuvens();
  desenharCidadeAoFundo();

  // chão
  fill(139, 69, 19); 
  rect(0, 300, width, 100);

  // solo arado
  fill(101, 67, 33);
  for (let x of soloArado) {
    rect(x, 300, 10, 5);
  }

  // Trator 1 - plantio
  if (tratorX < width + 50) {
    drawTrator(tratorX, 270, 'plantio');
    tratorX += 2;
    if (tratorX > 0 && tratorX % 20 === 0) {
      soloArado.push(tratorX);
      plantas.push(new Planta(tratorX + 5));
    }
  } else {
    iniciouColheita = true;
  }

  // crescimento das plantas
  for (let p of plantas) {
    p.crescer();
    p.mostrar();
  }

  // Trator 2 - colheita
  if (iniciouColheita && colhedorX < width + 50) {
    drawTrator(colhedorX, 270, 'colheita');
    colhedorX += 2;

    for (let p of plantas) {
      if (abs(p.x - colhedorX) < 10 && p.estado === "madura") {
        p.estado = "colhida";
      }
    }
  }

  // Se colhedor sair da tela, reinicia o ciclo
  if (iniciouColheita && colhedorX >= width + 50 && !cicloFinalizado) {
    cicloFinalizado = true;
    setTimeout(iniciarCiclo, 1000); // espera 1 segundo e reinicia
  }
}

function desenharCidadeAoFundo() {
  for (let b of cidadePronta) {
    fill(b.cor);
    rect(b.x, 300 - b.h, 50, b.h);
    for (let j of b.janelas) {
      fill(j.acesa ? color(255, 255, 100) : color(80));
      rect(b.x + j.x, 300 - b.h + j.y, 10, 10, 2);
    }
  }
}

function desenharNuvens() {
  noStroke();
  fill(255, 255, 255, 200);
  for (let n of nuvens) {
    ellipse(n.x, n.y, n.tam, n.tam / 2);
    ellipse(n.x + 20, n.y + 10, n.tam * 0.6, n.tam * 0.4);
    ellipse(n.x - 20, n.y + 10, n.tam * 0.6, n.tam * 0.4);
    n.x += n.vel;
    if (n.x > width + 100) n.x = -100;
  }
}

function drawTrator(x, y, tipo) {
  fill(50, 50, 50, 60);
  ellipse(x + 30, y + 35, 80, 15);
  fill(30);
  ellipse(x + 15, y + 30, 30);
  ellipse(x + 55, y + 30, 30);
  fill(120);
  ellipse(x + 15, y + 30, 15);
  ellipse(x + 55, y + 30, 15);

  fill(tipo === 'plantio' ? [255, 0, 0] : [0, 100, 0]);
  rect(x, y, 70, 30, 5);
  fill(0, 100, 255, 150);
  rect(x + 20, y - 25, 30, 25, 3);
  fill(60);
  rect(x + 5, y - 15, 5, 15);
}

class Planta {
  constructor(x) {
    this.x = x;
    this.y = 300;
    this.altura = 0;
    this.maxAltura = random(40, 60);
    this.estado = "crescendo";
  }

  crescer() {
    if (this.estado === "crescendo") {
      this.altura += 0.6;
      if (this.altura >= this.maxAltura) {
        this.estado = "madura";
      }
    }
  }

  mostrar() {
    if (this.estado === "colhida") return;
    stroke(34, 139, 34);
    strokeWeight(2);
    line(this.x, this.y, this.x, this.y - this.altura);

    if (this.estado === "madura") {
      stroke(218, 165, 32);
      strokeWeight(3);
      line(this.x - 3, this.y - this.altura, this.x + 3, this.y - this.altura);
    }

    noStroke();
  }
}
