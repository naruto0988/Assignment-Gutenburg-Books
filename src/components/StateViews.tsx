import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

export const LoadingView = ({ message }: { message: string }) => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
    <Text style={styles.title}>{message}</Text>
  </View>
);

interface ErrorViewProps {
  title: string;
  message: string;
  retryLabel: string;
  onRetry: () => void;
}

export const ErrorView = ({ title, message, retryLabel, onRetry }: ErrorViewProps) => (
  <View style={styles.centered}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
      <Text style={styles.retryText}>{retryLabel}</Text>
    </Pressable>
  </View>
);

export const EmptyView = ({ title, message }: { title: string; message: string }) => (
  <View style={styles.centered}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  title: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  message: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.body,
    color: theme.colors.mutedText,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    minHeight: 44,
    minWidth: 112,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
  },
  retryText: {
    fontFamily: theme.fonts.semibold,
    fontSize: theme.typography.body,
    color: theme.colors.surfaceStrong,
  },
});
