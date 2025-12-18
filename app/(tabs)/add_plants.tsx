import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Crypto from "expo-crypto";
import { useListPlantsStore } from "../../store/list_plants_store";

export default function AddPlantsPage() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [frequency, setFrequency] = useState("");

  const addPlant = useListPlantsStore((state) => state.addPlant);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom de la plante est requis");
      return;
    }

    if (!frequency || isNaN(Number(frequency)) || Number(frequency) <= 0) {
      Alert.alert("Erreur", "La fréquence d'arrosage doit être un nombre positif");
      return;
    }

    const newPlant = {
      id: Crypto.randomUUID(),
      name: name.trim(),
      lastWateredDate: new Date(),
      imageUrl: imageUrl.trim() || undefined,
      frequency: Number(frequency),
    };

    addPlant(newPlant);

    // Reset form
    setName("");
    setImageUrl("");
    setFrequency("");

    Alert.alert("Succès", `${newPlant.name} a été ajoutée à votre liste !`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Ajouter une plante</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom de la plante *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Monstera"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>URL de l'image (optionnel)</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://exemple.com/image.jpg"
            placeholderTextColor="#999"
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fréquence d'arrosage (en jours) *</Text>
          <TextInput
            style={styles.input}
            value={frequency}
            onChangeText={setFrequency}
            placeholder="Ex: 7"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Ajouter la plante</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d5a27",
    marginBottom: 30,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});