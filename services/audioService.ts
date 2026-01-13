
export class AudioService {
  private static synth = window.speechSynthesis;

  static speak(text: string) {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    this.synth.speak(utterance);
  }

  static stop() {
    this.synth.cancel();
  }
}
