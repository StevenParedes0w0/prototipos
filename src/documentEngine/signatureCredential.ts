export type SignatureCredentialMode = "manual" | "demo";

export const DEMO_CERTIFICATE_PASSWORD = "demo123";

export interface SignatureCredentialState {
  mode: SignatureCredentialMode;
  fileName: string;
  hasManualFile: boolean;
  password: string;
  confirmed: boolean;
}

export const emptySignatureCredential = (): SignatureCredentialState => ({
  mode: "manual",
  fileName: "",
  hasManualFile: false,
  password: "",
  confirmed: false,
});

export const demoSignatureCredential = (actorName: string): SignatureCredentialState => ({
  mode: "demo",
  fileName: `credencial-demo-${actorName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "usuario"}.p12`,
  hasManualFile: false,
  password: DEMO_CERTIFICATE_PASSWORD,
  confirmed: false,
});

export function canSubmitSignatureCredential(
  credential: SignatureCredentialState,
  actorEligible: boolean,
  hasValidSignatureSlot: boolean,
): boolean {
  const manualValid = credential.mode === "manual"
    && credential.hasManualFile
    && /\.(p12|pfx)$/i.test(credential.fileName.trim())
    && credential.password.trim().length > 0;
  const demoValid = credential.mode === "demo"
    && /\.(p12|pfx)$/i.test(credential.fileName.trim())
    && credential.password === DEMO_CERTIFICATE_PASSWORD;
  return actorEligible && hasValidSignatureSlot && credential.confirmed && (manualValid || demoValid);
}
