import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Card, Button, SectionHeader, Badge, ProgressBar, Input, Skeleton } from '@/components/common';
import { useActiveDiet, useLogMeal } from '@/hooks';
import { MealType, Meal } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';

const MEAL_ICONS: Record<MealType, string> = { BREAKFAST:'🌅', LUNCH:'☀️', SNACKS:'🍎', DINNER:'🌙', PRE_WORKOUT:'⚡', POST_WORKOUT:'💪' };
const MEAL_LABELS: Record<MealType, string> = { BREAKFAST:'Breakfast', LUNCH:'Lunch', SNACKS:'Snacks', DINNER:'Dinner', PRE_WORKOUT:'Pre-workout', POST_WORKOUT:'Post-workout' };

export const DietScreen: React.FC = () => {
  const [uploadingMeal, setUploadingMeal] = useState<MealType | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('BREAKFAST');
  const { data: dietPlan, isLoading } = useActiveDiet();
  const { mutateAsync: logMeal, isPending: logging } = useLogMeal();
  const { control, handleSubmit, reset } = useForm({ defaultValues: { notes: '' } });

  const onUploadMealPhoto = async (mealType: MealType) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Toast.show({ type:'error', text1:'Permission denied' }); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (result.canceled) return;
    setUploadingMeal(mealType);
    setTimeout(async () => {
      await logMeal({ mealType, date: new Date().toISOString().split('T')[0] });
      Toast.show({ type:'success', text1:'Meal logged!', text2:`${MEAL_LABELS[mealType]} photo saved` });
      setUploadingMeal(null);
    }, 800);
  };

  const onLogMeal = async (data: any) => {
    await logMeal({ mealType: selectedMealType, notes: data.notes, date: new Date().toISOString().split('T')[0] });
    Toast.show({ type:'success', text1:'Meal logged!' });
    reset();
    setShowLogModal(false);
  };

  if (isLoading) return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Diet Plan</Text></View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {[1,2,3,4].map(i=><Skeleton key={i} height={120} style={{marginBottom:Spacing.sm}}/>)}
      </ScrollView>
    </View>
  );

  if (!dietPlan) return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Diet Plan</Text></View>
      <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:Spacing['3xl']}}>
        <Text style={{fontSize:64}}>🥗</Text>
        <Text style={[Typography.headlineMedium,{color:Colors.text.primary,marginTop:Spacing.base}]}>No diet plan yet</Text>
        <Text style={[Typography.bodyMedium,{color:Colors.text.secondary,textAlign:'center',marginTop:Spacing.sm}]}>Your trainer will assign a personalized diet plan based on your goals.</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diet Plan</Text>
        <Text style={[Typography.bodySmall,{color:Colors.text.secondary}]}>{dietPlan.name}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Macros */}
        <Card style={{marginBottom:Spacing.base}}>
          <Text style={[Typography.headlineSmall,{color:Colors.text.primary,marginBottom:Spacing.sm}]}>Daily targets</Text>
          <View style={{flexDirection:'row',alignItems:'baseline',marginBottom:Spacing.base}}>
            <Text style={[Typography.statLarge,{color:Colors.brand.primary}]}>{dietPlan.targetCalories}</Text>
            <Text style={[Typography.labelMedium,{color:Colors.text.secondary,marginLeft:Spacing.xs,marginTop:12}]}> kcal / day</Text>
          </View>
          <View style={{flexDirection:'row',gap:Spacing.md}}>
            {[{label:'Protein',value:dietPlan.targetProtein,color:Colors.muscle.chest},{label:'Carbs',value:dietPlan.targetCarbs,color:Colors.muscle.cardio},{label:'Fat',value:dietPlan.targetFat,color:Colors.warning.default}].map(m=>(
              <View key={m.label} style={{flex:1}}>
                <Text style={[Typography.statSmall,{color:m.color}]}>{m.value}<Text style={[Typography.labelSmall,{color:Colors.text.muted}]}>g</Text></Text>
                <Text style={[Typography.labelSmall,{color:Colors.text.secondary}]}>{m.label}</Text>
                <ProgressBar progress={1} color={m.color} style={{marginTop:Spacing.xs}}/>
              </View>
            ))}
          </View>
        </Card>

        <SectionHeader title="Meal plan" />
        {dietPlan.meals.map(meal=>(
          <Card key={meal.id} style={{marginBottom:Spacing.sm}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:Spacing.md}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontSize:24}}>{MEAL_ICONS[meal.type]}</Text>
                <View style={{marginLeft:Spacing.sm}}>
                  <Text style={[Typography.headlineSmall,{color:Colors.text.primary}]}>{MEAL_LABELS[meal.type]}</Text>
                  {meal.time&&<Text style={[Typography.bodySmall,{color:Colors.text.secondary}]}>{meal.time}</Text>}
                </View>
              </View>
              <Text style={[Typography.statSmall,{color:Colors.brand.primary}]}>{meal.totalCalories}<Text style={[Typography.labelSmall,{color:Colors.text.muted}]}> kcal</Text></Text>
            </View>
            <View style={{flexDirection:'row',backgroundColor:Colors.background.elevated,borderRadius:BorderRadius.md,padding:Spacing.sm,marginBottom:Spacing.md,gap:Spacing.md}}>
              {[{l:'P',v:meal.totalProtein,c:Colors.muscle.chest},{l:'C',v:meal.totalCarbs,c:Colors.muscle.cardio},{l:'F',v:meal.totalFat,c:Colors.warning.default}].map(m=>(
                <View key={m.l} style={{alignItems:'center'}}>
                  <Text style={[Typography.labelMedium,{color:m.c}]}>{m.v}g</Text>
                  <Text style={[Typography.labelSmall,{color:Colors.text.muted}]}>{m.l}</Text>
                </View>
              ))}
            </View>
            <View style={{gap:6}}>
              {meal.items.map((item,i)=>(
                <View key={i} style={{flexDirection:'row',alignItems:'center'}}>
                  <Text style={[Typography.bodyMedium,{color:Colors.text.primary,flex:1}]}>{item.name}</Text>
                  <Text style={[Typography.bodySmall,{color:Colors.text.secondary}]}>{item.quantity}</Text>
                  <Text style={[Typography.bodySmall,{color:Colors.text.muted,marginLeft:Spacing.sm}]}>{item.calories}cal</Text>
                </View>
              ))}
            </View>
            <View style={{flexDirection:'row',marginTop:Spacing.base,gap:Spacing.sm}}>
              <Button title={uploadingMeal===meal.type?'...':'📷 Photo'} onPress={()=>onUploadMealPhoto(meal.type)} variant="ghost" size="sm" loading={uploadingMeal===meal.type} style={{flex:1}}/>
              <Button title="✓ Log" onPress={()=>{setSelectedMealType(meal.type);setShowLogModal(true);}} size="sm" style={{flex:1}}/>
            </View>
          </Card>
        ))}

        {dietPlan.notes&&(
          <Card style={{marginTop:Spacing.sm}}>
            <Text style={[Typography.labelMedium,{color:Colors.text.secondary,marginBottom:Spacing.xs}]}>💡 Trainer notes</Text>
            <Text style={[Typography.bodyMedium,{color:Colors.text.primary}]}>{dietPlan.notes}</Text>
          </Card>
        )}
      </ScrollView>

      <Modal visible={showLogModal} transparent animationType="slide" onRequestClose={()=>setShowLogModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle}/>
            <Text style={[Typography.headlineMedium,{color:Colors.text.primary,marginBottom:Spacing.base}]}>
              {MEAL_ICONS[selectedMealType]} Log {MEAL_LABELS[selectedMealType]}
            </Text>
            <Controller control={control} name="notes" render={({field:{onChange,value}})=>(
              <Input label="Notes (optional)" placeholder="What did you eat?" value={value} onChangeText={onChange} multiline numberOfLines={4}/>
            )}/>
            <View style={{flexDirection:'row',gap:Spacing.sm}}>
              <Button title="Cancel" onPress={()=>setShowLogModal(false)} variant="ghost" style={{flex:1}}/>
              <Button title="Log meal" onPress={handleSubmit(onLogMeal)} loading={logging} style={{flex:1}}/>
            </View>
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
  title:{...Typography.displaySmall,color:Colors.text.primary},
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'flex-end'},
  modalSheet:{backgroundColor:Colors.background.secondary,borderTopLeftRadius:BorderRadius['2xl'],borderTopRightRadius:BorderRadius['2xl'],padding:Spacing.xl},
  modalHandle:{width:40,height:4,backgroundColor:Colors.border.strong,borderRadius:2,alignSelf:'center',marginBottom:Spacing.base},
});
