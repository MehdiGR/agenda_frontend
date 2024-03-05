import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    gap: 20,
    padding: 10,
    color: "#555555",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  ticketInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    fontSize: 14,
  },
  dateTicket: {
    alignSelf: "flex-start",
    marginBottom: 10,
    fontSize: 14,
  },
  // Add styles for the second table container
  tablesContainer: {
    position: "relative", // Make the container a positioning context for absolute positioning
  },
  table: {
    width: "auto",

    border: "1px solid #bfbfbf",
    margin: "10px 0",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "100%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomWidth: 1,
    borderRightWidth: 1,

    fontWeight: "bold",
    padding: 5,
  },
  tableCol: {
    width: "100%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
  },
  tableCellHeader: {
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  tableCell: {
    margin: "auto",
    padding: 5,
    fontSize: 10,
  },
  secondTable: {
    width: "200px",
    marginLeft: "auto",
    marginRight: 0,
  },
});

// Create Document Component
const MyDocument = ({ ticketLines, PaiementsDeCommande }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Ticket Number and Client Name */}
      <View style={styles.ticketInfo}>
        <Text>Ticket Number: {ticketLines[0].Num_ticket}</Text>
        <Text>Client Name: {ticketLines[0].client}</Text>
      </View>
      {/* Date Ticket */}
      <View style={styles.dateTicket}>
        <Text>Date: {ticketLines[0].date_creation.slice(0, 10)}</Text>
      </View>
      <View style={styles.tablesContainer}>
        {/* Table for ticket lines */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Designation</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Vendeur</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Qte</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>-%</Text>
            </View>
            <View style={[styles.tableColHeader]}>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
          </View>
          {/* Table Rows */}
          {ticketLines.length === 0 ? (
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "100%" }]}>
                <Text style={styles.tableCell}>Aucune prestation</Text>
              </View>
            </View>
          ) : (
            ticketLines.map((item: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.Designation}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.vendeur}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.qte}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item?.remise || 0}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.total_ttc}</Text>
                </View>
              </View>
            ))
          )}
        </View>
        {/* Table for total amounts */}
        <View style={[styles.table, styles.secondTable]}>
          {/* Row for Total HT */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Total HT</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {ticketLines.length > 0
                  ? (ticketLines[0].mntttc / (1 + 0.2)).toFixed(2)
                  : "0.00"}
              </Text>
            </View>
          </View>
          {/* Row for TVA */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>TVA (20%)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {ticketLines.length > 0
                  ? Number(
                      (
                        ticketLines[0].mntttc -
                        ticketLines[0].mntttc / (1 + 0.2)
                      ).toFixed(2)
                    )
                  : "0.00"}
              </Text>
            </View>
          </View>
          {/* Row for Total TTC */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Total TTC</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {ticketLines.length > 0 ? ticketLines[0].mntttc : "0.00"}
              </Text>
            </View>
          </View>
        </View>

        {/* Table for payment details */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Date</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Mode</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Montant</Text>
            </View>
          </View>
          {/* Table Rows */}
          {PaiementsDeCommande.length > 0 ? (
            PaiementsDeCommande.map((item: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.date_paiement.slice(0, 10)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.mode_paiement}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.montant}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "100%" }]}>
                <Text style={styles.tableCell}>Aucun paiement</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
