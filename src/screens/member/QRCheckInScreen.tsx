import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { useQRCheckIn, useTodayAttendance } from '@/hooks';
import { format } from 'date-fns';

type ScanState = 'scanning' | 'success' | 'error';

export const QRCheckInScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data: todayAttendance } = useTodayAttendance();
  const { mutateAsync: checkIn, isPending } = useQRCheckIn();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [message, setMessage] = useState('');
  const [scanned, setScanned] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const isCheckedIn = !!todayAttendance && !todayAttendance.checkOutTime;
  const stateColors = { scanning: Colors.brand.primary, success: Colors.success.default, error: Colors.error.default };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isPending) return;
    setScanned(true);

    if (!data.startsWith('GYM_BRANCH:')) {
      setScanState('error');
      setMessage('Invalid QR code. Scan the gym entrance QR.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => { setScanState('scanning'); setScanned(false); }, 2500);
      return;
    }

    try {
      const branchId = data.split(':')[1];
      await checkIn({ qrCode: data, branchId });
      setScanState('success');
      setMessage('Checked in! Time to crush it 💪');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Vibration.vibrate(200);
      Toast.show({ type: 'success', text1: 'Welcome!', text2: "You're checked in. Have a great workout!" });
      setTimeout(() => navigation.goBack(), 2500);
    } catch (err: any) {
      setScanState('error');
      setMessage(err?.message ?? 'Check-in failed. Try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => { setScanState('scanning'); setScanned(false); }, 2500);
    }
  };

  const handleDemoCheckIn = () => handleBarCodeScanned({ data: 'GYM_BRANCH:branch-1' });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20, color: '#fff' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check In</Text>
        <View style={{ width: 40 }} />
      </View>

      {isCheckedIn ? (
        <View style={styles.centerContent}>
          <View style={[styles.circle, { backgroundColor: Colors.success.dim }]}>
            <Text style={{ fontSize: 64 }}>✅</Text>
          </View>
          <Text style={[Typography.headlineLarge, { color: Colors.text.primary, marginTop: Spacing.xl, textAlign: 'center' }]}>
            Already checked in!
          </Text>
          <Text style={[Typography.bodyMedium, { color: Colors.text.secondary, marginTop: Spacing.sm, textAlign: 'center' }]}>
            Since {format(new Date(todayAttendance!.checkInTime), 'h:mm a')}
          </Text>
          <TouchableOpacity style={{ marginTop: Spacing['2xl'], width: '100%' }} onPress={() => navigation.goBack()}>
            <LinearGradient colors={['#6C47FF', '#3B1FCC']} style={styles.gradBtn}>
              <Text style={[Typography.labelLarge, { color: '#fff' }]}>Back to dashboard</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Camera */}
          {permission?.granted ? (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            />
          ) : (
            <View style={[StyleSheet.absoluteFillObject, styles.noCamera]}>
              <Text style={{ fontSize: 48, marginBottom: Spacing.base }}>📷</Text>
              <Text style={[Typography.bodyMedium, { color: Colors.text.secondary, textAlign: 'center', paddingHorizontal: Spacing.xl }]}>
                {permission?.canAskAgain
                  ? 'Camera permission needed'
                  : 'Enable camera in Settings'}
              </Text>
              {permission?.canAskAgain && (
                <TouchableOpacity onPress={requestPermission} style={{ marginTop: Spacing.base }}>
                  <LinearGradient colors={['#6C47FF', '#3B1FCC']} style={[styles.gradBtn, { paddingHorizontal: Spacing.xl }]}>
                    <Text style={[Typography.labelLarge, { color: '#fff' }]}>Allow Camera</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Overlay */}
          <View style={styles.overlay}>
            <View style={styles.topInfo}>
              <Animated.View style={[styles.scanIndicator, { borderColor: stateColors[scanState], transform: [{ scale: scanState === 'scanning' ? pulseAnim : 1 }] }]}>
                <Text style={{ fontSize: 36 }}>
                  {scanState === 'success' ? '✅' : scanState === 'error' ? '❌' : '📱'}
                </Text>
              </Animated.View>
              <Text style={styles.scanTitle}>
                {scanState === 'success' ? 'Success!' : scanState === 'error' ? 'Error' : 'Scan Branch QR'}
              </Text>
              <Text style={styles.scanSub}>{message || 'Point camera at the QR code at the gym entrance'}</Text>
            </View>

            <View style={[styles.scanFrame, { borderColor: stateColors[scanState] }]} />

            <View style={styles.bottomArea}>
              <TouchableOpacity onPress={handleDemoCheckIn}>
                <LinearGradient colors={['#6C47FF', '#3B1FCC']} style={styles.gradBtn}>
                  <Text style={[Typography.labelLarge, { color: '#fff' }]}>🚀 Demo Check-In (No QR needed)</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={[Typography.bodySmall, { color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: Spacing.sm }]}>
                Tap above to simulate check-in with mock data
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.headlineSmall, color: '#fff' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background.primary, paddingHorizontal: Spacing.xl, paddingTop: 100 },
  circle: { width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center' },
  gradBtn: { borderRadius: BorderRadius.lg, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, alignItems: 'center' },
  noCamera: { backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', paddingTop: 120 },
  topInfo: { alignItems: 'center', paddingHorizontal: Spacing.xl },
  scanIndicator: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(108,71,255,0.15)', marginBottom: Spacing.md },
  scanTitle: { ...Typography.headlineMedium, color: '#fff', textAlign: 'center' },
  scanSub: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: Spacing.sm },
  scanFrame: { width: 220, height: 220, borderWidth: 3, borderRadius: BorderRadius.xl, alignSelf: 'center', backgroundColor: 'transparent' },
  bottomArea: { padding: Spacing.xl, paddingBottom: 60 },
});
