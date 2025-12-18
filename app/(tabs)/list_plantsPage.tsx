import { SectionList, StyleSheet, Text, View } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useListPlantsStore } from "../../store/list_plants_store";
import { Plant } from "../../interface/plants";
import PlantCard from "../../components/plant-card";

type PlantStatus = "late" | "soon" | "ok";

const getPlantStatus = (plant: Plant): PlantStatus => {
  if (!plant.lastWateredDate) {
    return "late"; // Jamais arrosée = en retard
  }

  const lastWatered = new Date(plant.lastWateredDate);
  const now = new Date();
  const diffTime = now.getTime() - lastWatered.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= plant.frequency) {
    return "late"; // En retard
  } else if (diffDays >= plant.frequency - 2) {
    return "soon"; // À arroser bientôt (dans les 2 prochains jours)
  }
  return "ok"; // Arrosée récemment
};

export default function ListPlantsPage() {
  const plants = useListPlantsStore(useShallow((state) => state.plants));

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

  const latePlants = plants.filter((p) => getPlantStatus(p) === "late");
  const soonPlants = plants.filter((p) => getPlantStatus(p) === "soon");
  const okPlants = plants.filter((p) => getPlantStatus(p) === "ok");

  const sections = [
    { title: "🚨 En retard", data: latePlants },
    { title: "⏰ À arroser bientôt", data: soonPlants },
    { title: "✅ Arrosées", data: okPlants },
  ].filter((section) => section.data.length > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Plantes</Text>
      <Text style={styles.subtitle}>{plants.length} plante(s)</Text>
      <SectionList
        sections={sections}
        renderItem={({ item }) => <PlantCard plant={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    marginTop: 8,
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