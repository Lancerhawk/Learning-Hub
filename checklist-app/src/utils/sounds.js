// Terminal click sound utility
let audioContext = null;
let clickBuffer = null;

// Initialize audio context and create click sound
const initAudio = async () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create a short, sharp click sound (like a mechanical keyboard)
        const sampleRate = audioContext.sampleRate;
        const duration = 0.05; // 50ms
        const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // Generate a quick click sound with decay
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 50); // Quick decay
            data[i] = (Math.random() * 2 - 1) * envelope * 0.3; // White noise with envelope
        }

        clickBuffer = buffer;
    }
};

// Play click sound
export const playClickSound = async () => {
    try {
        await initAudio();

        if (audioContext && clickBuffer) {
            const source = audioContext.createBufferSource();
            const gainNode = audioContext.createGain();

            source.buffer = clickBuffer;
            gainNode.gain.value = 0.2; // Volume

            source.connect(gainNode);
            gainNode.connect(audioContext.destination);

            source.start(0);
        }
    } catch (error) {
        console.log('Audio playback failed:', error);
    }
};

// Play a different sound for checkbox toggle (slightly higher pitch)
export const playToggleSound = async () => {
    try {
        await initAudio();

        if (audioContext) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Higher pitch

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    } catch (error) {
        console.log('Audio playback failed:', error);
    }
};
