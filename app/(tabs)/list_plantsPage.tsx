import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useListPlantsStore } from "../../store/list_plants_store";
import { Plant } from "../../interface/plants";

export default function ListPlantsPage() {
  const plants = useListPlantsStore(useShallow((state) => state.plants));
  const removePlant = useListPlantsStore((state) => state.removePlant);
  const waterPlant = useListPlantsStore((state) => state.waterPlant);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderPlant = ({ item }: { item: Plant }) => {
    return (
      <View style={styles.plantCard}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.plantImage} />
        ) : (
          <View style={styles.plantImagePlaceholder}>
            <Text style={styles.plantImagePlaceholderText}>🌱</Text>
          </View>
        )}

        <View style={styles.plantInfo}>
          <Text style={styles.plantName}>{item.name}</Text>
          <Text style={styles.frequencyText}>
            Arrosage tous les {item.frequency} jours
          </Text>
          <Text style={styles.statusText}>
            Dernier arrosage : {formatDate(item.lastWateredDate)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.waterButton}
          onPress={() => waterPlant(item.id)}
        >
          <Text style={styles.waterButtonText}>💧</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              "Supprimer la plante",
              `Êtes-vous sûr de vouloir supprimer ${item.name} ?`,
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Supprimer",
                  style: "destructive",
                  onPress: () => removePlant(item.id),
                },
              ]
            );
          }}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (plants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🪴</Text>
        <Text style={styles.emptyTitle}>Aucune plante</Text>
        <Text style={styles.emptySubtitle}>
          Ajoutez votre première plante pour commencer !
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Plantes</Text>
      <Text style={styles.subtitle}>{plants.length} plante(s)</Text>
      <FlatList
        data={plants}
        renderItem={renderPlant}
        keyExtractor={(item) => item.id}
        extraData={plants}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d5a27",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  listContent: {
    padding: 16,
  },
  plantCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  plantImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
  },
  plantImagePlaceholderText: {
    fontSize: 28,
  },
  plantInfo: {
    flex: 1,
    marginLeft: 16,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  frequencyText: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  statusText: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  waterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  waterButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffebee",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#f44336",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
