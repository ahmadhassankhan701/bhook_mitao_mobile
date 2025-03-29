import { StyleSheet } from "react-native";
import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import StripeApp from "../../../components/Payment/StripeApp";
const Money = () => {
	return (
		<StripeProvider publishableKey="pk_test_51KJMVMSHhVKq4SOrgh0V8v8Myy5USi8FZcxHOUfv2WTEm6BfoNB730vopdGW9o4Mc0PatYNO2YghBDBVmtVuRDIb00TG1FKHiy">
			<StripeApp />
		</StripeProvider>
	);
};

export default Money;

const styles = StyleSheet.create({});
