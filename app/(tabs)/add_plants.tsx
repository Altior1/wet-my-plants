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
  Image,
} from "react-native";
import * as Crypto from "expo-crypto";
import * as ImagePicker from "expo-image-picker";
import { useListPlantsStore } from "../../store/list_plants_store";

export default function AddPlantsPage() {
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [frequency, setFrequency] = useState("");

  const addPlant = useListPlantsStore((state) => state.addPlant);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Nous avons besoin de votre permission pour accéder à la galerie."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Nous avons besoin de votre permission pour accéder à la caméra."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert("Ajouter une photo", "Choisissez une option", [
      { text: "Prendre une photo", onPress: takePhoto },
      { text: "Choisir depuis la galerie", onPress: pickImage },
      { text: "Annuler", style: "cancel" },
    ]);
  };

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
      lastWateredDate: null,
      imageUri: imageUri || undefined,
      frequency: Number(frequency),
    };

    addPlant(newPlant);

    // Reset form
    setName("");
    setImageUri(null);
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
          <Text style={styles.label}>Photo (optionnel)</Text>
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={showImageOptions}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>+ Ajouter une photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {imageUri && (
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImageUri(null)}
            >
              <Text style={styles.removeImageText}>Supprimer la photo</Text>
            </TouchableOpacity>
          )}
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
  imagePickerButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#999",
    fontSize: 16,
  },
  removeImageButton: {
    marginTop: 10,
    alignItems: "center",
  },
  removeImageText: {
    color: "#e74c3c",
    fontSize: 14,
  },
});