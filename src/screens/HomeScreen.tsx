import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../navigation/AppNavigator';
import { BookCategory } from '../models/types';
import { defaultLocale, getCategoryLabel, getText } from '../i18n';
import { theme } from '../theme';

const categories: BookCategory[] = ['fiction', 'drama', 'humor', 'politics', 'philosophy', 'history', 'adventure'];

const categoryIcons: Record<BookCategory, keyof typeof MaterialIcons.glyphMap> = {
  all: 'radio-button-checked',
  fiction: 'menu-book',
  drama: 'theater-comedy',
  humor: 'sentiment-very-satisfied',
  politics: 'gavel',
  philosophy: 'psychology',
  history: 'history-edu',
  adventure: 'explore',
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleCategoryPress = (category: BookCategory) => {
    navigation.navigate('Books', { category });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundPattern} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{getText('homeTitle', defaultLocale)}</Text>
        <Text style={styles.subtitle}>{getText('homeSubtitle', defaultLocale)}</Text>

        <View style={styles.buttonsWrap}>
          {categories.map((category) => (
            <Pressable
              key={category}
              accessibilityRole="button"
              accessibilityLabel={getCategoryLabel(category, defaultLocale)}
              style={({ pressed }) => [
                styles.categoryButton,
                pressed && styles.categoryButtonPressed,
              ]}
              onPress={() => handleCategoryPress(category)}
            >
              <View style={styles.buttonLeft}>
                <View style={styles.iconBadge}>
                  <MaterialIcons name={categoryIcons[category]} size={22} color={theme.colors.primary} />
                </View>
                <Text style={styles.categoryText}>{getCategoryLabel(category, defaultLocale).toUpperCase()}</Text>
              </View>

              <MaterialIcons name="arrow-forward-ios" size={18} color={theme.colors.primary} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundPattern: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.25,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontFamily: theme.fonts.semibold,
    fontSize: theme.typography.heading,
    lineHeight: 52,
    color: theme.colors.primary,
    marginBottom: 18,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: theme.fonts.semibold,
    fontSize: theme.typography.body,
    lineHeight: 24,
    color: theme.colors.subtitle,
    maxWidth: 360,
    marginBottom: 28,
  },
  buttonsWrap: {
    gap: 12,
  },
  categoryButton: {
    backgroundColor: theme.colors.cardSurface,
    borderRadius: theme.radius.xs,
    paddingVertical: 0,
    paddingHorizontal: 10,
    height: 60,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryButtonPressed: {
    opacity: 0.9,
    backgroundColor: theme.colors.surfaceAlt,
    height: 50,
  },
  buttonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryText: {
    fontFamily: theme.fonts.semibold,
    fontSize: theme.typography.genre,
    color: theme.colors.text,
    letterSpacing: 0.2,
  },
});
