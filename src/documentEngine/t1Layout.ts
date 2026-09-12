import { CSSProperties } from "react";

export const T1_FOOTER_TEXT = "Documento de uso interno controlado por la Universidad Técnica de Ambato";
export const T1_FORMAT_TEXT = "Formato Nº: UTA-SGC-A-2-1-P7-T1";

export const t1FooterStyle: CSSProperties = {
  marginTop: 18,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto 22px",
  columnGap: 12,
  alignItems: "center",
  fontSize: 7.2,
  lineHeight: 1,
  color: "#475569",
  fontFamily: "Helvetica, Arial, sans-serif",
  whiteSpace: "nowrap",
};

export const t1CoverStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 640,
};

export const t1CoverMainBlockStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 28,
  width: "100%",
  maxWidth: 620,
  margin: "0 auto",
  textAlign: "center",
};
