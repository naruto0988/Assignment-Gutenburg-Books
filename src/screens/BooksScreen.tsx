import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, Linking, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { useDebounce } from '../hooks/useDebounce';
import { BooksScreenRouteProp, RootStackParamList } from '../navigation/AppNavigator';
import { Book } from '../models/types';
import { defaultLocale, getCategoryLabel, getText } from '../i18n';
import { useBooksStore } from '../store/booksStore';
import { theme } from '../theme';
import { getGridLayout } from '../utils/layoutUtils';

const BookGridItem = React.memo(({ item, cardWidth }: { item: Book; cardWidth: number }) => {
  const handleOpen = useCallback(async () => {
    const url = item.previewUrl;

    if (!url) {
      Alert.alert(getText('errorTitle', defaultLocale), getText('noViewableVersion', defaultLocale));
      return;
    }

    try {
      const parsedUrl = new URL(url);
      const isGutenbergHost = parsedUrl.hostname === 'gutenberg.org' || parsedUrl.hostname.endsWith('.gutenberg.org');
      if (parsedUrl.protocol !== 'https:' || !isGutenbergHost) {
        throw new Error('Unsupported book URL protocol');
      }

      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        throw new Error('Unsupported book URL');
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert(getText('errorTitle', defaultLocale), getText('noViewableVersion', defaultLocale));
    }
  }, [item.previewUrl]);

  const imageUri = item.coverUrl ?? undefined;

  return (
    <Pressable style={[styles.card, { width: cardWidth }]} onPress={handleOpen}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={[styles.coverImage, { width: cardWidth, height: cardWidth * 1.42 }]} resizeMode="cover" />
      ) : (
        <View style={[styles.coverFallback, { width: cardWidth, height: cardWidth * 1.42 }]}>
          <Text style={styles.coverFallbackText}>{item.title.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.author} numberOfLines={1}>{item.author || getText('unknownAuthor', defaultLocale)}</Text>
    </Pressable>
  );
});

BookGridItem.displayName = 'BookGridItem';

type BooksScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Books'>;

export const BooksScreen = () => {
  const navigation = useNavigation<BooksScreenNavigationProp>();
  const route = useRoute<BooksScreenRouteProp>();
  const category = route.params.category;
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 350);
  const { width: viewportWidth } = useWindowDimensions();
  const { columns, cardWidth } = getGridLayout(viewportWidth, theme.spacing.lg * 2);

  const { books, isLoading, isLoadingMore, error, hasMore, loadBooks, loadMore, cancelPending, setSelectedCategory, setSearchTerm } =
    useBooksStore();

  useEffect(() => {
    setSelectedCategory(category);
  }, [category, setSelectedCategory]);

  useEffect(() => {
    setSearchTerm(debouncedQuery);
    void loadBooks(1, true, category, debouncedQuery);
    return cancelPending;
  }, [category, debouncedQuery, loadBooks, setSearchTerm, cancelPending]);

  const footerLabel = useMemo(() => {
    if (isLoadingMore) return getText('loadingMore', defaultLocale);
    if (!hasMore) return getText('noMore', defaultLocale);
    return getText('scrollMore', defaultLocale);
  }, [hasMore, isLoadingMore]);

  const renderItem = useCallback(({ item }: { item: Book }) => <BookGridItem item={item} cardWidth={cardWidth} />, [cardWidth]);
  const keyExtractor = useCallback((item: Book) => String(item.id), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={theme.colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{getCategoryLabel(category, defaultLocale)}</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.searchWrap}>
          <MaterialIcons name="search" size={21} color={theme.colors.mutedText} style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={getText('searchPlaceholder', defaultLocale)}
            placeholderTextColor={theme.colors.mutedText}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')}>
              <Text style={styles.clearText}>×</Text>
            </Pressable>
          ) : null}
        </View>

        {isLoading && books.length === 0 ? (
          <LoadingView message={getText('loading', defaultLocale)} />
        ) : error && books.length === 0 ? (
          <ErrorView
            title={getText('errorTitle', defaultLocale)}
            message={getText('requestFailed', defaultLocale)}
            retryLabel={getText('retry', defaultLocale)}
            onRetry={() => void loadBooks(1, true, category, debouncedQuery)}
          />
        ) : books.length === 0 ? (
          <EmptyView title={getText('emptyTitle', defaultLocale)} message={getText('emptyMessage', defaultLocale)} />
        ) : (
          <FlatList
            data={books}
            key={`book-grid-${columns}`}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={columns}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={columns * 3}
            maxToRenderPerBatch={columns * 3}
            windowSize={7}
            removeClippedSubviews
            updateCellsBatchingPeriod={50}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={
              <View style={styles.footerContainer}>
                {error ? (
                  <Pressable accessibilityRole="button" onPress={() => void loadMore()}>
                    <Text style={styles.retryFooterText}>{getText('retry', defaultLocale)}</Text>
                  </Pressable>
                ) : (
                  <Text style={styles.footerText}>{footerLabel}</Text>
                )}
              </View>
            }
          />
        )}
      </View>

      {error ? <Text style={styles.errorText}>{getText('requestFailed', defaultLocale)}</Text> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 15,
    paddingBottom: 12,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'left',
    fontFamily: theme.fonts.semibold,
    fontSize: 30,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 18,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.input,
    borderRadius: theme.radius.xs,
    height: 48,
    paddingHorizontal: 10,
    marginBottom: 18,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingVertical: 0,
    textAlignVertical: 'center',
    fontFamily: theme.fonts.regular,
    fontSize: theme.typography.search,
    color: theme.colors.text,
  },
  clearText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.typography.heading2,
    color: theme.colors.mutedText,
    paddingLeft: theme.spacing.sm,
  },
  listContent: {
    paddingBottom: 18,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  card: {
    alignItems: 'flex-start',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  coverImage: {
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primarySoft,
  },
  coverFallback: {
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverFallbackText: {
    fontFamily: theme.fonts.bold,
    fontSize: 32,
    color: theme.colors.primary,
  },
  title: {
    marginTop: 8,
    fontFamily: theme.fonts.semibold,
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'left',
    width: '100%',
    lineHeight: 16,
  },
  author: {
    marginTop: 2,
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.mutedText,
    textAlign: 'left',
    width: '100%',
    lineHeight: 15,
  },
  footerContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.mutedText,
    fontSize: 16,
    fontFamily: theme.fonts.semibold,
  },
  retryFooterText: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.primary,
    fontSize: theme.typography.body,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
});
