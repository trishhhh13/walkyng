//storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";
export class Storage {
  static instance: Storage;
  static startInstance = () => {
    Storage.instance = new Storage();
  };

  saveWalkData = async (coordinates: any[], cb: () => void) => {
    try {
      const existing = await AsyncStorage.getItem('walk_history');
      const history = existing ? JSON.parse(existing) : [];

      if (!coordinates || coordinates.length === 0) return;

      const walkData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        path: coordinates,
      };

      await AsyncStorage.setItem(
        "walk_history",
        JSON.stringify([walkData, ...history])
      );

      console.log("✅ Walk saved");
    } catch (err) {
      console.error("❌ Error saving walk:", err);
    }
    cb();
  }

  deleteWalkData = async (id: number, cb: (arg0: any) => void) => {
    try {
      const data = await AsyncStorage.getItem('walk_history');
      const history = data ? JSON.parse(data) : [];

      const updated = history.filter((walk: any) => walk.id !== id);

      await AsyncStorage.setItem('walk_history', JSON.stringify(updated));

      cb(updated)
      console.log(`🗑️ Walk ${id} deleted`);
    } catch (error) {
      console.error('❌ Error deleting walk:', error);
    }
  }
}

module.exports = {
  Storage,
};
