import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { enrollInCourse } from '../redux/slices/userSlice';
import { COLORS } from '@/constants';


const PaymentScreen = ({ route, navigation }) => {
  const { amount, courseId, studentId } = route.params;
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPaymentLink = async () => {
      try {
        const response = await fetch('http://192.168.107.24:5001/create-payment-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });

        const data = await response.json();
        if (response.ok) {
          setPaymentUrl(data.short_url);
        } else {
          throw new Error(data.error || 'Failed to generate payment link');
        }
      } catch (error) {
        console.log(error, "error");
        Alert.alert('Error', error.message);
      }
    };
    fetchPaymentLink();

  }, []);


  return (
    <View style={{ flex: 1 }}>
      {paymentUrl ? (
        <>
          <WebView
            source={{ uri: paymentUrl }}
            style={{ flex: 1 }}
            onNavigationStateChange={async (navState) => {
              if (navState.url.includes("payment-success")) {
                setIsProcessing(true); // Show loading message while processing

                // Extract payment details from the URL
                const urlParams = new URLSearchParams(navState.url.split("?")[1]);
                const paymentData = {
                  paymentId: urlParams.get("razorpay_payment_id"),
                  paymentLinkId: urlParams.get("razorpay_payment_link_id"),
                  status: urlParams.get("razorpay_payment_link_status"),
                };

                Alert.alert("Payment Successful", "Your payment was successful!", [
                  {
                    text: "OK",
                    onPress: async () => { 
                      
                      await dispatch(enrollInCourse({ studentId, courseId, paymentId: paymentData.paymentId }));
                      navigation.goBack();
                    },
                  },
                ]);
              }
            }}
          />
          {/* Processing Overlay */}
          {isProcessing && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="black" />
              <Text style={styles.processingText}>
                Don't press back button, we are verifying your payment...
              </Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
          <Text style={styles.loadingText}>
            Don't press back button, we are checking for payment...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Light overlay
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PaymentScreen;
