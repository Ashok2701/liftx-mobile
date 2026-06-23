import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import { Colors, Typography, Spacing } from '@/theme';
import { Card, Skeleton } from '@/components/common';
import { useNotifications, useMarkNotificationRead } from '@/hooks';

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data: notifData, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const NOTIF_ICONS: Record<string, string> = { MEMBERSHIP_EXPIRY:'⏰',PAYMENT_CONFIRMATION:'✅',WORKOUT_REMINDER:'💪',PT_REMINDER:'🏋️',DIET_UPDATE:'🥗',PROGRESS_UPDATE:'📊',ANNOUNCEMENT:'📢',SYSTEM:'⚙️' };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: Colors.text.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <FlatList data={notifData?.data ?? []} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => markRead(item.id)}>
            <Card style={[styles.card, !item.isRead && styles.unread]}>
              <View style={styles.row}>
                <View style={styles.iconBox}><Text style={{ fontSize: 22 }}>{NOTIF_ICONS[item.type] ?? '🔔'}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>{item.title}</Text>
                  <Text style={[Typography.bodySmall, { color: Colors.text.secondary, marginTop: 2 }]}>{item.body}</Text>
                  <Text style={[Typography.labelSmall, { color: Colors.text.muted, marginTop: 4 }]}>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</Text>
                </View>
                {!item.isRead && <View style={styles.dot} />}
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={isLoading ? <View style={{ padding: Spacing.base }}>{[1,2,3].map(i => <Skeleton key={i} height={80} style={{ marginBottom: Spacing.sm }} />)}</View> : <View style={{ alignItems:'center',padding:48 }}><Text style={{ fontSize:48 }}>🔔</Text><Text style={[Typography.bodyMedium,{color:Colors.text.secondary,marginTop:Spacing.base}]}>No notifications</Text></View>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, paddingTop: Spacing.xl, gap: Spacing.md },
  title: { ...Typography.headlineLarge, color: Colors.text.primary },
  list: { padding: Spacing.base, paddingBottom: 100 },
  card: { marginBottom: Spacing.sm },
  unread: { borderColor: Colors.brand.primary, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  iconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.background.elevated, justifyContent: 'center', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.brand.primary, marginTop: 4 },
});
