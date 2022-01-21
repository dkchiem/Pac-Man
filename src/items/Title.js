export class Title {
  constructor(title) {
    this.title = title;
  }

  draw() {
    window.ctx.save();
    window.ctx.fillStyle = 'white';
    window.ctx.font = 'bold 50px "Press Start 2P"';
    window.ctx.textAlign = 'center';
    window.ctx.fillText(
      this.title,
      window.canvas.width / 2,
      window.canvas.height / 2,
    );
    window.ctx.restore();
  }
}
