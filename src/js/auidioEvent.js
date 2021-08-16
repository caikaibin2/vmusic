export function pause(audio, fun) {
  audio.addEventListener("pause", () => {
    fun();
    return false;
  });
}

// monitorAudioPlay(audio) {
//     audio.addEventListener("pause", () => {
//       this.isplay = !this.isplay;
//     });
//     audio.addEventListener("play", () => {
//       this.isplay = !this.isplay;
//     });
//     audio.addEventListener("durationchange", () => {
//       this.isplay = false;
//     });
//     // 网络差,缓冲时触发
//     audio.addEventListener("waiting", () => {
//       this.isplay = true;
//     });
//   },
