import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { crops, cropTypes, Crop, CropType } from "@/data/crops";

const { width: SCREEN_W } = Dimensions.get("window");
const GRID_COLUMNS = 2;
const CARD_GAP = 12;
const PADDING = 16;
const CARD_WIDTH = (SCREEN_W - PADDING * 2 - CARD_GAP) / GRID_COLUMNS;

export default function BuyerHomeScreen() {
  const { top } = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<CropType | "All">("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [isGridView, setIsGridView] = useState(true);

  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const q = search.toLowerCase();
      const matchesSearch =
        crop.name.toLowerCase().includes(q) ||
        crop.farmer.toLowerCase().includes(q) ||
        crop.location.toLowerCase().includes(q);
      const matchesType = selectedType === "All" || crop.type === selectedType;
      const matchesAvail =
        selectedAvailability === "All" || crop.availability === selectedAvailability;
      return matchesSearch && matchesType && matchesAvail;
    });
  }, [search, selectedType, selectedAvailability]);

  const availColor = (a: string) => {
    if (a === "In Stock") return "#22C55E";
    if (a === "Limited") return "#F59E0B";
    return Colors.primary;
  };

  const header = (
    <>
      {/* Header */}
      <View style={[styles.header, { paddingTop: top + 8 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MS</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.name}>Maria</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.cartBtn}>
          <Ionicons name="cart-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.search}>
          <Ionicons name="search" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crops, farmers..."
            placeholderTextColor={Colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {["All", ...cropTypes].map((t) => (
          <TouchableOpacity
            key={t}
            activeOpacity={0.7}
            style={[styles.chip, selectedType === t && styles.chipActive]}
            onPress={() => setSelectedType(t as CropType | "All")}
          >
            <Text style={[styles.chipText, selectedType === t && styles.chipActiveText]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Availability Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {["All", "In Stock", "Limited", "Pre-order"].map((a) => (
          <TouchableOpacity
            key={a}
            activeOpacity={0.7}
            style={[styles.chip, selectedAvailability === a && styles.chipActive]}
            onPress={() => setSelectedAvailability(a)}
          >
            <Text style={[styles.chipText, selectedAvailability === a && styles.chipActiveText]}>
              {a}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <Text style={styles.resultCount}>
          {filteredCrops.length} crop{filteredCrops.length !== 1 ? "s" : ""}
        </Text>
        <View style={styles.toggles}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.toggle, isGridView && styles.toggleActive]}
            onPress={() => setIsGridView(true)}
          >
            <Ionicons name="grid" size={15} color={isGridView ? Colors.white : Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.toggle, !isGridView && styles.toggleActive]}
            onPress={() => setIsGridView(false)}
          >
            <Ionicons name="list" size={15} color={!isGridView ? Colors.white : Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderGrid = ({ item }: { item: Crop }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.gridCard}
      onPress={() => router.push(`/(buyer)/item?id=${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.gridImg} />
      <View style={styles.gridBody}>
        <View style={styles.availRow}>
          <View style={[styles.dot, { backgroundColor: availColor(item.availability) }]} />
          <Text style={styles.availText}>{item.availability}</Text>
        </View>
        <Text style={styles.cropName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cropLoc}>{item.location}</Text>
        <Text style={styles.cropPrice}>₱{item.price}<Text style={styles.cropUnit}> / {item.unit}</Text></Text>
      </View>
    </TouchableOpacity>
  );

  const renderList = ({ item }: { item: Crop }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.listCard}
      onPress={() => router.push(`/(buyer)/item?id=${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.listImg} />
      <View style={styles.listBody}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cropName}>{item.name}</Text>
          <Text style={styles.cropLoc}>{item.location} · {item.farmer}</Text>
        </View>
        <View style={styles.listMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="cube-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.metaText}>{item.quantity}</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.metaText}>
              {new Date(item.harvestDate).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
            </Text>
          </View>
        </View>
        <View style={styles.listBottom}>
          <Text style={styles.cropPrice}>₱{item.price}<Text style={styles.cropUnit}>/{item.unit}</Text></Text>
          <View style={styles.availRow}>
            <View style={[styles.dot, { backgroundColor: availColor(item.availability) }]} />
            <Text style={styles.availText}>{item.availability}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
      <StatusBar barStyle="dark-content" />
      {isGridView ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {header}
          {filteredCrops.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyCircle}>
                <Ionicons name="leaf-outline" size={28} color={Colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No crops found</Text>
              <Text style={styles.emptyDesc}>Try a different search or filter</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filteredCrops.map((item) => (
                <View key={item.id}>{renderGrid({ item })}</View>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {header}
          {filteredCrops.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyCircle}>
                <Ionicons name="leaf-outline" size={28} color={Colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No crops found</Text>
              <Text style={styles.emptyDesc}>Try a different search or filter</Text>
            </View>
          ) : (
            <View style={styles.listWrap}>
              {filteredCrops.map((item) => (
                <View key={item.id}>{renderList({ item })}</View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

    </View>
  );
}

const styles = {
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  greeting: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  name: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  badge: {
    position: "absolute" as const,
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  searchWrap: {
    paddingHorizontal: PADDING,
    marginBottom: 10,
  },
  search: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  chipRow: {
    paddingHorizontal: PADDING,
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  chipActiveText: {
    color: Colors.white,
  },
  toolbar: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    paddingVertical: 8,
  },
  resultCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  toggles: {
    flexDirection: "row" as const,
    gap: 4,
  },
  toggle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  grid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    paddingHorizontal: PADDING,
    gap: CARD_GAP,
  },
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: "hidden" as const,
  },
  gridImg: {
    width: "100%",
    height: 100,
    backgroundColor: Colors.surfaceAlt,
  },
  gridBody: {
    padding: 10,
  },
  availRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 5,
    marginBottom: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  cropName: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  cropLoc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  cropPrice: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: Colors.primary,
  },
  cropUnit: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: Colors.textMuted,
  },
  listWrap: {
    paddingHorizontal: PADDING,
    gap: 10,
  },
  listCard: {
    flexDirection: "row" as const,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: "hidden" as const,
  },
  listImg: {
    width: 90,
    backgroundColor: Colors.surfaceAlt,
  },
  listBody: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between" as const,
  },
  listMeta: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginTop: 6,
  },
  metaItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 3,
  },
  metaText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.border,
  },
  listBottom: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginTop: 6,
  },
  empty: {
    alignItems: "center" as const,
    paddingTop: 60,
  },
  emptyCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textMuted,
  },
};
