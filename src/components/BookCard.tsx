import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Book } from '../models/types';
import { theme } from '../theme';

interface BookCardProps {
  book: Book;
  onPress?: (book: Book) => void;
}

export const BookCard = ({ book, onPress }: BookCardProps) => {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(book)}>
      <View style={styles.cover}>
        <Text style={styles.coverText}>{book.title.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        {book.subjects.length > 0 ? (
          <Text style={styles.subjects} numberOfLines={2}>{book.subjects.slice(0, 2).join(' • ')}</Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cover: {
    width: 56,
    height: 76,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  coverText: {
    fontSize: theme.typography.title,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.title,
    color: theme.colors.text,
    fontWeight: '600',
  },
  author: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.body,
    color: theme.colors.mutedText,
  },
  subjects: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
  },
});
