/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type Request } from "@prisma/client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export const PaymentReportGenerationButton = ({
  request,
}: {
  request: Request;
}) => {
  return (
    <PDFDownloadLink
      document={<PaymentReport request={request} />}
      style={{
        width: "100%",
        borderRadius: "0.25em",
        padding: 10,
        textAlign: "center",
        color: "#4C6FFF",
        backgroundColor: "#E4ECF7",
      }}
      fileName={`${request.id}-report.pdf`}
    >
      {({ loading }) => (loading ? "Loading document..." : "Generate Report")}
    </PDFDownloadLink>
  );
};

// Payment Report Document
const PaymentReport = (
  { request }: { request: Request } //
) => {
  const styles = StyleSheet.create({
    page: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: window.innerWidth,
      height: window.innerHeight,
    },
    content: {
      width: "70%",
      display: "flex",
      flexDirection: "column",
    },
    section: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text>Request ID:</Text>
            <Text>{request.id}</Text>
          </View>
          <View style={styles.section}>
            <Text>Service:</Text>
            <Text>{request.serviceName}</Text>
          </View>
          <View style={styles.section}>
            <Text>Quantity:</Text>
            <Text>{request.unit}</Text>
          </View>
          <View style={styles.section}>
            <Text>Description:</Text>
            <Text>{request.description}</Text>
          </View>
          <View style={styles.section}>
            <Text>Total Price:</Text>
            <Text>${request.price}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
