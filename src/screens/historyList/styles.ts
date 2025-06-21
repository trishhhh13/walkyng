import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  recordButton: {
    backgroundColor: 'purple',
    padding: 10,
    position: 'absolute',
    borderRadius: 50,
    alignItems: 'center',
    bottom: 50,
    right: 24,
    zIndex: 4
  },
  recordText: {
    color: 'white',
    fontWeight: 'bold',
  },

  walkItem: {
    marginBottom: 10,
    backgroundColor: "#222",
    borderColor: "ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  walkText: {
    color: "#fff",
  },

  walksList: { padding: 20 },
    emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: "black"
  },
  emptyText: {
    color: 'gray',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  emptySubText: {
    color: 'gray',
    fontSize: 14,
    marginTop: 4,
  },
});