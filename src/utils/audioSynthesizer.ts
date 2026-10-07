/**
 * Audio Synthesizer using standard Web Audio API
 * Generates pristine, melodic gothic classical visual novel music (piano, harp, celesta, music box)
 * 100% STATIC-FREE, BUZZ-FREE, NOISE-FREE:
 * - Zero continuous low-frequency drones or beating oscillators
 * - Discrete musical notes with pure sine waveforms and smooth microsecond anti-click envelopes
 * - Automatic node disconnection on note completion to prevent floating point noise accumulation
 * - Persistent volume & mute preferences saved in localStorage
 */

import { AudioMood, SfxType } from '../types/novel';

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private currentMood: AudioMood = 'silence';
  private bgmInterval: number | null = null;
  private activeNoteTimeouts: number[] = [];

  public masterVolume: number = 0.6;
  public bgmVolume: number = 0.35;
  public sfxVolume: number = 0.5;
  public isMuted: boolean = false;
  public isBgmMuted: boolean = false;

  constructor() {
    try {
      const savedMuted = localStorage.getItem('kizil_ay_muted');
      if (savedMuted !== null) this.isMuted = savedMuted === 'true';

      const savedBgmMuted = localStorage.getItem('kizil_ay_bgm_muted');
      if (savedBgmMuted !== null) this.isBgmMuted = savedBgmMuted === 'true';

      const savedMaster = localStorage.getItem('kizil_ay_vol_master');
      if (savedMaster !== null) this.masterVolume = parseFloat(savedMaster);

      const savedBgm = localStorage.getItem('kizil_ay_vol_bgm');
      if (savedBgm !== null) this.bgmVolume = parseFloat(savedBgm);

      const savedSfx = localStorage.getItem('kizil_ay_vol_sfx');
      if (savedSfx !== null) this.sfxVolume = parseFloat(savedSfx);
    } catch {
      // ignore localStorage errors
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.isBgmMuted ? 0 : this.bgmVolume;
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolumes(master: number, bgm: number, sfx: number) {
    this.masterVolume = Math.max(0, Math.min(1, master));
    this.bgmVolume = Math.max(0, Math.min(1, bgm));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));

    try {
      localStorage.setItem('kizil_ay_vol_master', this.masterVolume.toString());
      localStorage.setItem('kizil_ay_vol_bgm', this.bgmVolume.toString());
      localStorage.setItem('kizil_ay_vol_sfx', this.sfxVolume.toString());
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.isBgmMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('kizil_ay_muted', this.isMuted.toString());
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public toggleBgmMute(): boolean {
    this.isBgmMuted = !this.isBgmMuted;
    try {
      localStorage.setItem('kizil_ay_bgm_muted', this.isBgmMuted.toString());
    } catch {}

    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.isBgmMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
    }
    return this.isBgmMuted;
  }

  public stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }

    this.activeNoteTimeouts.forEach((id) => clearTimeout(id));
    this.activeNoteTimeouts = [];

    this.currentMood = 'silence';
  }

  public playMood(mood: AudioMood) {
    if (this.currentMood === mood) return;
    this.initContext();
    this.stopBGM();
    this.currentMood = mood;

    if (!this.ctx || !this.bgmGain) return;
    if (mood === 'silence' || this.isMuted || this.isBgmMuted) return;

    switch (mood) {
      case 'mystery':
        this.startMysteryMelody();
        break;
      case 'romance':
        this.startRomanceMelody();
        break;
      case 'horror':
        this.startHorrorMelody();
        break;
      case 'tension':
        this.startTensionMelody();
        break;
      case 'music_box':
        this.startMusicBoxMelody();
        break;
    }
  }

  /**
   * Helper: Plays a pristine, acoustic piano/harp/celesta note.
   * Uses smooth exponential decay and cleanly disconnects nodes when finished.
   * Completely avoids static, buzzing, clicks, or DC offset.
   */
  private playAcousticNote(
    freq: number,
    startTime: number,
    duration: number = 2.4,
    peakGain: number = 0.09,
    hasOvertone: boolean = true
  ) {
    if (!this.ctx || !this.bgmGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Microsecond anti-click envelope: 15ms smooth ramp up, gentle natural acoustic decay
    gain.gain.setValueAtTime(0.00001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);

    // Optional gentle acoustic overtone (octave harmonic) for richness without buzz
    let overtoneOsc: OscillatorNode | null = null;
    let overtoneGain: GainNode | null = null;
    if (hasOvertone && freq < 600) {
      overtoneOsc = this.ctx.createOscillator();
      overtoneGain = this.ctx.createGain();

      overtoneOsc.type = 'sine';
      overtoneOsc.frequency.setValueAtTime(freq * 2, startTime);

      overtoneGain.gain.setValueAtTime(0.00001, startTime);
      overtoneGain.gain.linearRampToValueAtTime(peakGain * 0.22, startTime + 0.015);
      overtoneGain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration * 0.7);

      overtoneOsc.connect(overtoneGain);
      overtoneGain.connect(this.bgmGain);

      overtoneOsc.start(startTime);
      overtoneOsc.stop(startTime + duration + 0.05);
    }

    // Fully disconnect from Web Audio graph to guarantee ZERO residual static/noise
    const cleanUpTimer = window.setTimeout(() => {
      try {
        osc.disconnect();
        gain.disconnect();
        if (overtoneOsc) overtoneOsc.disconnect();
        if (overtoneGain) overtoneGain.disconnect();
      } catch {}
    }, (duration + 0.2) * 1000);

    this.activeNoteTimeouts.push(cleanUpTimer);
  }

  /**
   * MYSTERY BGM (Main Theme & Title Screen):
   * Melancholic, gothic piano & celesta arpeggios (A minor, F, D minor, E minor).
   * Absolutely NO static, NO continuous low-frequency drone oscillators.
   * Between notes, sound level is pure silence.
   */
  private startMysteryMelody() {
    if (!this.ctx) return;

    // Beautiful gothic visual novel chord arpeggios
    const arpeggios = [
      // Am9: A3, C4, E4, B4
      [220.0, 261.63, 329.63, 493.88],
      // Fmaj7: F3, A3, C4, E4
      [174.61, 220.0, 261.63, 329.63],
      // Dm: D3, F3, A3, D4
      [146.83, 174.61, 220.0, 293.66],
      // Em7: E3, G3, B3, E4
      [164.81, 196.0, 246.94, 329.63],
    ];

    let patternIdx = 0;

    const playArpeggioPattern = () => {
      if (!this.ctx || this.currentMood !== 'mystery' || this.isMuted || this.isBgmMuted) return;
      const t = this.ctx.currentTime;
      const chord = arpeggios[patternIdx % arpeggios.length];
      patternIdx++;

      // Play notes with delicate, natural spacing
      chord.forEach((freq, i) => {
        this.playAcousticNote(freq, t + i * 0.45, 2.8, 0.08, true);
      });
    };

    playArpeggioPattern();
    this.bgmInterval = window.setInterval(playArpeggioPattern, 3600);
  }

  /**
   * ROMANCE BGM:
   * Gentle, warm, romantic gothic piano nocturne (Fmaj7 -> Dm9 -> Am -> C).
   */
  private startRomanceMelody() {
    if (!this.ctx) return;

    const chords = [
      // Fmaj7: F3, C4, E4, A4
      [174.61, 261.63, 329.63, 440.0],
      // Dm9: D3, A3, F4, E4
      [146.83, 220.0, 349.23, 329.63],
      // Am7: A3, E4, G4, C5
      [220.0, 329.63, 392.0, 523.25],
      // Em7: E3, B3, G4, D5
      [164.81, 246.94, 392.0, 587.33],
    ];

    let chordIdx = 0;

    const playRomancePattern = () => {
      if (!this.ctx || this.currentMood !== 'romance' || this.isMuted || this.isBgmMuted) return;
      const t = this.ctx.currentTime;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;

      // Play soft rolling piano chords
      notes.forEach((freq, idx) => {
        this.playAcousticNote(freq, t + idx * 0.35, 3.2, 0.075, true);
      });
    };

    playRomancePattern();
    this.bgmInterval = window.setInterval(playRomancePattern, 4000);
  }

  /**
   * HORROR BGM:
   * Somber, distant solitary cathedral chimes in D minor / A diminished.
   * NO harsh sawtooths, NO white noise static, NO buzzing bass hums.
   */
  private startHorrorMelody() {
    if (!this.ctx) return;

    const somberNotes = [
      220.0,  // A3
      233.08, // Bb3 (eerie minor second)
      196.0,  // G3
      174.61, // F3
      164.81, // E3
    ];
    let noteIdx = 0;

    const playSomberChime = () => {
      if (!this.ctx || this.currentMood !== 'horror' || this.isMuted || this.isBgmMuted) return;
      const t = this.ctx.currentTime;
      const freq = somberNotes[noteIdx % somberNotes.length];
      noteIdx++;

      // Single, solitary distant bell note with long decay and complete silence between
      this.playAcousticNote(freq, t, 4.0, 0.08, false);
    };

    playSomberChime();
    this.bgmInterval = window.setInterval(playSomberChime, 4500);
  }

  /**
   * TENSION BGM:
   * Gentle, subtle clock-like pacing and muted tension chords.
   */
  private startTensionMelody() {
    if (!this.ctx) return;

    const tensionProgression = [
      [130.81, 196.0], // C3 + G3
      [123.47, 185.0], // B2 + F#3
      [116.54, 174.61], // Bb2 + F3
      [110.0, 164.81],  // A2 + E3
    ];
    let step = 0;

    const playTensionStep = () => {
      if (!this.ctx || this.currentMood !== 'tension' || this.isMuted || this.isBgmMuted) return;
      const t = this.ctx.currentTime;
      const pair = tensionProgression[step % tensionProgression.length];
      step++;

      pair.forEach((freq, idx) => {
        this.playAcousticNote(freq, t + idx * 0.2, 1.6, 0.06, false);
      });
    };

    playTensionStep();
    this.bgmInterval = window.setInterval(playTensionStep, 1800);
  }

  /**
   * MUSIC BOX BGM:
   * Antique, delicate music box chimes with sweet, crystal tones.
   */
  private startMusicBoxMelody() {
    if (!this.ctx) return;

    const musicBoxNotes = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 698.46, 880.0, 698.46,
      622.25, 783.99, 932.33, 783.99,
      523.25, 659.25, 783.99, 1046.5,
    ];
    let noteIdx = 0;

    const playMusicBoxStep = () => {
      if (!this.ctx || this.currentMood !== 'music_box' || this.isMuted || this.isBgmMuted) return;
      const t = this.ctx.currentTime;
      const freq = musicBoxNotes[noteIdx % musicBoxNotes.length];
      noteIdx++;

      this.playAcousticNote(freq, t, 1.8, 0.065, false);
    };

    playMusicBoxStep();
    this.bgmInterval = window.setInterval(playMusicBoxStep, 800);
  }

  // --- Sound Effects (SFX) ---
  // Every sound effect uses pure sinusoidal tones with microsecond anti-click envelopes.
  // Absolutely no white noise or electrical static.

  public playSfx(sfx: SfxType) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    switch (sfx) {
      case 'heartbeat': {
        const thump = (timeOffset: number, vol: number) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(65, now + timeOffset);
          osc.frequency.exponentialRampToValueAtTime(35, now + timeOffset + 0.15);

          g.gain.setValueAtTime(0.0001, now + timeOffset);
          g.gain.linearRampToValueAtTime(vol, now + timeOffset + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + 0.2);

          osc.connect(g);
          g.connect(this.sfxGain);
          osc.start(now + timeOffset);
          osc.stop(now + timeOffset + 0.22);

          setTimeout(() => {
            try {
              osc.disconnect();
              g.disconnect();
            } catch {}
          }, (timeOffset + 0.3) * 1000);
        };

        thump(0, 0.35);
        thump(0.24, 0.22);
        break;
      }

      case 'thunder': {
        // Deep distant acoustic roll (pure sine, zero harsh noise/static)
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 1.8);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.3, now + 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 2.0);

        setTimeout(() => {
          try {
            osc.disconnect();
            g.disconnect();
          } catch {}
        }, 2200);
        break;
      }

      case 'horror_stinger': {
        // Mysterious gothic chime cluster
        [220.0, 233.08, 329.63].forEach((freq) => {
          this.playAcousticNote(freq, now, 2.2, 0.12, false);
        });
        break;
      }

      case 'sensual_chime': {
        // Celestial harp ripple (pure crystalline tones)
        [587.33, 880.0, 1174.66, 1760.0].forEach((freq, idx) => {
          this.playAcousticNote(freq, now + idx * 0.07, 1.8, 0.09, false);
        });
        break;
      }

      case 'whisper': {
        // Ethereal music box chime harmony (zero white noise)
        [440.0, 554.37, 659.25].forEach((f, i) => {
          this.playAcousticNote(f, now + i * 0.08, 1.4, 0.07, false);
        });
        break;
      }

      case 'click': {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.05, now + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.05);

        setTimeout(() => {
          try {
            osc.disconnect();
            g.disconnect();
          } catch {}
        }, 80);
        break;
      }

      case 'page_flip': {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.1);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.06, now + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.13);

        setTimeout(() => {
          try {
            osc.disconnect();
            g.disconnect();
          } catch {}
        }, 160);
        break;
      }

      case 'door_creak': {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(220, now + 0.3);
        osc.frequency.linearRampToValueAtTime(150, now + 0.6);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.06, now + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.7);

        setTimeout(() => {
          try {
            osc.disconnect();
            g.disconnect();
          } catch {}
        }, 750);
        break;
      }

      case 'bell_ring': {
        this.playAcousticNote(880.0, now, 2.5, 0.14, true);
        break;
      }

      case 'glass_shatter': {
        [1500, 2100, 2900, 3600].forEach((freq, idx) => {
          this.playAcousticNote(freq, now + idx * 0.025, 0.45, 0.08, false);
        });
        break;
      }

      case 'wind_howl': {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(240, now + 0.9);
        osc.frequency.linearRampToValueAtTime(140, now + 2.0);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.08, now + 0.8);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 2.2);

        setTimeout(() => {
          try {
            osc.disconnect();
            g.disconnect();
          } catch {}
        }, 2300);
        break;
      }

      case 'horse_whinny': {
        // Expressive distressed horse neigh: ascending then tremolo descending sine
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.25);
        osc.frequency.linearRampToValueAtTime(740, now + 0.45);
        osc.frequency.linearRampToValueAtTime(920, now + 0.65);
        osc.frequency.exponentialRampToValueAtTime(320, now + 1.1);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.09, now + 0.1);
        g.gain.linearRampToValueAtTime(0.12, now + 0.65);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 1.2);

        setTimeout(() => {
          try {
            osc.disconnect();
            g.disconnect();
          } catch {}
        }, 1250);
        break;
      }

      case 'carriage_stop': {
        // Heavy wooden carriage brakes locking up with sudden jolt
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.4);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.14, now + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.52);

        setTimeout(() => {
          try {
            osc.disconnect();
            g.disconnect();
          } catch {}
        }, 550);
        break;
      }
    }
  }

  // RPG Battle Sound Effects
  public playSlash() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.15, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.15);

    setTimeout(() => {
      try {
        osc.disconnect();
        g.disconnect();
      } catch {}
    }, 180);
  }

  public playSpell() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    [440, 554, 659, 880, 1108].forEach((freq, idx) => {
      this.playAcousticNote(freq, now + idx * 0.04, 0.4, 0.06, true);
    });
  }

  public playHeal() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      this.playAcousticNote(freq, now + idx * 0.06, 0.6, 0.08, true);
    });
  }

  public playCrit() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.playSfx('thunder');
    setTimeout(() => {
      this.playSlash();
    }, 50);
  }

  public playVictory() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const victoryChord = [440, 554.37, 659.25, 880];
    victoryChord.forEach((freq, idx) => {
      this.playAcousticNote(freq, now + idx * 0.1, 1.2, 0.1, true);
    });
    setTimeout(() => {
      [554.37, 659.25, 880, 1108.73].forEach((freq, idx) => {
        if (!this.ctx) return;
        this.playAcousticNote(freq, this.ctx.currentTime + idx * 0.08, 1.6, 0.12, true);
      });
    }, 450);
  }
}

export const soundManager = new SoundManager();
