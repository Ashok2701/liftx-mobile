import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { format } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Card, Button, SectionHeader, Input, Skeleton, Badge } from '@/components/common';
import { useBodyMeasurements, useAddBodyMeasurement, useProgressPhotos } from '@/hooks';
import { useAuthStore } from '@/store/authStore';

const { width } = Dimensions.get('window');
type Tab = 'weight' | 'measurements' | 'photos';

export const ProgressScreen: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const [activeTab, setActiveTab] = useState<Tab>('weight');
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { data: measurements, isLoading: measLoading } = useBodyMeasurements();
  const { data: photos, isLoading: photosLoading } = useProgressPhotos();
  const { mutateAsync: addMeasurement, isPending: adding } = useAddBodyMeasurement();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { weight: '', bodyFat: '', chest: '', waist: '', hips: '', bicepLeft: '', bicepRight: '', thighLeft: '', notes: '' },
  });

  const weightData = measurements?.filter(m => m.weight).slice(-8).map(m => ({ date: m.date, value: m.weight! })) ?? [];

  const onAddMeasurement = async (data: any) => {
    const payload: any = { date: new Date().toISOString().split('T')[0], notes: data.notes };
    if (data.weight) payload.weight = parseFloat(data.weight);
    if (data.bodyFat) payload.bodyFat = parseFloat(data.bodyFat);
    if (data.chest) payload.chest = parseFloat(data.chest);
    if (data.waist) payload.waist = parseFloat(data.waist);
    if (data.hips) payload.hips = parseFloat(data.hips);
    if (data.bicepLeft) payload.bicepLeft = parseFloat(data.bicepLeft);
    if (data.bicepRight) payload.bicepRight = parseFloat(data.bicepRight);
    if (data.thighLeft) payload.thighLeft = parseFloat(data.thighLeft);
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
    setTimeout(() => { setUploading(false); Toast.show({ type: 'success', text1: 'Photo saved! (mock)' }); }, 1000);
  };

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
          <Card style={{ marginBottom: Spacing.base }}>
            <Text style={[Typography.headlineSmall, { color: Colors.text.primary, marginBottom: Spacing.base }]}>Weight over time (kg)</Text>
            {weightData.length >= 2 ? (
              <LineChart
                data={{ labels: weightData.map(d => format(new Date(d.date), 'MMM d')), datasets: [{ data: weightData.map(d => d.value) }] }}
                width={width - Spacing.base * 4}
                height={180}
                chartConfig={{ backgroundColor: 'transparent', backgroundGradientFrom: Colors.background.card, backgroundGradientTo: Colors.background.card, decimalPlaces: 1, color: (o=1) => `rgba(108,71,255,${o})`, labelColor: () => Colors.text.secondary, propsForDots: { r:'5', strokeWidth:'2', stroke: Colors.brand.primary } }}
                bezier style={{ marginLeft: -Spacing.md }}
              />
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: Spacing.xl }}>
                <Text style={{ fontSize: 32, marginBottom: Spacing.sm }}>📊</Text>
                <Text style={[Typography.bodyMedium, { color: Colors.text.secondary }]}>Add 2+ entries to see your chart</Text>
              </View>
            )}
          </Card>
          {measurements && measurements.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.base }}>
              {[{ label:'Weight', value: measurements[0].weight, unit:'kg' }, { label:'Body fat', value: measurements[0].bodyFat, unit:'%' }, { label:'Chest', value: measurements[0].chest, unit:'cm' }, { label:'Waist', value: measurements[0].waist, unit:'cm' }].filter(s=>s.value).map(s=>(
                <Card key={s.label} style={{ width:'47%', alignItems:'center', paddingVertical: Spacing.lg }}>
                  <Text style={[Typography.statSmall, { color: Colors.brand.primary }]}>{s.value}<Text style={[Typography.labelSmall,{color:Colors.text.muted}]}> {s.unit}</Text></Text>
                  <Text style={[Typography.labelSmall, { color: Colors.text.secondary }]}>{s.label}</Text>
                </Card>
              ))}
            </View>
          )}
          <Button title="+ Log measurement" onPress={() => setShowForm(true)} variant="ghost" />
          <SectionHeader title="History" />
          {measLoading ? [1,2,3].map(i=><Skeleton key={i} height={70} style={{marginBottom:Spacing.sm}}/>) :
            measurements?.map(m=>(
              <Card key={m.id} style={{marginBottom:Spacing.sm}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={[Typography.labelMedium,{color:Colors.text.secondary}]}>{format(new Date(m.date),'MMM d, yyyy')}</Text>
                  {m.weight && <Text style={[Typography.headlineSmall,{color:Colors.text.primary}]}>{m.weight} kg</Text>}
                </View>
                <View style={{flexDirection:'row',flexWrap:'wrap',gap:Spacing.sm,marginTop:Spacing.xs}}>
                  {m.chest&&<Badge label={`Chest: ${m.chest}cm`} variant="neutral" size="sm"/>}
                  {m.waist&&<Badge label={`Waist: ${m.waist}cm`} variant="neutral" size="sm"/>}
                  {m.bodyFat&&<Badge label={`BF: ${m.bodyFat}%`} variant="brand" size="sm"/>}
                </View>
              </Card>
            ))
          }
        </ScrollView>
      )}

      {activeTab === 'measurements' && (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Button title="+ Add measurements" onPress={() => setShowForm(true)} style={{ marginBottom: Spacing.base }} />
          {measLoading ? [1,2,3].map(i=><Skeleton key={i} height={100} style={{marginBottom:Spacing.sm}}/>) :
            measurements?.map(m=>(
              <Card key={m.id} style={{marginBottom:Spacing.sm}}>
                <Text style={[Typography.labelMedium,{color:Colors.text.secondary,marginBottom:Spacing.sm}]}>{format(new Date(m.date),'MMMM d, yyyy')}</Text>
                <View style={{flexDirection:'row',flexWrap:'wrap',gap:Spacing.sm}}>
                  {[{k:'weight',l:'Weight',u:'kg',v:m.weight},{k:'bodyFat',l:'Body fat',u:'%',v:m.bodyFat},{k:'chest',l:'Chest',u:'cm',v:m.chest},{k:'waist',l:'Waist',u:'cm',v:m.waist},{k:'hips',l:'Hips',u:'cm',v:m.hips},{k:'bicepLeft',l:'Bicep L',u:'cm',v:m.bicepLeft}].filter(s=>s.v).map(s=>(
                    <View key={s.k} style={{width:'30%',padding:Spacing.sm,backgroundColor:Colors.background.elevated,borderRadius:BorderRadius.md,alignItems:'center'}}>
                      <Text style={[Typography.statSmall,{color:Colors.text.primary}]}>{s.v}<Text style={[Typography.labelSmall,{color:Colors.text.muted}]}> {s.u}</Text></Text>
                      <Text style={[Typography.labelSmall,{color:Colors.text.secondary}]}>{s.l}</Text>
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
          <Button title={uploading ? 'Uploading...' : '+ Upload photo'} onPress={onUploadPhoto} loading={uploading} style={{marginBottom:Spacing.base}} />
          {photos && photos.length > 0 ? (
            <View style={{flexDirection:'row',flexWrap:'wrap',gap:Spacing.sm}}>
              {photos.map(p=>(
                <View key={p.id} style={{width:'47%',height:160,backgroundColor:Colors.background.card,borderRadius:BorderRadius.lg,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:Colors.border.default}}>
                  <Text style={{fontSize:32}}>📷</Text>
                  <Text style={[Typography.labelSmall,{color:Colors.text.muted,marginTop:4}]}>{format(new Date(p.date),'MMM d')}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={{alignItems:'center',padding:Spacing['3xl']}}>
              <Text style={{fontSize:48}}>📸</Text>
              <Text style={[Typography.headlineSmall,{color:Colors.text.primary,marginTop:Spacing.base}]}>No photos yet</Text>
              <Text style={[Typography.bodyMedium,{color:Colors.text.secondary,textAlign:'center',marginTop:Spacing.sm}]}>Upload your first photo to track your transformation</Text>
            </View>
          )}
        </ScrollView>
      )}

      <Modal visible={showForm} animationType="slide" transparent onRequestClose={() => setShowForm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={[Typography.headlineMedium,{color:Colors.text.primary,marginBottom:Spacing.xl}]}>Log measurements</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Controller control={control} name="weight" render={({field:{onChange,value}})=><Input label="Weight (kg)" placeholder="e.g. 75.5" value={value} onChangeText={onChange} keyboardType="numeric"/>} />
              <Controller control={control} name="bodyFat" render={({field:{onChange,value}})=><Input label="Body fat (%)" placeholder="e.g. 18.5" value={value} onChangeText={onChange} keyboardType="numeric"/>} />
              {['chest','waist','hips','bicepLeft','bicepRight','thighLeft'].map(f=>(
                <Controller key={f} control={control} name={f as any} render={({field:{onChange,value}})=><Input label={f.charAt(0).toUpperCase()+f.slice(1).replace(/([A-Z])/g,' $1')+' (cm)'} placeholder="cm" value={value} onChangeText={onChange} keyboardType="numeric"/>}/>
              ))}
              <Controller control={control} name="notes" render={({field:{onChange,value}})=><Input label="Notes" placeholder="How are you feeling?" value={value} onChangeText={onChange} multiline numberOfLines={3}/>} />
              <View style={{flexDirection:'row',gap:Spacing.sm,marginTop:Spacing.sm}}>
                <Button title="Cancel" onPress={()=>setShowForm(false)} variant="ghost" style={{flex:1}}/>
                <Button title="Save" onPress={handleSubmit(onAddMeasurement)} loading={adding} style={{flex:1}}/>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.background.primary},
  scroll:{padding:Spacing.base,paddingBottom:Spacing['5xl']},
  header:{padding:Spacing.base,paddingTop:Spacing.lg},
  title:{...Typography.displaySmall,color:Colors.text.primary,marginBottom:Spacing.md},
  tabs:{flexDirection:'row',backgroundColor:Colors.background.card,borderRadius:BorderRadius.lg,padding:4},
  tab:{flex:1,paddingVertical:Spacing.sm,alignItems:'center',borderRadius:BorderRadius.md},
  tabActive:{backgroundColor:Colors.brand.primary},
  tabText:{...Typography.labelMedium,color:Colors.text.secondary},
  tabTextActive:{color:'#fff'},
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'flex-end'},
  modalSheet:{backgroundColor:Colors.background.secondary,borderTopLeftRadius:BorderRadius['2xl'],borderTopRightRadius:BorderRadius['2xl'],padding:Spacing.xl,maxHeight:'90%'},
  modalHandle:{width:40,height:4,backgroundColor:Colors.border.strong,borderRadius:2,alignSelf:'center',marginBottom:Spacing.base},
});
