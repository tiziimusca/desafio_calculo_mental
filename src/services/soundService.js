import { Audio } from 'expo-av';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
  }

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      try {
        const local = require('../assets/sounds/correcto.mp3');
        await this.loadSound('correct', local);
      } catch (e) {}

      try {
        const local = require('../assets/sounds/incorrecto.mp3');
        await this.loadSound('incorrect', local);
      } catch (e) {}

    } catch (error) {
      console.error('Error con el audio:', error);
    }
  }

  async loadSound(key, uri) {
    try {
      const { sound } = await Audio.Sound.createAsync(uri);
      try {
        await sound.setVolumeAsync(1.0);
        await sound.setPositionAsync(0);
      } catch (e) {}
      this.sounds[key] = sound;
    } catch (error) {
      this.sounds[key] = {
        playAsync: async () => {},
        replayAsync: async () => {},
        stopAsync: async () => {},
        unloadAsync: async () => {},
        setPositionAsync: async () => {},
        setVolumeAsync: async () => {},
      };
    }
  }

  async playSound(key) {
    if (!this.isEnabled || !this.sounds[key]) {
      return;
    }
    try {
      const s = this.sounds[key];
      if (typeof s.stopAsync === 'function') {
        try { await s.stopAsync(); } catch (e) {}
      }
      if (typeof s.setPositionAsync === 'function') {
        try { await s.setPositionAsync(0); } catch (e) {}
      }
      if (typeof s.setVolumeAsync === 'function') {
        try { await s.setVolumeAsync(1.0); } catch (e) {}
      }

      if (typeof s.playAsync === 'function') {
        await s.playAsync();
      } else if (typeof s.replayAsync === 'function') {
        await s.replayAsync();
      }
    } catch (error) {
      console.error('Error con el sonido:', error);
    }
  }

  async playCorrectSound() {
    if (!this.isEnabled) return;
    try {
      await this.playSound('correct');
    } catch (error) {
      console.error('Error con el sonido:', error);
    }
  }

  async playIncorrectSound() {
    if (!this.isEnabled) return;
    try {
      await this.playSound('incorrect');
    } catch (error) {
      console.error('Error con el sonido:', error);
    }
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  async cleanup() {
    for (const key in this.sounds) {
      try {
        await this.sounds[key].unloadAsync();
      } catch (error) {
        console.error('Error con audio:', error);
      }
    }
    this.sounds = {};
  }
}

export default new SoundManager();
