import { useRef } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useListPlantsStore } from "../store/list_plants_store";
import { Plant } from "../interface/plants";

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const removePlant = useListPlantsStore((state) => state.removePlant);
  const waterPlant = useListPlantsStore((state) => state.waterPlant);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const formatDate = (date: Date | null) => {
    if (!date) {
      return "Jamais arrosée";
    }
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleWater = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await waterPlant(plant.id);
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'enregistrer l'arrosage");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer la plante",
      `Êtes-vous sûr de vouloir supprimer ${plant.name} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await removePlant(plant.id);
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer la plante");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.plantCard}>
      {plant.imageUri ? (
        <Image source={{ uri: plant.imageUri }} style={styles.plantImage} />
      ) : (
        <View style={styles.plantImagePlaceholder}>
          <Text style={styles.plantImagePlaceholderText}>🌱</Text>
        </View>
      )}

      <View style={styles.plantInfo}>
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.frequencyText}>
          Arrosage tous les {plant.frequency} jours
        </Text>
        <Text style={styles.statusText}>
          Dernier arrosage : {formatDate(plant.lastWateredDate)}
        </Text>
      </View>

      <TouchableOpacity onPress={handleWater}>
        <Animated.View
          style={[styles.waterButton, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.waterButtonText}>💧</Text>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});