export type FPSRunner = {
  lastFrameTime: number;
  frameCount: number;
  fps: number;
  colorIndex: number;
  COLORS: readonly string[];
  updateFPS: () => FPSRunner;
};

export function runFPS() {
  return {
    lastFrameTime: performance.now(),
    frameCount: 0,
    fps: 0,
    colorIndex: 0,
    COLORS: ["red", "green", "yellow"],
    updateFPS: function updateFPS() {
      const currentTime = performance.now();
      this.frameCount++;

      if (currentTime - this.lastFrameTime >= 1000) {
        this.fps = Math.round(
          (this.frameCount * 1000) / (currentTime - this.lastFrameTime),
        );
        this.frameCount = 0;
        this.lastFrameTime = currentTime;

        const fpsElement = document.getElementById("fps") as HTMLSpanElement;
        fpsElement.innerText = `FPS: ${this.fps}`;
        fpsElement.style.color = this.COLORS[this.colorIndex];
        this.colorIndex = (this.colorIndex + 1) % this.COLORS.length;
      }
      return this;
    },
  };
}
