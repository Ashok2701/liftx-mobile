import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { format } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Card, Button, SectionHeader, Input, Skeleton, Badge } from '@/components/common';
import { useBodyMeasurements, useAddBodyMeasurement, useProgressPhotos } from '@/hooks';

type Tab = 'weight' | 'measurements' | 'photos';

export const ProgressScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('weight');
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { data: measurements, isLoading: measLoading } = useBodyMeasurements();
  const { data: photos } = useProgressPhotos();
  const { mutateAsync: addMeasurement, isPending: adding } = useAddBodyMeasurement();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { weight: '', bodyFat: '', chest: '', waist: '', hips: '', bicepLeft: '', bicepRight: '', thighLeft: '', notes: '' },
  });

  const onAddMeasurement = async (data: any) => {
    const payload: any = { date: new Date().toISOString().split('T')[0], notes: data.notes };
    ['weight','bodyFat','chest','waist','hips','bicepLeft','bicepRight','thighLeft'].forEach(k => {
      if (data[k]) payload[k] = parseFloat(data[k]);
    });
    await addMeasurement(payload);
    Toast.show({ type: 'success', text1: 'Measurement saved!' });
    reset();
    setShowForm(false);
  };

  const onUploadPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Toast.show({ type: 'error', text1: 'Permission denied' }); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (result.canceled) return;
    setUploading(true);
    setTimeout(() => { setUploading(false); Toast.show({ type: 'success', text1: 'Photo saved!' }); }, 1000);
  };

  const weightData = measurements?.filter(m => m.weight).slice(-6) ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
        <View style={styles.tabs}>
          {(['weight','measurements','photos'] as Tab[]).map(tab => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab.charAt(0).toUpperCase()+tab.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'weight' && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Weight trend - simple bars instead of chart (no native SVG needed) */}
          <Card style={{ marginBottom: Spacing.base }}>
            <Text style={[Typography.headlineSmall, { color: Colors.text.primary, marginBottom: Spacing.base }]}>Weight trend (kg)</Text>
            {weightData.length > 0 ? (
              <View>
                {weightData.map((m, i) => {
                  const max = Math.max(...weightData.map(d => d.weight ?? 0));
                  const min = Math.min(...weightData.map(d => d.weight ?? 0));
                  const pct = max === min ? 1 : ((m.weight! - min) / (max - min));
                  return (
                    <View key={m.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
                      <Text style={[Typography.labelSmall, { color: Colors.text.muted, width: 50 }]}>
                        {format(new Date(m.date), 'MMM d')}
                      </Text>
                      <View style={{ flex: 1, height: 24, backgroundColor: Colors.background.elevated, borderRadius: BorderRadius.sm, overflow: 'hidden', marginHorizontal: Spacing.sm }}>
                        <View style={{ width: `${Math.max(10, pct * 100)}%`, height: '100%', backgroundColor: Colors.brand.primary, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 6 }}>
                        </View>
                      </View>
                      <Text style={[Typography.labelMedium, { color: Colors.text.primary, width: 50, textAlign: 'right' }]}>{m.weight}kg</Text>
                    </View>
                  );
                })}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border.default }}>
                  <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
                    Start: {weightData[0]?.weight}kg
                  </Text>
                  <Text style={[Typography.bodySmall, { color: Colors.success.default }]}>
                    Lost: {((weightData[0]?.weight ?? 0) - (weightData[weightData.length-1]?.weight ?? 0)).toFixed(1)}kg
                  </Text>
                  <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
                    Now: {weightData[weightData.length-1]?.weight}kg
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: Spacing.xl }}>
                <Text style={{ fontSize: 32, marginBottom: Spacing.sm }}>📊</Text>
                <Text style={[Typography.bodyMedium, { color: Colors.text.secondary }]}>Log measurements to see your trend</Text>
              </View>
            )}
          </Card>

          {measurements && measurements.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.base }}>
              {[
                { label: 'Weight', value: measurements[0].weight, unit: 'kg' },
                { label: 'Body fat', value: measurements[0].bodyFat, unit: '%' },
                { label: 'Chest', value: measurements[0].chest, unit: 'cm' },
                { label: 'Waist', value: measurements[0].waist, unit: 'cm' },
              ].filter(s => s.value).map(s => (
                <Card key={s.label} style={{ width: '47%', alignItems: 'center', paddingVertical: Spacing.lg }}>
                  <Text style={[Typography.statSmall, { color: Colors.brand.primary }]}>{s.value}<Text style={[Typography.labelSmall, { color: Colors.text.muted }]}> {s.unit}</Text></Text>
                  <Text style={[Typography.labelSmall, { color: Colors.text.secondary }]}>{s.label}</Text>
                </Card>
              ))}
            </View>
          )}
          <Button title="+ Log measurement" onPress={() => setShowForm(true)} variant="ghost" />

          <SectionHeader title="History" />
          {measLoading ? [1,2,3].map(i => <Skeleton key={i} height={70} style={{ marginBottom: Spacing.sm }} />) :
            measurements?.map(m => (
              <Card key={m.id} style={{ marginBottom: Spacing.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[Typography.labelMedium, { color: Colors.text.secondary }]}>{format(new Date(m.date), 'MMM d, yyyy')}</Text>
                  {m.weight && <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>{m.weight} kg</Text>}
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.xs }}>
                  {m.chest && <Badge label={`Chest: ${m.chest}cm`} variant="neutral" size="sm" />}
                  {m.waist && <Badge label={`Waist: ${m.waist}cm`} variant="neutral" size="sm" />}
                  {m.bodyFat && <Badge label={`BF: ${m.bodyFat}%`} variant="brand" size="sm" />}
                </View>
              </Card>
            ))
          }
        </ScrollView>
      )}

      {activeTab === 'measurements' && (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Button title="+ Add measurements" onPress={() => setShowForm(true)} style={{ marginBottom: Spacing.base }} />
          {measLoading ? [1,2,3].map(i => <Skeleton key={i} height={100} style={{ marginBottom: Spacing.sm }} />) :
            measurements?.map(m => (
              <Card key={m.id} style={{ marginBottom: Spacing.sm }}>
                <Text style={[Typography.labelMedium, { color: Colors.text.secondary, marginBottom: Spacing.sm }]}>{format(new Date(m.date), 'MMMM d, yyyy')}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                  {[
                    { k: 'weight', l: 'Weight', u: 'kg', v: m.weight },
                    { k: 'bodyFat', l: 'Body fat', u: '%', v: m.bodyFat },
                    { k: 'chest', l: 'Chest', u: 'cm', v: m.chest },
                    { k: 'waist', l: 'Waist', u: 'cm', v: m.waist },
                    { k: 'hips', l: 'Hips', u: 'cm', v: m.hips },
                    { k: 'bicepLeft', l: 'Bicep L', u: 'cm', v: m.bicepLeft },
                  ].filter(s => s.v).map(s => (
                    <View key={s.k} style={{ width: '30%', padding: Spacing.sm, backgroundColor: Colors.background.elevated, borderRadius: BorderRadius.md, alignItems: 'center' }}>
                      <Text style={[Typography.statSmall, { color: Colors.text.primary }]}>{s.v}<Text style={[Typography.labelSmall, { color: Colors.text.muted }]}> {s.u}</Text></Text>
                      <Text style={[Typography.labelSmall, { color: Colors.text.secondary }]}>{s.l}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            ))
          }
        </ScrollView>
      )}

      {activeTab === 'photos' && (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Button title={uploading ? 'Uploading...' : '+ Upload photo'} onPress={onUploadPhoto} loading={uploading} style={{ marginBottom: Spacing.base }} />
          <View style={{ alignItems: 'center', padding: Spacing['3xl'] }}>
            <Text style={{ fontSize: 48 }}>📸</Text>
            <Text style={[Typography.headlineSmall, { color: Colors.text.primary, marginTop: Spacing.base }]}>Track your transformation</Text>
            <Text style={[Typography.bodyMedium, { color: Colors.text.secondary, textAlign: 'center', marginTop: Spacing.sm }]}>Upload before/after photos to see your progress</Text>
          </View>
        </ScrollView>
      )}

      <Modal visible={showForm} animationType="slide" transparent onRequestClose={() => setShowForm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={[Typography.headlineMedium, { color: Colors.text.primary, marginBottom: Spacing.xl }]}>Log measurements</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Controller control={control} name="weight" render={({ field: { onChange, value } }) => <Input label="Weight (kg)" placeholder="e.g. 75.5" value={value} onChangeText={onChange} keyboardType="numeric" />} />
              <Controller control={control} name="bodyFat" render={({ field: { onChange, value } }) => <Input label="Body fat (%)" placeholder="e.g. 18.5" value={value} onChangeText={onChange} keyboardType="numeric" />} />
              {['chest', 'waist', 'hips', 'bicepLeft', 'bicepRight', 'thighLeft'].map(f => (
                <Controller key={f} control={control} name={f as any} render={({ field: { onChange, value } }) =>
                  <Input label={f.charAt(0).toUpperCase() + f.slice(1).replace(/([A-Z])/g, ' $1') + ' (cm)'} placeholder="cm" value={value} onChangeText={onChange} keyboardType="numeric" />
                } />
              ))}
              <Controller control={control} name="notes" render={({ field: { onChange, value } }) => <Input label="Notes" placeholder="How are you feeling?" value={value} onChangeText={onChange} multiline numberOfLines={3} />} />
              <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
                <Button title="Cancel" onPress={() => setShowForm(false)} variant="ghost" style={{ flex: 1 }} />
                <Button title="Save" onPress={handleSubmit(onAddMeasurement)} loading={adding} style={{ flex: 1 }} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['5xl'] },
  header: { padding: Spacing.base, paddingTop: Spacing.lg },
  title: { ...Typography.displaySmall, color: Colors.text.primary, marginBottom: Spacing.md },
  tabs: { flexDirection: 'row', backgroundColor: Colors.background.card, borderRadius: BorderRadius.lg, padding: 4 },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.md },
  tabActive: { backgroundColor: Colors.brand.primary },
  tabText: { ...Typography.labelMedium, color: Colors.text.secondary },
  tabTextActive: { color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.background.secondary, borderTopLeftRadius: BorderRadius['2xl'], borderTopRightRadius: BorderRadius['2xl'], padding: Spacing.xl, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.border.strong, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.base },
});
