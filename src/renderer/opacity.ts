// Opacity slider renderer. Reads the current opacity from main, and pushes live
// updates as the slider moves (main applies it to every pet window + persists).

interface OpacityAPI {
  get: () => Promise<number>;
  set: (v: number) => void;
}
const api = (window as unknown as { opacityAPI: OpacityAPI }).opacityAPI;

const slider = document.getElementById('slider') as HTMLInputElement;
const val = document.getElementById('val') as HTMLElement;

function show(v: number): void {
  val.textContent = v + '%';
}

slider.addEventListener('input', () => {
  const v = Number(slider.value);
  show(v);
  api.set(v);
});

void api.get().then((v) => {
  slider.value = String(v);
  show(v);
});
