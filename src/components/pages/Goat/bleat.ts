// A synthesised "meeeh": a sawtooth that slides down in pitch, with a fast
// warble on top. No audio file, so nothing extra to load or allow in the CSP.

let ctx: AudioContext | null = null;

export const playBleat = () => {
    const AudioCtx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    ctx ??= new AudioCtx();
    if (ctx.state === "suspended") void ctx.resume();

    const t = ctx.currentTime;
    const end = t + 0.75;

    const voice = ctx.createOscillator();
    voice.type = "sawtooth";
    voice.frequency.setValueAtTime(560, t);
    voice.frequency.linearRampToValueAtTime(430, t + 0.6);

    // The warble that makes it sound like a goat rather than a buzzer.
    const warble = ctx.createOscillator();
    warble.frequency.value = 26;
    const warbleDepth = ctx.createGain();
    warbleDepth.gain.value = 45;
    warble.connect(warbleDepth).connect(voice.frequency);

    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 1800;

    const volume = ctx.createGain();
    volume.gain.setValueAtTime(0, t);
    volume.gain.linearRampToValueAtTime(0.15, t + 0.05);
    volume.gain.setValueAtTime(0.15, t + 0.45);
    volume.gain.exponentialRampToValueAtTime(0.001, end);

    voice.connect(tone).connect(volume).connect(ctx.destination);
    voice.start(t);
    warble.start(t);
    voice.stop(end);
    warble.stop(end);
};
